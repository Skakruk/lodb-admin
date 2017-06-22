import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import styles from './styles.css';
import {addDirectory, uploadFiles} from "../../actions/images";
import {DialogPrompt} from '../Dialogs';

@CSSModules(styles)
class ImagesToolbar extends Component {
	state = {
		selectedFiles: [],
		sorting: 'updated_at DESC',
		openPrompt: false
	};

	componentWillMount(){
		this.setState({
			...this.state,
			selectedFiles: this.props.selectedFiles
		})
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			...this.state,
			selectedFiles: newProps.selectedFiles
		})
	}

	addSubDirectory = () => {
		this.setState({
			...this.state,
			openPrompt: true
		})
	};

	handleSelect = () => {
		this.props.onSelect(this.state.selectedFiles);
	};

	handleChangeSorting = (e, num, value) => {
		this.setState({
			...this.state,
			sorting: value
		}, () => {
			this.sortFiles(this.state.imagesList)
		});
	};

	handlePromptClose = async(name) => {
		if (name) {
			await this.props.addDirectory({
				parent: this.state.selectedDirectoryId,
				name: name
			});
			this.setState({
				...this.state,
				openPrompt: false
			});
		} else {
			this.setState({
				...this.state,
				openPrompt: false
			});
		}
	};

	handleFilesUpload = async(e) => {
		await this.props.uploadFiles({
			files: e.target.files,
			parent: this.props.selectedId
		});
		// this.props.onFileAdd(files)
	};

	render() {
		let {selectedFiles, openPrompt, sorting} = this.state;
		return (
			<Toolbar>
				<ToolbarGroup firstChild={true}>
					<DropDownMenu value={sorting} onChange={this.handleChangeSorting}>
						<MenuItem value={'name ASC'} primaryText="A => Z"/>
						<MenuItem value={'name DESC'} primaryText="Z => A"/>
						<MenuItem value={'updated_at DESC'} primaryText="Newer => Older"/>
						<MenuItem value={'updated_at ASC'} primaryText="Older => Newer"/>
					</DropDownMenu>
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
					<FlatButton onTouchTap={this.addSubDirectory} label="Add Subdirectory"/>
					<RaisedButton label="Upload"
					              containerElement="label">
						<input type="file"
						       multiple="multiple"
						       accept="image/*"
						       onChange={this.handleFilesUpload}
						       styleName="image-input"/>
					</RaisedButton>
					{
						selectedFiles.length &&
						(<RaisedButton primary={true} label="Select" onTouchTap={this.handleSelect}/>)
					}
				</ToolbarGroup>

				<DialogPrompt
					title="Provide name for new folder"
					open={openPrompt}
					onSubmit={this.handlePromptClose}/>
			</Toolbar>

		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		addDirectory,
		uploadFiles
	}, dispatch);
}

export default connect(undefined, mapDispatchToProps)(ImagesToolbar);
