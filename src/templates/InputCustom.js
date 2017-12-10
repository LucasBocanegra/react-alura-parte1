import React, { Component } from 'react';
import PubSub from 'pubsub-js';

class InputCustom extends Component {

    constructor(){
        super();
        this.state = {msgError:""};
    }

    componentDidMount(){
        PubSub.subscribe("validation-error",function (topic,error){
            console.log("udpate error state");
            if(error.field === this.props.name){
                this.setState({msgError: error.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe('clean-message',function (topic){
            this.setState({msgError: ''});
        }.bind(this));
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                {/* <input id={this.props.id}
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange} /> */}
                <input {... this.props} />
                <span className="error">{this.state.msgError}</span>
            </div>
        );
    }

}

export default InputCustom;