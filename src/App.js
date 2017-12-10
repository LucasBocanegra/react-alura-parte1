import React, { Component } from 'react';
import Sidebar from './templates/Sidebar';

// import AuthorBox from './templates/Author';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sidebar />

        <div id="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
