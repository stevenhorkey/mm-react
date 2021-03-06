import React, { Component, Fragment } from 'react';
import API from "../../utils/API.js";
import jsonp from "jsonp"
import PropTypes from 'prop-types';

import emailLead from "../../assets/img/email-lead.jpg";
// import Mailchimp from 'react-mailchimp-form';

class Mailchimp extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  };

  componentDidMount = () => {};

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]:value});
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const action = 'https://memeandmeaning.us16.list-manage.com/subscribe/post?u=4c73c4e387b1f2b219c1f2af6&amp;id=d25ec94b8f';
    let fname = `${"FNAME"}=${encodeURIComponent(this.state["FNAME"])}`;
    let lname = `${"LNAME"}=${encodeURIComponent(this.state["LNAME"])}`;
    let em = `${"EMAIL"}=${encodeURIComponent(this.state["EMAIL"])}`;
    const values  = fname + "&" + lname + "&" + em;
    const path = `${action}&${values}`;
    const url = path.replace('/post?', '/post-json?');
    const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
    const email = this.state['EMAIL'];
    (!regex.test(email)) ? this.setState({ status: "empty" }) : this.sendData(url);

  };

  sendData(url) {
    this.setState({ status: "sending" });
    console.log("sendData", url)
    jsonp(url, { param: "c" }, (err, data) => {
      console.log(err,data);
      if (data.msg.includes("already subscribed")) {
        this.setState({ status: 'duplicate' });
      } else if (err) {
        this.setState({ status: 'error' });
      } else if (data.result !== 'success') {
        this.setState({ status: 'error' });
      } else {
        this.setState({ status: 'success' });
      };
    });
  }

  render() {
    if (!this.state.loading) {
      const { messages, fields, styles, className } = this.props;
      const { status } = this.state;
      return (
        <Fragment>
          <div className="container">
            
            <div className="row d-flex align-items-center">
              <span className="col-7 text-justify">
              <h2 className="display-4 text-uppercase text-primary newsletter-header">Free Updates and Bonuses</h2>
              
              </span>
              <img className="col-5" src={emailLead} />
              <div className="my-4">Signup for the free Meme and Meaning newsletter and recieve a free downloadable pdf of my Top 22 Questions for Self Reflection.</div> 
            </div>

            <form className="row d-block text-left" onSubmit={this.handleSubmit.bind(this)}>
              <div className="col-sm-6 d-inline-block">
                <label className="" htmlFor="first-name">First Name</label>
                <input onBlur={({ target }) => this.setState({ ["FNAME"]: target.value })} name="FNAME" id="first-name" onChange={this.handleChange} defaultValue={this.state["FNAME"]} className="w-100 px-2 py-1"/>
              </div>
              <div className="col-sm-6 d-inline-block">
                <label className="" htmlFor="last-name">Last Name</label>
                <input onBlur={({ target }) => this.setState({ ["LNAME"]: target.value })} name="LNAME" id="last-name" onChange={this.handleChange} defaultValue={this.state["LNAME"]} className="w-100 px-2 py-1"/>
              </div>
              <div className="col-12">
                <label className="" htmlFor="email">Email</label>
                <input onBlur={({ target }) => this.setState({ ["EMAIL"]: target.value })} name="EMAIL" id="email" onChange={this.handleChange} defaultValue={this.state["EMAIL"]} className="w-100 px-2 py-1"/>
              </div>
              <div className='msg-alert text-center'>
                {status === "sending" && <p style={styles.sendingMsg}>{messages.sending}</p>}
                {status === "success" && <p style={styles.successMsg}>{messages.success}</p>}
                {status === "duplicate" && <p style={styles.duplicateMsg}>{messages.duplicate}</p>}
                {status === "empty" && <p style={styles.errorMsg}>{messages.empty}</p>}
                {status === "error" && <p style={styles.errorMsg}>{messages.error}</p>}
              </div>
              <input disabled={status === "sending" || status === "success"} className="mx-auto text-uppercase btn btn-primary p-2 my-3 scale-item d-flex align-items-center" type="submit" value="Get my downloads"/>
              <small className="text-muted text-center d-block">No spam ever</small>
            </form>
          </div>
        </Fragment>
      );
    }
  }
}

Mailchimp.defaultProps = {
  messages: {
    sending: "Sending...",
    success: "Thank you for subscribing!",
    error: "An unexpected internal error has occurred.",
    empty: "You must write an e-mail.",
    duplicate: "Too many subscribe attempts for this email address.",
    button: 'Subscribe!'
  },
  styles: {
    sendingMsg: {
      color: '#0652DD'
    },
    successMsg: {
      color: '#009432'
    },
    duplicateMsg: {
      color: '#ED4C67'
    },
    errorMsg: {
      color: '#ED4C67'
    }
  }
}

Mailchimp.propTypes = {
  action: PropTypes.string,
  messages: PropTypes.object,
  fields: PropTypes.array,
  styles: PropTypes.object,
  className: PropTypes.string
};

export default Mailchimp;
