import React, {useEffect} from 'react'
import axios from "axios";
import API from "../../utils/API";


//Global Array for Unique Categories
const categoryArray = [];
var category="";

//Tasklist Generates Tasks and corresponding categories//

const TaskList = (props) => {
  const taskObject = props.taskObject;
  const setTaskObject = props.setTaskObject;    
  const objectArray = [];
  
   //arrayFunction sorts out duplicate values (CATEGORIES)//

  const arrayFunction = (preArray)=>{
    var m = {}
    for (var i=0; i<preArray.length; i++) {
      var v = preArray[i];
      if (!m[v]) {
        categoryArray.push({v});
        m[v]=true;
      }
    }
  };

  //Function takes in GET Response
  const resObject = (res) => {
    const preArray = []; 
    //loops through response & creates object
      res.forEach((obj, index) => {
        var eachTaskObj={
        taskItem: obj.taskItem,
        priority: obj.priority,
        category: obj.category,
        dueDate: obj.dueDate,
        id: obj._id
      }
        //pushes results object into array for tasks & task categories    
        objectArray.push(eachTaskObj)
        preArray.push(obj.category)   
        console.log(preArray)
      })
        //pushes results objects into functions
        //one that sets state & and one that sorts out duplicates
        arrayFunction(preArray)
        setTaskObject(objectArray) 
        console.log(objectArray) 
        console.log(categoryArray) 
  };

  //Click handler that removes completed tasks
  const complete = (key, taskObject) => {
    for(let i=0; i<taskObject.length; i++){
      if(taskObject[i].id===key){
        console.log(taskObject[i].category)
        var taskComplete={
          category:taskObject[i].category
        }
      }
    }

    API.postCategory(taskComplete)
    .then(console.log('taskComplete'))
    console.log("!" + taskComplete.category)
    console.log("!" + key)
    
    console.log(taskObject[0].id)
    axios.delete("/api/tasks/"+key)
    .then((res) => {
      // window.location.reload();
      console.log(res);
    });
  }   
  

  //GET call that pulls from database
  const getTasks = () => {
    axios.get("/api/tasks")
    .then(function (response) {
      var res=response.data;
      resObject(res)
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });

  };
    useEffect(() => {
      getTasks();
      
    }, []);

    useEffect(() => {
        console.log(taskObject);
        
    }, [taskObject])
    
    
  return (        
    <div id="accordion">  
      {categoryArray.length && categoryArray.map((obj, i) => {
        category = obj.v;
        console.log(category)
        return(
          <div className="card" key={i}>
            <div className="card-header" id="headingOne">
              <h5 className="mb-0">
                <button className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+ i} aria-expanded="false" 
                aria-controls={i}>               
                  {category}
                </button>
              </h5>
            </div>
            <div id={"collapse"+ i} className="collapse" aria-labelledby="headingOne" data-parent="#accordion" >
              <div className="card-body">
                <ul>
                  {taskObject.length && taskObject.map((obj, i) => {
                    if(obj.category===category)
                    return (
                      <div className="card" key={obj.id}> Due: {obj.dueDate}  Priority Level: {obj.priority}
                          <div className="card-header">
                              Task: {obj.taskItem}<button className="btn btn-danger btn-xs" onClick={() => complete(obj.id, taskObject)}>Completed</button>
                          </div>
                      </div>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>        
  )
};

export default TaskList;