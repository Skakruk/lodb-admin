import React, {Component, PropTypes} from 'react';
import {Input} from 'antd';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateContent} from "../actions/articles";

class TextEditor extends Component {
	state = {
		propertyId: null
	};

	componentWillMount() {
		this.loadContent(this.props);
	}

	componentWillReceiveProps(newProps) {
		this.loadContent(newProps);
	};

	loadContent(props) {
		let {property} = props;
		if (property && property.id !== this.state.propertyId) {
			this.setState({
				...this.state,
				propertyId: property.id
			});
		}
	};

	handleChange = ({target: {value}}) => {
		this.props.updateContent(this.state.propertyId, {
			content: value
		});
	};

	render() {
		let {property, title} = this.props;
		return (
			<Input
				value={property.content}
				onChange={this.handleChange}
                placeholder={title}/>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		updateContent
	}, dispatch);
}

TextEditor.propTypes = {
	property: PropTypes.object.isRequired,
	title: PropTypes.string
};

TextEditor.defaultProps = {
	property: {
		content: ""
	},
	title: ""
};


export default connect(null, mapDispatchToProps)(TextEditor);