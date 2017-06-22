import React, {Component, PropTypes} from 'react';
import {getFolderTree, addDirectory, uploadFiles, deleteFile} from '../../actions/images';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import {getImageUrl} from '../../helpers/utils';

import styles from './styles.css';
import ImagesDirectories from './ImagesDirectories';
import ImagesToolbar from './ImagesToolbar';

import {Modal, Card, Row, Col, Dropdown, Menu, Icon, Upload} from 'antd';


@CSSModules(styles, {allowMultiple: true})
class ImagesDialog extends Component {

    state = {
        sorting: 'updated_at DESC',
        selectedDirectoryId: null,
        selectedFiles: [],
        open: false,
    };

    componentDidMount() {
        this.setState({
            ...this.state,
            open: true
        });
    };

    sortFiles(filesList, sorting) {
        if (filesList.length) {
            let [sortField, order] = sorting.split(" ");
            filesList.sort((a, b) => {
                return a[sortField].localeCompare(b[sortField]);
            });

            if (order === "ASC") {
                filesList.reverse();
            }
        }

        return filesList;
    }

    handleSortingChange = (sorting) => {
        this.setState({
            ...this.state,
            sorting
        })
    };

    handleDirectorySelect = (selectedId) => {
        this.setState({
            ...this.state,
            selectedDirectoryId: selectedId
        });
    };

    removeImage = (file) => {
        this.props.deleteFile(file);
        this.setState({
            ...this.state,
            selectedFiles: this.state.selectedFiles.filter(sFile => sFile.id !== file.id)
        })
    };

    selectFile = (file) => {
        let selected = this.state.selectedFiles;
        if (selected.length == 0 || this.props.multiple === true) {
            this.setState({
                ...this.state,
                selectedFiles: [
                    ...selected,
                    file
                ]
            })
        }
    };

    deselectFile = (file) => {
        let selected = this.state.selectedFiles;
        this.setState({
            ...this.state,
            selectedFiles: selected.filter(sFile => sFile.id !== file.id)
        })
    };

    handleMenuAction = (file) => ({key}) => {
        let actions = {
            deselect: this.deselectFile,
            select: this.selectFile,
            delete: this.removeImage,
        };
        return actions[key] && actions[key](file);
    };

    handleFilesUpload = async({target: {files}}) => {
        await this.props.uploadFiles({
            files,
            parent: this.state.selectedDirectoryId
        });
        this.props.getFolderTree();
    };

    getImagesList(media, parentId) {
        return Object.keys(media).map(id => media[id]).filter(media => media.parent_id == parentId && !['root', 'dir'].includes(media.type))
    }

    handleOk = (e) => {
        this.props.onDialogClose(this.state.selectedFiles)
    };

    render() {
        let {open, sorting, selectedDirectoryId} = this.state;
        let imagesList = this.getImagesList(this.props.media, selectedDirectoryId);

        const menu = (item) => (
            <Menu
                onClick={this.handleMenuAction(item)}
            >
                <Menu.Item key="name" disabled={true}>
                    {item.name}
                </Menu.Item>
                <Menu.Divider/>
                {
                    this.state.selectedFiles.includes(item) ?
                        <Menu.Item key="deselect">Deselect</Menu.Item> :
                        <Menu.Item key="select"
                                   disabled={this.state.selectedFiles.length > 0 && !this.props.multiple}
                        >Select</Menu.Item>
                }
                <Menu.Item key="delete">
                    Delete
                </Menu.Item>
            </Menu>
        );

        return (<Modal
                visible={open}
                width="90%"
                onOk={this.handleOk}
                onCancel={this.props.onDialogClose}
                okText="Select"
                cancelText="Close"
            >
                <Row>
                    <Col span={4}>
                        <ImagesDirectories
                            selectedId={selectedDirectoryId}
                            onSortingChange={this.handleSortingChange}
                            onDirectorySelect={this.handleDirectorySelect}
                        />
                    </Col>

                    <Col span={20}>
                        {/*
                         <ImagesToolbar
                         selectedId={selectedDirectoryId}
                         onFileAdd={this.handleFileAdd}
                         selectedFiles={selectedFiles}
                         onSelect={this.props.onDialogClose}
                         />
                         */}
                        <div styleName="images-grid">
                            {
                                this.sortFiles(imagesList, sorting).map((file) => (
                                    <Dropdown key={file.id} overlay={menu(file)}>
                                        <Card
                                            bodyStyle={{padding: 0}}
                                            styleName={"img-card " + (this.state.selectedFiles.includes(file) ? "selected" : "")}
                                        >
                                            <img src={getImageUrl(file, 200)} width="100"/>
                                        </Card>
                                    </Dropdown>
                                ))
                            }
                            <Card styleName="upload-card">
                                <input type="file"
                                       multiple="multiple"
                                       accept="image/*"
                                       onChange={this.handleFilesUpload}
                                       styleName="image-input"/>
                                <Icon type="plus" styleName="plus"/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteFile,
        getFolderTree,
        uploadFiles
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        media: state.media
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDialog);
