import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import CSSModules from 'react-css-modules';
import {bindActionCreators} from 'redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import {login} from '../../actions/auth';
import {getUser} from '../../actions/users';
import styles from './LoginContainer.css';

@CSSModules(styles)
class LoginContainer extends Component {
    state = {
        error: {
            barOpen: false,
            message: ""
        },
        data: {
            username: "",
            password: ""
        },
    };

    handleChange = (prop) => (e, value) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                [prop]: value
            }
        })
    };

    handleRequestClose = () => {
        this.setState({
            ...this.state,
            error: {
                barOpen: false,
                message: null
            }
        });
    };

    componentWillReceiveProps(newProps) {
        if (!newProps.auth.isAuthenticated) {
            this.setState({
                ...this.state,
                error: {
                    barOpen: true,
                    message: newProps.auth.err.message
                }
            })
        } else {
	        this.props.dispatch(push("/"));
        }
    };

    handleLogin = (e) => {
	    e.preventDefault();
        let {location} = this.props;
        let redirectTo = location.state && location.state.nextPathname ? location.state.nextPathname : '/';
        this.props.login(this.state.data, redirectTo);
    };

    render() {
        return (
            <div styleName="login-container">
                <Paper styleName="login-paper" zDepth={2}>
                    <form onSubmit={this.handleLogin}>
                        <TextField
                            id="username"
                            name="username"
                            onChange={this.handleChange("username")}
                            fullWidth={true}
                            floatingLabelText="Username"
                        /><br/>
                        <TextField
                            id="password"
                            name="password"
                            onChange={this.handleChange("password")}
                            type="password"
                            fullWidth={true}
                            floatingLabelText="Password"
                        /><br/>
                        <RaisedButton
                            type="submit" label="Login" primary={true}/>
                    </form>
                </Paper>
                <Snackbar
                    open={this.state.error.barOpen}
                    message={this.state.error.message}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login,
        getUser,
	    dispatch
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);