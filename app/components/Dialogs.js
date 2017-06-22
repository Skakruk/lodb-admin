import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class DialogPrompt extends Component {
	state = {
		open: true,
		value: null
	};

	handleClose = () => {
		this.props.onSubmit(null)
	};

	handleSubmit = () => {
		this.props.onSubmit(this.state.value)
	};

	handleChange = (e, value) => {
		this.setState({
			...this.state,
			value
		})
	};

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Ok"
				primary={true}
				onTouchTap={this.handleSubmit}
			/>,
		];

		return (
			<Dialog
				title={this.props.title}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.onClose}
			>
				<TextField
					onChange={this.handleChange}
				    fullWidth={true}
				/>
			</Dialog>
		)
	}
}

export {
	DialogPrompt
}