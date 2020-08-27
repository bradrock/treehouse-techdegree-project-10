//renders "create course" page
import React, {Fragment} from 'react';
import { Redirect } from 'react-router-dom';

export default class CourseUpdate extends React.PureComponent {

  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      course: {
        title: '',
        description: '',
        materialsNeeded: '',
        estimatedTime: ''
      },
      loaded: false,
      validationErrorDisplay: "none",
      validationErrorListElements: null,
      postRequestServerError: false
    };

  }


  componentDidMount(){

    this._isMounted = true;
  
  }


//handle "create coures" button click--send new course POST request
submitClickHandler = (e) => {
  e.preventDefault();

    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const password = authUser.password;

    let username = authUser.emailAddress;
    
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
      
      var raw = JSON.stringify({
    
        "title": this.state.course.title,
        "description": this.state.course.description,
        "estimatedTime": this.state.course.estimatedTime,
        "materialsNeeded": this.state.course.materialsNeeded,
        "userId": authUser.id
      
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'error'
      };
      
      let responseStatus = null;

      fetch("http://localhost:5000/api/courses", requestOptions)
      .then(response => {
          responseStatus = response.status;
          if(responseStatus === 201)
          {
            this.props.history.push("/");
              
          }
          else{
            
            return response.json();
          }
          
      })
      .then(result => {
          
        if (responseStatus === 400)
        {
          let errors = result.errors;
          this.setState({validationErrorListElements: errors.map((error, index) => <li key={index}>{error}</li>)});
          this.setState({validationErrorDisplay: "block"});
        }
        else if (responseStatus === 500)
        {
          this.setState({postRequestServerError: true});
        }
        
      })
     
      .catch(error => 
        {
          console.log('error', error);
          this.setState({postRequestServerError: true});
        });

}


handleChangeEstimatedTime = (e) => {
  

const value = e.target.value;
 this.setState(prevState => ({
  course: {                   
      ...prevState.course,    
      estimatedTime: value    
  }
}));
  
}


handleChangeTitle = (e) => {
  
 
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                   
       ...prevState.course,    
       title: value      
   }
 }));

}


handleChangeDescription = (e) => {
  
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                   
       ...prevState.course,    
       description: value      
   }
 }));
 
}


handleChangeMaterialsNeeded = (e) => {
  
 
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                  
       ...prevState.course,    
       materialsNeeded: value      
   }
 }));
 
}


componentWillUnmount(){
  this._isMounted = false;

}
  
  render(){


    if(this.state.postRequestServerError)
    {
      return (<Redirect to={{
        pathname: '/error'
        
      }} />);
    }

    else{
      return (
        <Fragment>
            <div className="bounds course--detail">
              <h1>Create Course</h1>
              <div>
                <div>
                  <h2 className="validation--errors--label" style={{display: this.state.validationErrorDisplay}}>Validation errors</h2>
                  <div className="validation-errors">
                    <ul>
                      {this.state.validationErrorListElements}
                    </ul>
                  </div>
                </div>
                <form>
                  <div className="grid-66">
                    <div className="course--header">
                      <h4 className="course--label">Course</h4>
                      <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.course.title} onChange={e => this.handleChangeTitle(e)}/></div>
                      <p>By Joe Smith</p>
                    </div>
                    <div className="course--description">
                      <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.course.description} onChange={e => this.handleChangeDescription(e)}></textarea></div>
                    </div>
                  </div>
                  <div className="grid-25 grid-right">
                    <div className="course--stats">
                      <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                          <h4>Estimated Time</h4>
                          <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={this.state.course.estimatedTime} onChange={e => this.handleChangeEstimatedTime(e)}/></div>
                        </li>
                        <li className="course--stats--list--item">
                          <h4>Materials Needed</h4>
                          <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.course.materialsNeeded} onChange={e => this.handleChangeMaterialsNeeded(e)}></textarea></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={e => this.submitClickHandler(e)}>Create Course</button><a className="button button-secondary" href='/'>Cancel</a></div>
                </form>
              </div>
            </div>
          </Fragment>
        );
      }
    }
    }
 