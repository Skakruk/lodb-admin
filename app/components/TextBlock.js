import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './TextBlock.css';
import AlloyEditorComponent from '../components/AlloyEditorComponent';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import parentStyles from './ParentBlock.css';

export  default class TextBlock extends Component {
    handleBlockChange = (content) => {
	    this.props.onBlockChange({
		    type: "text",
		    content
	    })
    };

    render() {
        let {
            onBlockDelete,
            content
        } = this.props;
        return (
            <div className={parentStyles.editableBlock}>
                <div className={classNames(styles.textBlockEdit, styles.textBlock, parentStyles.editableContainer)}>
                    <AlloyEditorComponent
                        onBlockChange={this.handleBlockChange}
                        content={content}/>
                </div>
                <div className={parentStyles["block-actions"]}>
                    <IconButton tooltip="Delete" onTouchTap={onBlockDelete}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
        )

    }
}