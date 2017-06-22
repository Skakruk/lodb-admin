import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import uuidV4 from 'uuid/v4';
import {Dropdown, Menu, Button} from 'antd';

import {updateContent, createContent, removeContent} from '../actions/articles';
import ImagesEditor from './ImagesEditor/ImagesEditor';
import DittoBlock from '../components/DittoBlock';
import AlloyEditorComponent from './AlloyEditorComponent';

import styles from './ParentBlock.css';

@CSSModules(styles)
class ParentBlock extends Component {
	addBlock = ({key}) => {
	    console.log(key)
		let block = {};
		switch (key) {
			case 'text':
				block = {
					property: 'text',
					content: ''
				};
				break;
			case 'images':
				block = {
					property: 'images',
					content: '[]'
				};
				break;
			case 'ditto':
				block = {
					property: 'ditto',
					parent: this.props.article._id,
					template: "news"
				};
				break;
		}

		let {property} = this.props;

		Object.assign(block, {
			id: uuidV4(),
			lang: property.lang,
			parent_id: property.id,
			article_id: property.article_id
		});
		this.props.createContent(block, property, this.props.article);
	};

	deleteBlock = (block) => () => {
		this.props.removeContent(block, this.props.article);
	};

	render() {
		let {property} = this.props;
		let blocks = [];
		if (property) {
			blocks = property.children.map(id => this.props.articleContent[id]).filter(block => block);
		}

        const menu = (
            <Menu onClick={this.addBlock}>
                <Menu.Item key="text">Text</Menu.Item>
                <Menu.Item key="images">Images</Menu.Item>
                <Menu.Item key="ditto">Ditto</Menu.Item>
            </Menu>
        );

		return (<div>
			{blocks && blocks.map((block, idx) => {
				return (<div
					key={idx}
					styleName="block-container">
					<div styleName="content">
						{block.property === 'text' &&
						(<AlloyEditorComponent property={block}/>)}
						{block.property === 'images' &&
						(<ImagesEditor property={block}/>)}
						{block.type === 'ditto' &&
						(<DittoBlock
							onBlockDelete={this.handleBlockDelete(idx)}
							onBlockChange={this.handleBlockChange(idx)}
							parent={block.parent}
							editable={this.props.editable}
							template={block.template}
						/>)}
					</div>
                    {
                        <Button shape="circle"
                                type="danger"
                                icon="delete"
                                onTouchTap={this.deleteBlock(block)}/>
                    }
				</div>);
			})}

			<div styleName="add-action">
                <Dropdown overlay={menu}>
                    <Button shape="circle" icon="plus"/>
                </Dropdown>
            </div>
		</div>)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		updateContent,
		createContent,
		removeContent
	}, dispatch);
}

function mapStateToProps(state) {
	return {
		articleContent: state.articleContent
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ParentBlock);


