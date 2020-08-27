//adapted from Treehouse Techdegree Unit 10 React Authentication example project
//renders user signup page
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import { Redirect } from 'react-router-dom';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
    badPostRequest: false
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
      badPostRequest
    } = this.state;

    
    if(badPostRequest)
    {
      return (<Redirect to={{
        pathname: '/error'
        
      }} />);
    }
    else
    {
        return (
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign Up</h1>
              <Form 
                cancel={this.cancel}
                errors={errors}
                submit={this.submit}
                submitButtonText="Sign Up"
                elements={() => (
                  <React.Fragment>
                    <input 
                      id="firstName" 
                      name="firstName" 
                      type="text"
                      value={firstName} 
                      onChange={this.change} 
                      placeholder="First Name" />
                      <input 
                      id="lastName" 
                      name="lastName" 
                      type="text"
                      value={lastName} 
                      onChange={this.change} 
                      placeholder="Last Name" />
                    <input 
                      id="emailAddress" 
                      name="emailAddress" 
                      type="text"
                      value={emailAddress} 
                      onChange={this.change} 
                      placeholder="Email Address" />
                    <input 
                      id="password" 
                      name="password"
                      type="password"
                      value={password} 
                      onChange={this.change} 
                      placeholder="Password" />
                      <input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword} 
                      onChange={this.change} 
                      placeholder="Confirm Password" />
                  </React.Fragment>
                )} />
              <p>
                Already have a user account? <Link to="/signin">Click here</Link> to sign in!
              </p>
            </div>
          </div>
        );
    }
  }

  //handles change in signup form
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  //handles form submission--posts new user and signs new user in
  submit = () => {
    
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    

    if(password !== confirmPassword)
    {
      this.setState({errors: ["Passwords do not match."]});
    }

    else
    {


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({"firstName":firstName,"lastName":lastName,"emailAddress":emailAddress,"password":password});

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      let responseStatus;


      fetch("http://localhost:5000/api/users", requestOptions)
          .then(response => {
            responseStatus = response.status;
            if(responseStatus === 201)
            {
            return true;
            }
            else{
              
              return response.json();
            }
            
        })
        .then(result => {
            
          if (responseStatus === 400)
          {
            let errors = result.errors;
            this.setState({errors: errors});
            
          }
          else if (responseStatus === 201)
          {
            const { context } = this.props;
            

            context.actions.signIn(emailAddress, password)
              .then((user) => {
                if (user === null) {
                  this.setState(() => {
                    return { errors: [ 'Sign-in was unsuccessful' ] };
                  });
                } else {
                  this.props.history.push("/");
                }
              })
              .catch((error) => {
                console.error(error);
                this.props.history.push('/error');
              });
          }
          else
          {
            this.setState({badPostRequest: true});
          }
        
          })
          .catch(error => {
            console.log('error', error);
            this.setState({badPostRequest: true});
          });

    }

  }


  //handles user clicking cancel button in form--returns user to main page
  cancel = () => {
   this.props.history.push('/');
  }

}
