import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import update from 'react/lib/update';
import CSSModules from 'react-css-modules';
import {Button, Card, Icon} from 'antd';

import GridTile from './ReorderableGridTile';
import GridList from './ReorderableGridList';
import {getImageUrl} from "../../helpers/utils";
import {updateContent} from "../../actions/articles";
import ImagesDialog from '../ImagesDialog/ImagesDialog';
import styles from './styles.css';

@CSSModules(styles)
class ImagesEditor extends Component {
    state = {
        images: [],
        imagesDialogOpen: false,
        activeImage: {},
        activeImageIndex: void 0
    };

    handleMenuItem = (image, idx) => (e, item) => {
        switch (item.props.value) {
            case "description":
                this.setState({
                    ...this.state,
                    anchorEl: findDOMNode(this.refs[`tile_${idx}`]),
                    open: true,
                    activeImage: image,
                    activeImageIndex: idx
                });
                break;
            case "delete":
                this.setState({
                    ...this.state,
                    images: [
                        ...this.state.images.slice(0, idx),
                        ...this.state.images.slice(idx + 1),
                    ],
                }, this.saveChanges);

                break;
        }
    };

    saveChanges() {
        let {propertyId, images} = this.state;
        this.props.updateContent(propertyId, Object.assign(this.props.property, {
            content: JSON.stringify(images)
        }));
    }

    handleDescriptionClose = () => {
        this.setState({
            ...this.state,
            open: false,
            images: [
                ...this.state.images.slice(0, this.state.activeImageIndex),
                this.state.activeImage,
                ...this.state.images.slice(this.state.activeImageIndex + 1),
            ],
            activeImage: {},
            activeImageIndex: void 0
        }, this.saveChanges)
    };

    handleDescriptionChange = (e, value) => {
        this.setState({
            ...this.state,
            activeImage: {
                ...this.state.activeImage,
                description: value
            }
        })
    };

    componentWillMount() {
        this.loadImagesList(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.loadImagesList(newProps)
    }

    loadImagesList(props) {
        let images = [];
        let {property} = props;

        if (property && property.id !== this.state.propertyId) {
            if (property.content)
                images = typeof property.content === 'string' ? JSON.parse(property.content) : property.content;

            this.setState({
                ...this.state,
                propertyId: property.id,
                images
            });
        }
    }

    handleAddMore = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: true
        })
    };

    onFileSelect = async(files) => {
        console.log(files);
        await this.setState({
            ...this.state,
            images: [
                ...this.state.images,
                ...files
            ],
            imagesDialogOpen: false
        });
        this.saveChanges();
    };

    handleMoveCard = ({dragIndex, hoverIndex}) => {
        const {images} = this.state;
        const dragCard = images[dragIndex];
        this.setState(update(this.state, {
            images: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
        }));
    };

    render() {
        var {images, imagesDialogOpen} = this.state;

        let tiles = images.map((image, idx) => (
            <GridTile
                styleName="img-card"
                ref={`tile_${idx}`}
                key={image.id}
                title={image.name}
                id={image.id}
                moveCard={this.handleMoveCard}
                index={idx}
            >
                <Card bodyStyle={{padding: 0}}>
                    <img src={getImageUrl(image, 200)} height="100"/>
                </Card>
            </GridTile>
        ));
        /*
         const imageMenu = (image, idx) => (
         <IconMenu
         onItemTouchTap={this.handleMenuItem(image, idx)}
         iconButtonElement={<IconButton><MoreVert color="white"/></IconButton>}
         anchorOrigin={{horizontal: 'right', vertical: 'top'}}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         >
         <MenuItem value="description" primaryText="Description"/>
         <MenuItem value="delete" primaryText="Delete"/>
         </IconMenu>
         );
         */
        return (
            <div>
                <GridList tiles={tiles}>
                    <Card styleName="upload-card" onTouchTap={this.handleAddMore}>
                        <Icon type="plus" styleName="plus"/>
                    </Card>

                </GridList>
                {/*
                 <Popover
                 open={this.state.open}
                 anchorEl={this.state.anchorEl}
                 style={{
                 width: 450
                 }}
                 onRequestClose={this.handleDescriptionClose}
                 >
                 <TextField
                 hintText="Підпис до зображення"
                 multiLine={true}
                 rowsMax={4}
                 onChange={this.handleDescriptionChange}
                 value={this.state.activeImage.description}
                 style={{
                 marginLeft: 10,
                 width: 390
                 }}
                 />
                 <IconButton
                 style={{
                 verticalAlign: "middle"
                 }}
                 onTouchTap={this.handleDescriptionClose}>
                 <Check/>
                 </IconButton>
                 </Popover>
                 */}
                {
                    imagesDialogOpen && (
                        <ImagesDialog
                            multiple={true}
                            onDialogClose={this.onFileSelect}
                        />
                    )
                }

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateContent
    }, dispatch);
}


export default connect(null, mapDispatchToProps)(ImagesEditor);