//renders a detail page with info for a single course
import React, {Fragment} from 'react';
import { Redirect } from 'react-router-dom';
const ReactMarkdown = require('react-markdown');


export default class CourseDetail extends React.PureComponent {

  _isMounted = false;

  

    constructor(props){
      super(props);
      this.state = {
        course: 
          { title: null,
            id: null,
            estimatedTime: null,
            user: null,
            materialsNeeded: null
          },
        descriptionElements: null,
        materialsElements: null,
        loaded: false,
        updateCourseElement: null,
        deleteCourseElement: null,
        badCourseGetRequest: false,
        getRequestResponseStatus: null,
        badDeleteRequest: false,
        
      };

    }

    //completes GET request for course info upon component mounting
    componentDidMount(){


      const { context } = this.props;
      const authUser = context.authenticatedUser;
      this._isMounted = true;


      fetch('http://localhost:5000/api/courses/' + this.props.courseId)
      .then(response => {
        
        this.setState({getRequestResponseStatus: response.status});

        
        if (response.ok){
          return response.json();
        }
        else
        {
          throw new Error("Error");
        }
        
      })
      .then(responseData => {

        if (this._isMounted){

          this.setState({course: responseData});
          
          if(this.state.course.description)
          {
            
            this.setState({descriptionElements: <ReactMarkdown source={this.state.course.description} />});
          }
          else
          {
            this.setState({descriptionElements: <p>No description available.</p>});
          }

          if(this.state.course.materialsNeeded)
          {
            this.setState({materialsElements: <ReactMarkdown source={this.state.course.materialsNeeded} />})
          }
          else
          {
            this.setState({materialsElements: <li>None listed.</li>});
          }
          

          if (authUser && authUser.id === this.state.course.userId)
          {
            this.setState({updateCourseElement: <a className="button" href={"/courses/" + this.props.courseId + "/update"}>Update Course</a>});
            this.setState({deleteCourseElement: <a className="button" href="/#" onClick={(e) => this.clickHandler(e)}>Delete Course</a>});
          }
          
        }
        this.setState({loaded: true});
      })
      .catch(error => {
   
        this.setState({badCourseGetRequest: true});

        this.setState({loaded: true});
        
      });

      
    
  }


  //handles "delete course" button click, sends DELETE request
  clickHandler = (e) => {

    e.preventDefault();


    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const password = authUser.password;

    let username = authUser.emailAddress;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
    
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'error'
    };  
    
    let responseStatus = null;
    
    fetch('http://localhost:5000/api/courses/' + this.props.courseId, requestOptions)
    .then(response => {
      responseStatus = response.status;
      if(responseStatus === 204)
      {
          window.location.replace("/");
      }
      else{
        
        return response.json();
      }
      
  })
      .then(result => {
          
        if (responseStatus === 400)
        {
          let errors = result.errors;
          console.log(errors);
          this.setState({badDeleteRequest: true});
        }
        else if (responseStatus === 500)
        {
          this.setState({badDeleteRequest: true});
        }
       
      })
   
      .catch(error => {

        this.setState({badDeleteRequest: true});
      
        console.log('error', error)
      });
  }

  componentWillUnmount(){
    this._isMounted = false;

  }
  
  render(){

    if (!this.state.loaded)
    {
      return(<div></div>)
    }
    else
    {

      //if the response to the GET request was not "OK"...
      if(this.state.badCourseGetRequest)
      {
        //...if the response gave a code for "not found", redirect to "notfound" page
        if(this.state.getRequestResponseStatus >= 400 && this.state.getRequestResponseStatus < 500)
        {
          return (<Redirect to={{
            pathname: '/notfound'
            
          }} />);
        }
        //...if the response gave any other error code, then redirect to "error" page
        else
        {
          return (<Redirect to={{
            pathname: '/error'
            
          }} />);
        }
        
        
      }

      //if the response for the DELETE request is not OK, redirect to "error" page
      else if(this.state.badDeleteRequest)
      {
        return (<Redirect to={{
          pathname: '/error'
          
        }} />);
      }

      else
      {

        
        return (
          <Fragment>
            <hr></hr>
              <div>
                  <div className="actions--bar">
                      <div className="bounds">
                      <div className="grid-100"><span>{this.state.updateCourseElement}{this.state.deleteCourseElement}</span><a
                              className="button button-secondary" href="/">Return to List</a></div>
                      </div>
                  </div>
                  <div className="bounds course--detail">
                  <div className="grid-66">
                      <div className="course--header">
                      <h4 className="course--label">Course</h4>
                      <h3 className="course--title">{this.state.course.title}</h3>
                      <p>{"By " + this.state.course.user}</p>
                      </div>
                      <div className="course--description">
                        {this.state.descriptionElements}
                      </div>
                  </div>
                  <div className="grid-25 grid-right">
                      <div className="course--stats">
                      <ul className="course--stats--list">
                          <li className="course--stats--list--item">
                          <h4>Estimated Time</h4>
                          <h3>{this.state.course.estimatedTime}</h3>
                          </li>
                          <li className="course--stats--list--item">
                          <h4>Materials Needed</h4>
                          <ul>
                              {this.state.materialsElements}
                          </ul>
                          </li>
                      </ul>
                      </div>
                  </div>
                  </div>
              </div>
            </Fragment>
        );
        
      }
        
  }
  }
  }

