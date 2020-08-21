//from Treehouse Techdegree Unit 10 React Authentication example project
import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {
  context.actions.signOut();

  return (
    <Redirect to="/" />
  );
}
