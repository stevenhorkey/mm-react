import React, { Component, Fragment } from 'react';
import API from './utils/API';
import AOS from 'aos';
import "bootstrap/dist/css/bootstrap.min.css";
import './assets/scss/Index.css';
import 'aos/dist/aos.css';
import Router from "./utils/Router";

import ComponentIndex from './components/components';

class App extends Component {
  state = {
    loading: true,
    pages: [],
  };

  site = {
    name: 'Meme and Meaning',
  };

  componentDidMount = () => {
    AOS.init({
      duration: 1600,
    });

    API.getPages()
      .then(res => {
        // console.log(res.data);
        this.setState({
          pages: res.data,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    if (!this.state.loading) {
      let pages = this.state.pages;
      return (
        <Fragment>
          <ComponentIndex.Navbar site={this.site} />

          <Router pages={pages}/>

          <ComponentIndex.Footer site={this.site} />
        </Fragment>
      );
    } else return null;
  }
}

export default App;
