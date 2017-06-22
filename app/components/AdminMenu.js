import React, {Component} from 'react';
import {Link} from 'react-router';
import {Menu} from 'antd';
const menuStructure = [
	{
		title: 'Сторінки',
		url: "articles"
	}, {
		title: 'Галерея',
		url: "gallery"
	}

];

export default class AdminMenu extends Component {
	render() {
		return (
            <Menu
                mode="inline"
                style={{height: '100%'}}
            >
				{
					menuStructure.map(item => {
						return (
                            <Menu.Item key={item.title}>
                                <Link to={item.url}>{item.title}</Link>
                            </Menu.Item>)
					})
				}
			</Menu>
		)

	}
}