import React, { Component } from 'react';
import '../css/pure-min.css';
import '../css/side-menu.css';

import $ from 'jquery';
import PubSub from 'pubsub-js';

//import components
import InputCustom from "./InputCustom";
import HandleErrors from "./HandleErrors";
import Table from "./Table";

class AuthorForm extends Component {
    constructor() {
        super();
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.cleanForm = this.cleanForm.bind(this);
    };

    cleanForm() {
        PubSub.publish('clean-message', {});
        this.setState({
            nome: '',
            email: '',
            senha: ''
        });
    }

    submitForm(event) {
        console.log("submit form");
        console.log(JSON.stringify({
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha
        }));

        event.preventDefault();

        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: "application/json",
            dataType: "json",
            type: "post",
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (response) {
                console.log("data sending with success");
                console.log(response);
                PubSub.publish('update-athors-list', response);
            },
            error: function (response) {
                console.log("erro when sending data");
                new HandleErrors().publishError(response.responseJSON);
            },
            beforeSend: function (){
                this.cleanForm();
            }.bind(this)
        });
    }

    setInputValue(InputName, event) {
        this.setState({ [InputName]: event.target.value })
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.submitForm} method="post">
                    <InputCustom label="Nome"
                        id="name"
                        type="text"
                        name="nome"
                        value={this.state.nome}
                        onChange={this.setInputValue.bind(this,'nome')} />

                    <InputCustom label="Email"
                        id="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.setInputValue.bind(this,"email")} />

                    <InputCustom label="Senha"
                        id="senha"
                        type="password"
                        name="senha"
                        value={this.state.senha}
                        onChange={this.setInputValue.bind(this,"senha")} />

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}

class AuthorsTable extends Component {

    render() {
        return (
            <div>
                <Table {...this.props} />
            </div>
        );
    }
}

class AuthorBox extends Component {
    constructor() {
        super();
        this.state = { list: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (response) {
                this.setState({ list: response });
            }.bind(this)
        });

        PubSub.subscribe("update-athors-list", (topic, newList) => {
            this.setState({ list: newList });
        })
    };

    render() {
        return (
            <div>
                <div>
                    <div className="header">
                        <h1>Cadastro de Autores</h1>
                    </div>
                    <div className="content" id="content">
                        <AuthorForm />
                        <AuthorsTable list={this.state.list} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthorBox;
