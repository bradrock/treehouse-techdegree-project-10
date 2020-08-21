import React, {Fragment} from 'react';
import Course from './Course';
import { Redirect } from 'react-router-dom';

export default class Courses extends React.PureComponent {

    constructor(){
      super();
      this.state = {
        courses: [],
        error: false,
        isLoading: true
      }
     
    }
  
    componentDidMount(){
      fetch('http://localhost:5000/api/courses')
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
        this.setState({courses: responseData});
  
      })
      .catch(error => {
        this.setState({error: true});
        console.log(this.state.error);
      });

      this.setState({isLoading: false});
    
  }
  
  render(){
    
    if(this.state.error)
    {
      return (<Redirect to={{
        pathname: '/error'
        
      }} />);
    }
    else
    {
      
      if(this.state.isLoading)
      {
        return(null);
      }
      
      else
      {
        let courses = null;
    
        if (this.state.courses.length)
        {
          courses = this.state.courses.map(course =>  <Course id={course.id} title={course.title} key={course.id}/>);
        }
    
        return (
          <Fragment>
          <hr></hr>
            <div className="bounds">
                {courses}
                <div className="grid-33"><a className="course--module course--add--module" href="/courses/create">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </a></div>
            </div>
            
            </Fragment>
        );
      }
    }

  }
  }
