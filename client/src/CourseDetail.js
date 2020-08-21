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
        error: false
        
      };

    }

  
    componentDidMount(){


      const { context } = this.props;
      const authUser = context.authenticatedUser;
      this._isMounted = true;


      fetch('http://localhost:5000/api/courses/' + this.props.courseId)
      .then(response => {
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
            this.setState({deleteCourseElement: <a className="button" href="/#" onClick={() => this.clickHandler()}>Delete Course</a>});
          }
          
        }
        this.setState({loaded: true});
      })
      .catch(error => {
   
        this.setState({error: true});

        this.setState({loaded: true});
        
      });

      
    
  }

  clickHandler = () => {

      fetch('http://localhost:5000/api/courses/' + this.state.course.id, {method: 'DELETE'})
      .then((response) => {window.location.replace("/")})
      .catch(error => {
        console.log('Error deleting: ', error);
        
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

      if(this.state.error)
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

