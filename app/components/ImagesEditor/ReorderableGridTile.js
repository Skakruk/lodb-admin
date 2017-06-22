import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import {findDOMNode} from 'react-dom';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

const dndType = props => props.listIdentifier || 'reorderableGridTile';

const cardSource = {
    beginDrag(props) {
        let {index} = props;
        return {
            index
        }
    }
};

const cardTarget = {
    hover(props, monitor, component) {
        let {id: dragId, index: dragIndex} = monitor.getItem();
        let {id: hoverId, index: hoverIndex} = props;
        if (dragIndex === hoverIndex) return; // Don't replace items with themselves

        let hoveringOffsets = findDOMNode(component).getBoundingClientRect()
        let penPercent = 0.50 // Percentage distance into next item before swap
        let penMin = (hoveringOffsets.right - hoveringOffsets.left) * penPercent
        let clientOffset = monitor.getClientOffset()
        let penX;

        // Dragging downwards
        if (dragIndex < hoverIndex) penX = clientOffset.x - hoveringOffsets.left
        // Dragging upwards
        if (dragIndex > hoverIndex) penX = hoveringOffsets.right - clientOffset.x

        if (!(penX > penMin)) return;

        props.moveCard({dragId, dragIndex, hoverId, hoverIndex})

        monitor.getItem().index = hoverIndex
    }
};

@DropTarget('card', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource('card', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
@CSSModules(styles)
export default class Card extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        // text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
    };

    render() {
        const { children, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <div style={{ opacity }} styleName="img-card">
                {children}
            </div>,
        ));
    }
}