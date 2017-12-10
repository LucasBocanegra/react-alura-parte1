import React, { Component } from 'react';
import '../css/pure-min.css';

class Table extends Component{
    constructor(props){
        super(props);       
        this.state = {jsonKeys: []};
    }

    componentWillReceiveProps(nextProps){
        var keys = [];

        if(nextProps.list.length > 0){
            if(Array.isArray(nextProps.list)){
                var json = nextProps.list[0];
                keys = Object.keys(json);
            }else {
                keys = Object.keys(nextProps.list);
            }
        }

        this.setState({
            jsonKeys: keys
        });
    }

    
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            {
                               this.state.jsonKeys.map( (key,index) =>{
                                    return (
                                        <th key={key}>{key}</th>
                                    );
                               })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.list.map(obj => {
                                return (
                                    <tr key={obj.id}>
                                        {
                                            this.state.jsonKeys.map( (key,index) =>{
                                                return (
                                                    <td key={key}>{obj[key]}</td>
                                                );
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}


export default Table;