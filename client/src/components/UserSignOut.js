//from Treehouse Techdegree Unit 10 React Authentication example project
//signs out user
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {
    
  useEffect(() => context.actions.signOut());

  return (
    <Redirect to="/" />
    
  );
}
