import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import {getArticlesByParentIdAndType} from '../actions/articles';
import DittoEditor from './DittoEditor';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import {Link} from 'react-router';
import TextParser from './TextParser';
import styles from './DittoBlock.css';
import parentStyles from './ParentBlock.css';

export const templates = {
    'news': {
        name: "Новини",
        render: (article, idx) => (
            <div styleName="ditto-entry-news" key={idx}>
                <h2 styleName="ditto-entry-news-title">
                    <Link styleName="ditto-entry-news-title-link" to={article.url}>{article.content.ua.title}</Link>
                </h2>
                <span styleName="ditto-entry-news-date">{article.updatedOn}</span>
                <div styleName="ditto-entry-news-intro">
                    {
                        article.mainImage && (<span data-fullimg={article.mainImage}>
                            <img styleName="ditto-entry-news-main-image"
                                 src={`http://localhost:3001/media/images/${article.mainImage}?w=200`}/>
                        </span>)
                    }
                    {
                        article.content.ua.introText && (<div styleName="ditto-entry-news-content">
                            {TextParser(article.content.ua.introText)}</div>)
                    }
                </div>
                {
                    ['news', 'link'].includes(article.type) && (<div styleName="ditto-entry-news-footer">
                        {article.type == 'news' && <Link to={article.url}>Читати далі</Link>}
                        {article.type == 'link' && <a href={article.url} target="_blank">Читати далі</a>}
                    </div>)
                }
            </div>
        )
    }
};

class DittoBlock extends Component {
    static propTypes = {
        parent: PropTypes.string.isRequired,
        template: PropTypes.string.isRequired
    };

    render() {
        var {
            onBlockChange,
            onBlockDelete,
            template,
            parent,
            articlesList,
            articlesParents
        } = this.props;

        var dittoArticles = [];

        if (articlesParents[parent] && articlesParents[parent].length) {
            dittoArticles = articlesParents[parent].map(id => articlesList[id]);
        }

        return (
            <div className={parentStyles.editableBlock}>
                <div className={classNames(styles.dittoBlock, parentStyles.editableContainer)}>
                    <DittoEditor onBlockChange={onBlockChange} parent={parent} template={template}/>
                </div>
                {dittoArticles.map(templates[template].render)}

                <div className={parentStyles["block-actions"]}>
                    <IconButton tooltip="Delete block" onTouchTap={onBlockDelete}>
                        <Delete />
                    </IconButton>
                </div>

            </div>

        )

    }
}

function mapStateToProps(state) {
    return {
        articlesList: state.articles.list,
        articlesIds: state.articles.ids,
        articlesParents: state.articles.parents,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getArticlesByParentIdAndType
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(DittoBlock, styles));