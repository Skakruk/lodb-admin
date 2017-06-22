import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {getArticlesTree} from "../actions/articles";

import {articleList as articlesSchema} from '../schemas';
import {denormalize} from "denormalizr";

import {Tree, Input} from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class ArticlesList extends Component {
    state = {
        articlesList: [],
        filterQuery: ""
    };

    componentWillMount() {
        this.props.getArticlesTree();
    }

    setFilter = (e) => {
        let value = e;
        if (typeof e === 'object') value = e.target.value;
        this.setState({
            ...this.state,
            filterQuery: value
        });
    };

    filterArticles(articles, filter) {
        return filter && filter.length > 0 ?
            Object.keys(articles).filter(id => articles[id].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) : articles;
    };

    componentWillReceiveProps(newProps) {
        this.setState({
            ...this.state,
            articlesList: newProps.articles
        });
    }

    subArticles(articles, searchTerm) {
        return articles.map(article => {
            let title = article.name;
            if (article.children && article.children.length > 0) {
                return (<TreeNode
                    key={article.id} title={title}>
                    {this.subArticles(article.children, searchTerm)}
                </TreeNode>);
            }
            return (<TreeNode key={article.id} title={title}/>);
        })
    }

    articlesTree(articlesList) {
        let articles = denormalize(Object.keys(articlesList).filter(id => articlesList[id].parent_id == null), {articles: articlesList}, articlesSchema);
        return this.subArticles(articles);
    }

    filteredArticlesList(articlesList, filterQuery) {
        let articles = Object.keys(articlesList).map(id => articlesList[id]);
        return articles
            .filter(article => article.name.toLowerCase().indexOf(filterQuery.toLowerCase()) > -1)
            .map(article => {
            return (<TreeNode key={article.id} title={article.name}/>)
        })
    }

    selectNode = (selectedKeys, e) => {
        this.props.dispatch(push(`/articles/${e.node.props.eventKey}`))
    };

    render() {
        let {articlesList, filterQuery} = this.state;

        return (
            <div style={{padding: 5}}>
                <Search

                    placeholder="Search..."
                    onChange={this.setFilter}
                />
                <Tree
                    onSelect={this.selectNode}
                >
                    { filterQuery.length > 0 ?
                        this.filteredArticlesList(articlesList, filterQuery):
                        this.articlesTree(articlesList)
                    }
                </Tree>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        articles: state.articlesList
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticlesTree,
        dispatch
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesList);