import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {getFolderTree} from "../../actions/images";
import {denormalize} from 'denormalizr';
import {mediaList as mediaSchema} from '../../schemas';
import {Tree, Input} from 'antd';

const TreeNode = Tree.TreeNode;

@CSSModules(styles)
class ImagesDirectories extends Component {
    state = {
        selectedDirectoryId: null
    };

    componentDidMount() {
        this.props.getFolderTree();
    };

    async componentWillReceiveProps(newProps) {
        if (!this.state.selectedDirectoryId) {
            let firstDirId = Object.keys(newProps.media).filter(id => newProps.media[id].parent_id == -1).pop();
            this.setState({
                ...this.state,
                selectedDirectoryId: firstDirId,
                structure: newProps.media
            });

            this.props.onDirectorySelect(firstDirId);
        }
    }

    selectDirectory = async(selectedKeys, {node: {props: {directoryId}}}) => {
        this.setState({
            ...this.state,
            selectedDirectoryId: directoryId.toString()
        });
        this.props.onDirectorySelect(directoryId);
    };

    recursiveTree(entries) {
        return entries
            .map(entry => {
                let children = entry.children.filter(child => ['root', 'dir'].includes(child.type));

                if (children.length > 0) {
                    return (<TreeNode
                        directoryId={entry.id}
                        key={entry.id}
                        title={entry.name}>
                        {this.recursiveTree(children)}
                    </TreeNode>);
                }
                return (<TreeNode
                    directoryId={entry.id}
                    key={entry.id}
                    title={entry.name}
                />);
            });
    };

    render() {
        let {media} = this.props;
        let structure = denormalize(Object.keys(media).filter(id => media[id].parent_id == -1), {media: media}, mediaSchema);
        return (
            <div className="box">
                <Tree
                    defaultSelectedKeys={[this.state.selectedDirectoryId]}
                    onSelect={this.selectDirectory}
                >
                    {this.recursiveTree(structure)}
                </Tree>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        media: state.media
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFolderTree
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDirectories);
