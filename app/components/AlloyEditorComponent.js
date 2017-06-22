import React, {Component} from 'react';
import AlloyEditor from 'alloyeditor';
import uniqueId from 'lodash/uniqueId';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateContent} from '../actions/articles';

class AlloyEditorComponent extends Component {
    state = {
        propertyId: null
    };

    componentDidMount() {
        this._editor = AlloyEditor.editable(this.contentId, {
            toolbars: {
                add: {
                    buttons: ['image', 'table', 'hline']
                },
                styles: {
                    selections: [
                        {
                            name: 'link',
                            buttons: ['linkEdit'],
                            test: AlloyEditor.SelectionTest.link
                        },
                        {
                            name: 'table',
                            buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
                            test: AlloyEditor.SelectionTest.table
                        },
                        {
                            name: 'text',
                            buttons: [{
                                name: 'styles',
                                cfg: {
                                    styles: [
                                        {
                                            name: 'Head 1',
                                            style: {element: 'h1'}
                                        },
                                        {
                                            name: 'Head 2',
                                            style: {element: 'h2'}
                                        },
                                        {
                                            name: 'Big',
                                            style: {element: 'big'}
                                        },
                                        {
                                            name: 'Small',
                                            style: {element: 'small'}
                                        },
                                        {
                                            name: 'Code',
                                            style: {element: 'code'}
                                        }
                                    ]
                                }
                            }, 'paragraphLeft', 'paragraphCenter', 'paragraphRight',
                                'bold', 'italic', 'link', 'underline', 'ul', 'ol', 'removeFormat'],
                            test: AlloyEditor.SelectionTest.text
                        },

                    ]
                }
            }
        });

        this.loadContent(this.props);

        this._editor.get('nativeEditor').on("change", () => {
            this.props.updateContent(this.state.propertyId, {
                content: this._editor.get('nativeEditor').getData()
            })
        });
    };

    componentWillReceiveProps(newProps) {
        this.loadContent(newProps);
    };

    async loadContent(props) {
        let {property} = props;
        if (property && property.id !== this.state.propertyId) {
            await this.setState({
                ...this.state,
                propertyId: property.id
            });
            this._editor.get('nativeEditor').setData(property.content)
        }
    }

    componentWillMount() {
        this.contentId = uniqueId('ae-');
    };

    componentWillUnmount() {
        this._editor.destroy();
    };

    render() {
        return (
            <div id={this.contentId}></div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateContent
    }, dispatch);
}


export default connect(null, mapDispatchToProps)(AlloyEditorComponent);