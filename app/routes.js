import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import Admin from './containers/Admin';
import Article from './containers/Article/Article';
import LoginContainer from './containers/login';
import ArticlesList from "./components/ArticlesList";
import {requireAuth} from './actions/auth';

export default function () {
    return (
        <Route>
            <Route path="/" title="" onEnter={requireAuth} component={Admin}>
                <Route path="/articles" components={{main: Article, menu: ArticlesList}}>
                    <Route title="Редагування статті" path="/articles/:id" component={Article}/>
                </Route>
            </Route>
            <Route path="/login" component={LoginContainer}/>
        </Route>
    );
}
