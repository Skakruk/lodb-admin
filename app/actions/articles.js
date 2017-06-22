import * as api from "./api";
import {normalize} from "normalizr";
import {
    ADD_ARTICLES,
    ADD_ARTICLE,
    UPDATE_ARTICLE,
    ADD_ARTICLE_CONTENT,
    UPDATE_ARTICLE_CONTENT,
    CREATE_ARTICLE_CONTENT,
    REMOVE_ARTICLE_CONTENT
} from '../reducers/articles';

export const PUSH_ARTICLE = "PUSH_ARTICLE";

export function getArticleByUrl(url) {
    return dispatch => {
        var articleId = dispatch(findArticleInCacheByUrl(url));
        if (!articleId) {
            return dispatch(api.get(`/articles?url=${url}`))
                .then(response => {
                    dispatch({
                        type: PUSH_ARTICLE,
                        article: response[0]
                    });
                    return response[0].id
                });
        } else {
            return Promise.resolve(articleId);
        }
    }
}

export const PUSH_ARTICLES = "PUSH_ARTICLES";

export function getArticlesByParentIdAndType(id, types) {
    return dispatch => dispatch(api.get(`/articles?parent=${id}&type=${types.join(',')}`))
        .then(response => {
            dispatch({
                type: PUSH_ARTICLES,
                articles: response,
                parent: id
            });
        });
}

export function findArticleInCacheByUrl(url) {
    return (dispatch, getState) => {
        var state = getState().articles;
        return state.ids.find(id => state.list[id].url === url)
    }
}

export function getArticle(id) {
    return (dispatch, getState, {api, schema}) =>
        dispatch(api.get(`/articles/${id}`))
            .then(response => {
                const data = normalize(response, {
                    article: schema.articleSchema
                });
                dispatch({
                    type: ADD_ARTICLE_CONTENT,
                    payload: data.entities.articleContent
                });
                dispatch({
                    type: ADD_ARTICLE,
                    payload: data.entities.articles
                });
            });
}

export function saveArticle(data) {
    return dispatch => dispatch(data.created_at ? api.put(`/articles/${data.id}`, data) : api.post(`/articles`, data))
        .then(response => {
            dispatch({
                type: PUSH_ARTICLE,
                articleEntry: response
            });
        });
}

export function createArticle(article) {
    return dispatch => dispatch({
        type: ADD_ARTICLE,
        payload: {
            [article.id]: article
        }
    });
}

export function getParentArticle(id) {
    return dispatch => dispatch(api.get(`/articles?children=${id}`))
        .then((response) => {
            dispatch({
                type: PUSH_ARTICLES,
                articles: response
            });
        });
}

export function getArticlesTree(where) {
    var query = "";
    if (where) {
        query = Object.keys(where).reduce((query, key) => {
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(where[key])}`);
            return query;
        }, []).join("&")
    }
    return (dispatch, getState, {api, schema}) =>
        dispatch(api.get(`/articles/tree${(query.length > 0 ? `?${query}` : "")}`))
            .then(response => {
                const data = normalize(response, {
                    articles: schema.articleList
                });
                dispatch({
                    type: ADD_ARTICLES,
                    parent,
                    payload: data.entities.articles
                });
            });
}
export function updateArticle(id, content) {
    return dispatch => dispatch({
        type: UPDATE_ARTICLE,
        id,
        payload: content
    });
}
export function deleteArticle(id) {
    return dispatch => dispatch(api.remove(`/articles/${id}`));
}

export function updateContent(id, content) {
    return dispatch => dispatch({
        type: UPDATE_ARTICLE_CONTENT,
        id,
        payload: content
    });
}

export function createContent(property, parent, article) {
    return (dispatch) => {
        dispatch({
            type: ADD_ARTICLE_CONTENT,
            payload: {
                [property.id]: property
            }
        });
        if (parent) {
            let children = (parent.children || []);
            children.push(property.id);
            dispatch({
                type: UPDATE_ARTICLE_CONTENT,
                id: parent.id,
                payload: {children}
            });
        }

        if (article) {
            let articleContent = (article.content || []);
            articleContent.push(property.id);
            dispatch(updateArticle(article.id, {
                content: articleContent
            }));
        }
    }
}

export function removeContent(property, article) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_ARTICLE_CONTENT,
            id: property.id
        });

        let articleContent = (article.content || []);
        articleContent = articleContent.filter(id => id != property.id);
        dispatch(updateArticle(article.id, {
            content: articleContent
        }));
    }
}