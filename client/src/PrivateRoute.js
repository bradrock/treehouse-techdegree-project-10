//from Treehouse Techdegree Unit 10 React Authentication example project
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';


export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
    )}
    </Consumer>
  );
};