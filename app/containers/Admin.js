import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUser} from '../actions/users';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AdminMenu from '../components/AdminMenu';

import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class Admin extends Component {
    state = {
        menuOpen: false
    };

    handleMenuToggle = () => {
        this.setState({
            ...this.state,
            menuOpen: !this.state.menuOpen
        });
    };

    render() {
        return (
            <div>
                <Helmet title="Адмін-панель - ЛОДБ"/>
                <Layout>
                    <Header className="header">
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Header>
                    <Layout>
                        <Sider width={200} style={{background: '#fff'}}>
                            {this.props.menu || <AdminMenu/>}
                        </Sider>
                        <Layout style={{padding: 24}}>
                            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                                {this.props.main || this.props.children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div>);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Admin);