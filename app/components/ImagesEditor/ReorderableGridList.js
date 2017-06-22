import React, {Component} from 'react'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@DragDropContext(HTML5Backend)
@CSSModules(styles)
export default class GridList extends Component {
    render() {
        const {children, tiles} = this.props;
        return (
            <div styleName="images-grid-list">
                {tiles}
                {children}
            </div>
        );
    }
}