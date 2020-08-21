import React, {Fragment} from 'react';
import { Redirect } from 'react-router-dom';


export default class UpdateCourse extends React.PureComponent {

  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      course: { title: null,
        id: null,
        estimatedTime: null,
        user: null,
        materialsNeeded: null
      },
      
      loaded: false,
      validationErrorDisplay: "none",
      
      errorListElements: null,
      error: false,
      forbidden: false
    };

  }

  

  componentDidMount(){

    this._isMounted = true;

    const { context } = this.props;
    const authUser = context.authenticatedUser;

    

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

        if (authUser && this.state.course.userId && authUser.id !== this.state.course.userId)
          {
            this.setState({forbidden: true});
          }


        this.setState({loaded: true});
      }
    })
    .catch(error => {
      this.setState({error: true});
      this.setState({loaded: true});
    });

    
}


updateClickHandler = (e) => {
  e.preventDefault();

    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const password = authUser.password;

    let username = authUser.emailAddress;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
    
    var raw = JSON.stringify({
    
      "id": this.state.course.id,
      "title": this.state.course.title,
      "description": this.state.course.description,
      "estimatedTime": this.state.course.estimatedTime,
      "materialsNeeded": this.state.course.materialsNeeded
    
    });
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    let responseStatus = null;

    fetch("http://localhost:5000/api/courses/" + this.state.course.id, requestOptions)
    .then(response => {
      responseStatus = response.status;
      if(responseStatus === 204)
      {
          
          window.location.replace("/courses/" + this.state.course.id);
      }
      else{
        
        return response.json();
      }
      
  })
      .then(result => {
          
        if (responseStatus === 400)
        {
        console.log("Response status is: " + responseStatus);
          console.log(result);
          let errors = result.errors;
          console.log(errors);
           this.setState({errorListElements: errors.map((error, index) => <li key={index}>{error}</li>)});
            this.setState({validationErrorDisplay: "block"});
        }
       
      })
   
      .catch(error => console.log('error', error));

      


}


handleChangeEstimatedTime = (e) => {
  
const value = e.target.value;
 this.setState(prevState => ({
  course: {                 
      ...prevState.course,    
      estimatedTime: value      
  }
}))
  
}


handleChangeTitle = (e) => {
  
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                   
       ...prevState.course,    
       title: value      
   }
 }))

}


handleChangeDescription = (e) => {
  
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                   
       ...prevState.course,    
       description: value      
   }
 }))

}


handleChangeMaterialsNeeded = (e) => {
  
 const value = e.target.value;
  this.setState(prevState => ({
   course: {                   
       ...prevState.course,    
       materialsNeeded: value      
   }
 }))
 
}


componentWillUnmount(){
  this._isMounted = false;

}
  
  render(){

    if (!this.state.loaded)
    {
      return(null);
    }

    else{

      if(this.state.error)
      {
        return (<Redirect to={{
          pathname: '/error'
          
        }} />);
      }
      else
      {

        if(this.state.forbidden)
        {
          return (<Redirect to={{
            pathname: '/forbidden'
            
          }} />);
        }
        else
        {

          return (
            <Fragment>
              <hr></hr>
              <div className="bounds course--detail">
                  <h1>Update Course</h1>
                  <div>
                    <div>
                      <h2 className="validation--errors--label" style={{display: this.state.validationErrorDisplay}}>Validation errors</h2>
                        <div className="validation-errors">
                          <ul>
                            {this.state.errorListElements}
                          </ul>
                        </div>
                      </div>
                    <form>
                      <div className="grid-66">
                        <div className="course--header">
                          <h4 className="course--label">Course</h4>
                          <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.course.title} onChange={e => this.handleChangeTitle(e)}/></div>
                          <p>{"By " + this.state.course.user}</p>
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
                      <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={e => this.updateClickHandler(e)}>Update Course</button><a className="button button-secondary" href={'/courses/' + this.props.courseId}>Cancel</a></div>
                    </form>
                  </div>
                </div>
              </Fragment>
            );
        }
      }
    
    }
    }
  }