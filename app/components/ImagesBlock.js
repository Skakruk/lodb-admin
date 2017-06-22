import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import ImagesEditor from './ImagesEditor/ImagesEditor';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import styles from './ImagesBlock.css';
import parentStyles from './ParentBlock.css';

export  default class ImagesBlock extends Component {
    state = {
        showEditor: false,
        images: []
    };

    componentWillMount() {
        this.setState({
            ...this.state,
            images: this.props.images
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ...this.state,
            images: newProps.images
        })

    }

    render() {
        var {
            onBlockChange,
            onBlockDelete
        } = this.props;

        var {images} = this.state;

        return (
            <div className={parentStyles.editableBlock}>
                <div className={classNames(styles.imageBlockEdit, styles.imageBlock, parentStyles.editableContainer)}>
                    <ImagesEditor
                        onBlockChange={onBlockChange}
                        images={images}/>
                </div>

                <div className={parentStyles["block-actions"]}>
                    <IconButton tooltip="Delete block" onTouchTap={onBlockDelete}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
        )

    }
}