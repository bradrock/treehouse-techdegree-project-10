import React from 'react';
import './App.css';
import {BrowserRouter, Switch} from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';
import {Route} from 'react-router';
import Courses from './Courses';
import CourseDetail from './CourseDetail';
import UpdateCourse from './UpdateCourse';
import CreateCourse from './CreateCourse';
import Header from './Header';

import NotFound from './components/NotFound';
import UnhandledError from './components/UnhandledError';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Forbidden from './components/Forbidden';


import withContext from './Context';
import PrivateRoute from './PrivateRoute';



const HeaderWithContext = withContext(Header);

const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);

const CoursesWithContext = withContext(Courses);

export default class App extends React.PureComponent {

  constructor(){
    super();
    this.state = {
      courses: []
    }
  }



  render(){
    return (
      
        <BrowserRouter>
          <HeaderWithContext/>
            <ErrorBoundary FallbackComponent={UnhandledError}>
              <Switch>
                <Route exact path="/" component={CoursesWithContext}/>
                <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext}/>
                <Route exact path="/courses/:id" component={(props) => <CourseDetailWithContext {...props} courseId={props.match.params.id}/>}/>
                <PrivateRoute path="/courses/:id/update" component={(props) => <UpdateCourseWithContext {...props} courseId={props.match.params.id}/>}/>
                <Route path="/signin" component={UserSignInWithContext} />
                <Route path="/signup" component={UserSignUpWithContext} />
                <Route path="/signout" component={UserSignOutWithContext} />
                <Route path="/error" component={UnhandledError} />
                <Route path="/forbidden" component={Forbidden} />
                <Route component={NotFound} />
              </Switch>
            </ErrorBoundary>
        </BrowserRouter>
      
    );
  }
}
