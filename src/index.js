/* libs */
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {Route,BrowserRouter as Router, Switch} from 'react-router-dom';

/* css */
import './index.css';

/* components */
import App from './App';
import AutorBox from "./templates/Author";
import Home from "./templates/Home";
import BookBox from "./templates/Book";

ReactDOM.render(
(
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/autor"  component={AutorBox}/>
                <Route path="/livro" component={BookBox} />
            </Switch>
        </App>
    </Router>
), document.getElementById('root'));
registerServiceWorker();
