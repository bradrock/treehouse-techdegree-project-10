//adapted from Treehouse Techdegree Unit 10 React Authentication example project
//manages global state for user credentials
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    password: ''
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  //signs user in
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    this.setState(() => {
      return {
        password: password,
      };
    });

    if (user !== null) {
      user.password = password;
      this.setState(() => {
        return {
          authenticatedUser: user,
        };
        
      });
      
        
      
      const cookieOptions = {
        expires: 1 // 1 day
      };
      Cookies.set('authenticatedUser', JSON.stringify(user), cookieOptions);
    }
    
    return user;
  }

  //signs user out
  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

