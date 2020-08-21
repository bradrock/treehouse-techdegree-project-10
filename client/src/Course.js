import React from 'react';


function Course(props) {
    
    const classes = `course--module course--link`;
    
    return (<div className="grid-33">
            <a className={classes} href={"/courses/" + props.id}><h4 className="course--label">Course</h4><h3 className="course--title">{props.title}</h3></a>
        </div>);
  }

export default Course;