//libs
import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

//css
import '../css/pure-min.css';
import '../css/side-menu.css';

//components
import InputCustom from "./InputCustom";
import HandleErrors from "./HandleErrors";
import Table from "./Table";


class BookForm extends Component {
    constructor() {
        super();
        this.state = {
            titulo: '',
            preco: '',
            autorId: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setAuthorId = this.setAuthorId.bind(this);
        this.cleanForm = this.cleanForm.bind(this);
    };

    cleanForm() {
        PubSub.publish('clean-message', {});
        this.setState({
            titulo: '',
            preco: '',
            autorId: ''
        });
    }

    submitForm(event) {
        console.log("submit form");

        event.preventDefault();

        $.ajax({
            url: "http://localhost:8080/api/livros",
            contentType: "application/json",
            dataType: "json",
            type: "post",
            data: JSON.stringify(
                {   titulo: this.state.titulo, 
                    preco: this.state.preco, 
                    autorId: this.state.autorId }),
            success: function (response) {
                console.log("data sending with success");
                console.log(response);
                PubSub.publish('update-book-list', response);
            },
            error: function (response) {
                console.log("erro when sending data");
                new HandleErrors().publishError(response.responseJSON);
            },
            beforeSend: function(){
                this.cleanForm();
            }.bind(this)
        });
    }


    setTitle(event) {
        this.setState({ titulo: event.target.value })
    }
    setPrice(event) {
        this.setState({ preco: event.target.value })
    }
    setAuthorId(event) {
        this.setState({ autorId: event.target.value })
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.submitForm} method="post">
                    <InputCustom label="Titulo"
                        id="title"
                        type="text"
                        name="title"
                        value={this.state.titulo}
                        onChange={this.setTitle} />

                    <InputCustom label="Preço"
                        id="preco"
                        type="number"
                        name="titulo"
                        value={this.state.preco}
                        onChange={this.setPrice} />

                    <div className="pure-control-group">
                        <label htmlFor="autor">Autor</label>
                        <select value={this.state.autorId} 
                                name="autor" 
                                id="authorId" 
                                onChange={this.setAuthorId} >
                            <option>Selecione um autor </option>
                            {
                                this.props.selectList.map(obj => {
                                    return (                                    
                                            <option key={obj.id} value={obj.id}>{obj.nome}</option>
                                    );
                                })
                            }
                        </select>        
                    </div>
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}


class BookTable extends Component {
    render() {
        return (
            <div>
                <Table {...this.props} />
            </div>
        );
    }
}

class BookBox extends Component {

    constructor() {
        super();
        this.state = { list: [], athorList: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: function (response) {
                var jsonRef = response.map(jsonElement => {
                    var name = jsonElement.autor.nome;
                    jsonElement["autor"] = name;
                   
                    return  jsonElement;
                });
                console.log(jsonRef);

                this.setState({ list: jsonRef });
            }.bind(this)
        });

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (response) {
                this.setState({ athorList: response });
            }.bind(this)
        });

        // se escreve para ouvir quando alguém disparar um evento
        // se atualização da lita de autores
        PubSub.subscribe("update-book-list", (topic, newList) => {
            var jsonRef = newList.map(jsonElement => {
                var name = jsonElement.autor.nome;
                jsonElement["autor"] = name;
               
                return  jsonElement;
            }); 
            this.setState({ list: jsonRef });
        });
    }

    render() {
        return (
            <div>
                <div>
                    <div className="header">
                        <h1>Cadastro de Livros</h1>
                    </div>
                    <div className="content" id="content">
                        <BookForm selectList={this.state.athorList} />
                        <BookTable list={this.state.list} />
                    </div>
                </div>
            </div>
        );
    }
}


export default BookBox;