import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import {slugify as slug} from 'transliteration';
import uuidV4 from 'uuid/v4';
import CSSModules from 'react-css-modules';
import moment from 'moment';

import ImagesDialog from '../../components/ImagesDialog/ImagesDialog';
import {
    getArticle,
    saveArticle,
    deleteArticle,
    createContent,
    updateArticle,
    createArticle, getArticlesTree
} from '../../actions/articles';
import {getUser} from '../../actions/users';
import ParentBlock from '../../components/ParentBlock';
import AlloyEditorComponent from '../../components/AlloyEditorComponent';
import TextEditor from '../../components/TextEditor';
import {getImageUrl} from '../../helpers/utils';
import styles from './Article.css';

import {Card, Col, Row, Input, Form, Select,
    DatePicker, Switch, Radio, Icon, Button} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const {Group: RadioGroup, Button: RadioButton} = Radio;

@CSSModules(styles)
class Article extends Component {
    state = {
        articleContent: [],
        article: {
            main_image: null
        },
        parent: {},
        lang: 'ua'
    };

    componentWillMount() {
        if (this.props.params.id) {
            this.props.getArticle(this.props.params.id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.id !== this.props.params.id && !newProps.articles[newProps.params.id]) {
            this.props.getArticle(newProps.params.id);
        }
        this.loadArticleContent(newProps);
    }

    loadArticleContent(props) {
        let {lang} = this.state;
        let article = props.articles[props.params.id];

        if (!article || !article.content) return;

        let articleContent = article.content.map(id => props.articleContent[id]);

        let requiredProperties = ['title', 'introtext', 'main'];

        requiredProperties.forEach((property) => {
            if (!articleContent.some(content => content && content.lang == lang && content.property === property)) {
                this.addContentProperty(article, property)
            }
        });
    }

    addContentProperty(article, prop) {
        let {lang} = this.state;
        let newProperty = {
            children: [],
            lang,
            property: prop,
            content: "",
            id: uuidV4(),
            article_id: article.id
        };

        let content = article.content || [];

        content.push(newProperty.id);
        this.props.updateArticle(article.id, {
            content
        });

        this.props.createContent(newProperty);
    }

    handleInputChange = (prop) => ({target: {value}}) => {
        this.handleFieldChange(prop, value);
    };

    handleFieldChange = (prop, value) => {
        let {params} = this.props;
        this.props.updateArticle(params.id, {
            [prop]: value
        });
    };

    handleNameFieldChange = async({target: {value}}) => {
        await this.handleFieldChange("name", value);
        await this.handleFieldChange("url", slug(value));
    };

    handleSelectChange = (prop) => (value) => {
        this.handleFieldChange(prop, value);
    };

    handlePublishDateChange = (value) => {
        if (value.isAfter()) {
            this.handleFieldChange("published", false);
        }
        this.handleFieldChange("published_at", value.toISOString());
    };

    handleToggle = (prop) => (isChecked) => {
        this.handleFieldChange(prop, isChecked);
    };

    handleMainImage = () => {
        this.setState({
            ...this.state,
            imagesDialogOpen: true
        })
    };

    handlePublish = async(isChecked) => {
        if (isChecked) {
            await this.handleFieldChange("published_at", (new Date).toISOString())
        }
        this.handleFieldChange("published", isChecked);
    };

    onFileSelect = async(files) => {
        if (files) {
            await this.handleFieldChange("main_image", files[0].id);
        }
        this.setState({
            ...this.state,
            imagesDialogOpen: false
        })
    };

    handleLangChange = async({target: {value}}) => {
        await this.setState({
            ...this.state,
            lang: value
        });
        this.loadArticleContent(this.props)
    };

    handleArticleSave = async(e) => {
        let {params, articles, articleContent} = this.props;
        let article = articles[params.id];
        await this.props.saveArticle({
            ...article,
            content: article.content.map(id => articleContent[id])
        });
        this.props.getArticlesTree();
    };

    handleArticleDelete = () => {
        this.props.deleteArticle(this.props.params.id);
        this.props.dispatch(push("/articles"));
    };

    handleCreateArticle = () => {
        let id = uuidV4();
        this.props.createArticle({
            id,
            content: [],
            type: 'news'
        });
        this.props.dispatch(push(`/articles/${id}`))
    };

    getPropertyByName = (prop) => {
        let {lang} = this.state;
        let {articles, params, articleContent} = this.props;

        if (!articles) return;

        let article = articles[params.id];

        if (article && article.content && articleContent) {
            let content = article.content.map(id => articleContent[id]);
            return content.find(cont => cont && cont.lang == lang && cont.property == prop);
        }
    };

    render() {
        let {lang} = this.state;
        let {articles, params, media} = this.props;
        let article = articles[params.id];

        const formItemLayout = {
            wrapperCol: {span: 24},
        };
        const formItemWithLabel = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const formToggleWithLabel = {
            labelCol: {span: 18},
            wrapperCol: {span: 6},
        };
        return (
            <div>
                {
                    article ?
                        (<Form layout="horizontal">
                            <Row gutter={24}>
                                <Col span="12">
                                    <Card>
                                        <FormItem {...formItemLayout}>
                                            <Input
                                                value={article.name || ""}
                                                onChange={this.handleNameFieldChange}
                                                placeholder="Назва"/>
                                        </FormItem>
                                        <FormItem {...formItemLayout}>
                                            <Input
                                                value={article.url || ""}
                                                onChange={this.handleInputChange("url")}
                                                placeholder="URL"/>
                                        </FormItem>
                                        <FormItem {...formItemLayout}
                                                  style={article.type !== 'link' ? {marginBottom: 8} : {}}>
                                            <Select defaultValue={article.type}
                                                    style={{width: '100%'}}
                                                    onChange={this.handleSelectChange("type")}
                                                    placeholder="Тип документу">
                                                <Option value="news">Новина</Option>
                                                <Option value="page">Сторінка</Option>
                                                <Option value="link">Посилання</Option>
                                                <Option value="announce">Анонс</Option>
                                            </Select>
                                        </FormItem>
                                        { article.type === 'link' &&
                                        (<FormItem {...formItemLayout} style={{marginBottom: 8}}>
                                            <Input
                                                value={article.redirect || ""}
                                                onChange={this.handleInputChange("redirect")}
                                                placeholder="Посилання"/>
                                        </FormItem>)
                                        }
                                    </Card>
                                </Col>
                                <Col span="12">
                                    <Card>
                                        <FormItem {...formItemWithLabel} label="Дата публікації">
                                            <DatePicker
                                                showTime
                                                format="YYYY-MM-DD HH:mm:ss"
                                                placeholder="Дата публікації"
                                                onChange={this.handlePublishDateChange}
                                                defaultValue={moment(article.published_at)}
                                            />
                                        </FormItem>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem {...formToggleWithLabel} label="Опубліковано">
                                                    <Switch defaultChecked={article.published || false}
                                                            onChange={this.handlePublish}/>
                                                </FormItem>
                                                <FormItem {...formToggleWithLabel}
                                                          label="Відображати кнопки поширення"
                                                          style={{marginBottom: 8}}>
                                                    <Switch defaultChecked={article.show_share_buttons || false}
                                                            onChange={this.handleToggle("show_share_buttons")}/>
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem {...formToggleWithLabel} label="Відображати в RSS">
                                                    <Switch defaultChecked={article.show_in_rss || false}
                                                            onChange={this.handleToggle("show_in_rss")}/>
                                                </FormItem>
                                                <FormItem {...formToggleWithLabel}
                                                          label="Відображати в дереві сайту"
                                                          style={{marginBottom: 8}}>
                                                    <Switch defaultChecked={article.show_in_tree || false}
                                                            onChange={this.handleToggle("show_in_tree")}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{marginTop: 24}}>
                                <Col span={24}>
                                    <Card>
                                        <RadioGroup defaultValue={lang} onChange={this.handleLangChange}>
                                            <RadioButton value="ua">Укр</RadioButton>
                                            <RadioButton value="pl">Pol</RadioButton>
                                            <RadioButton value="en">Eng</RadioButton>
                                            <RadioButton value="ru">Рус</RadioButton>
                                        </RadioGroup>
                                    </Card>
                                </Col>
                            </Row>
                            <Row style={{marginTop: 24}} gutter={24}>
                                <Col span={12}>
                                    <Card >
                                        <FormItem {...formItemLayout} style={{marginBottom: 8}}>
                                            <TextEditor
                                                property={this.getPropertyByName("title")}
                                                title="Заголовок"/>
                                        </FormItem>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        {
                                            article.type !== 'page' && (
                                                <div styleName="main-img-container" onTouchTap={this.handleMainImage}>
                                                    {
                                                        article.main_image ?
                                                            <img src={getImageUrl(media[article.main_image], 150)}
                                                                 alt=""
                                                                 styleName="main-img"/> :
                                                            <Icon type="plus" styleName="main-img-uploader-trigger"/>
                                                    }
                                                </div>
                                            )
                                        }
                                    </Card>
                                </Col>
                            </Row>


                            {
                                ['link', 'news', 'announce'].includes(article.type) && (
                                    <Row style={{marginTop: 24}}>
                                        <Col>
                                            <Card>
                                                <label>Вступний текст</label>
                                                <div styleName="introtext-block">
                                                    <AlloyEditorComponent
                                                        property={this.getPropertyByName('introtext')}/>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                            }

                            {
                                ['news', 'page'].includes(article.type) && (
                                    <Row style={{marginTop: 24}}>
                                        <Col>
                                            <Card>
                                                <label>Вміст статті</label>
                                                <ParentBlock
                                                    article={article}
                                                    property={this.getPropertyByName('main')}/>
                                            </Card>
                                        </Col>
                                    </Row>)
                            }

                            {
                                this.state.imagesDialogOpen &&
                                <ImagesDialog
                                    multiple={false}
                                    onDialogClose={this.onFileSelect}
                                />
                            }
                        </Form>) :

                        (<div>
                            <Button type="primary"
                                    icon="plus"
                                    size="large"
                                    onTouchTap={this.handleCreateArticle}>Створити сторінку</Button>
                        </div>)
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser,
        saveArticle,
        deleteArticle,
        createArticle,
        getArticle,
        createContent,
        updateArticle,
        dispatch,
        getArticlesTree
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user.user,
        articles: state.articles,
        articleContent: state.articleContent,
        media: state.media
    };
}

Article.defaultProps = {
    article: {},
    articleContent: {}
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Article));