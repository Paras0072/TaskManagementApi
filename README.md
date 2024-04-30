 # Task Management System 

 This project is a Task management system that allows users to create projects and manage tasks within those projects.
 
 # Setup Instructions
 
 1. Clone the repository to your local machine: git clone <repository-url>
 2. Install dependencies: npm install
 3. PORT=3000 &
    MONGODB_URI=mongodb://localhost:27017/project_management
 4. Start the server: npm start

 #  API Endpoints
 ## User Authentication
 ### Register User
 
 * URL: `/auth/register`
  
 * Method: POST
 * Request Body;
    * username (string, required): The username of the user.
    * email (string, required): The email address of the user.
    * password (string, required): The user's password.
    * confirmpassword (string, required): Confirmation of the user's password.
 *  Example Request:
  {
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmpassword": "password123"
 }
  * Example Response: {
  "status": "success",
  "message": "User registered successfully"
}
### Login User
 
 * URL:/auth/login
  
 * Method: POST
 * Request Body;
  
    * email (string, required): The email address of the user.
    * password (string, required): The user's password.
  
 *  Example Request:
  {
 
  "email": "john@example.com",
  "password": "password123",
 
 }
  * Example Response: {
  "status": "success",
  "message": "<JWT_TOKEN>"
}
 ## Project Management
 ### Create Project

  * URL:/projects
  
 * Method: POST
 * Authorization Header: Bearer <JWT_TOKEN>
 * Request Body;
    * projectId (string, required): The id of the project.
    * projectName (string, required): The name of the project.
    * purpose (string, required): The purpose of the project.
  
 *  Example Request:

 { 
   "project":"1",
  "projectName": "New Project",
  "purpose": "To manage tasks efficiently"
}
  * Example Response: {
  "status": "success",
  "data": {
    "project": {
      "_id": "609c44bc3c59522ae8d554c2",
        "projectId":"1",
      "projectName": "New Project",
      "purpose": "To manage tasks efficiently"
    }
  }
}


 ### Get All Projects

  * URL:/projects
  
 * Method: GET
 * Authorization Header: Bearer <JWT_TOKEN>


  * Example Response:{
  "status": "success",
  "data": {
    "projects": [
      {
        "_id": "609c44bc3c59522ae8d554c2",
         "projectId":"1",
        "projectName": "New Project",
        "purpose": "To manage tasks efficiently"
      },
      // More projects...
    ]
  }
}

 ### Get Project by ID

  * URL:/projects/:projectId
  
 * Method: GET
 * Authorization Header: Bearer <JWT_TOKEN>

 * Example Response: {
  "status": "success",
  "data": {
    "project": {
      "_id": "609c44bc3c59522ae8d554c2",
      "projectId":"1",
      "projectName": "New Project",
      "purpose": "To manage tasks efficiently"
    }
  }
}
 ### Delete Project

  * URL:/projects/:projectId
  
 * Method: DELETE
 * Authorization Header: Bearer <JWT_TOKEN>

  
 * Example Response: {
  "status": "success",
  "message": "Project deleted successfully"
}

## Task Management
### Create Task
  * URL:/projects/task/:projectId
  
 * Method: POST
 * Authorization Header: Bearer <JWT_TOKEN>

 * Request Body;
    * taskId (string, required,unique): The id of the task.
    * title (string, required): The title of the task.
    * status (string, optional): The status of the task (e.g., "todo", "in progress", "completed").
    * tags (string, optional): Tags associated with the task.
    * priority (string, optional): The priority of the task (e.g., "high", "medium", "low").
    * purpose (string, required): The purpose of the task.
    * assignees (array of strings, optional): The users assigned to the task.
  
 *  Example Request:

{
  "taskId": "1",
  "title": "Task 1",
  "description": "Complete task 1",
  "status": "todo",
  "tags": "Development",
  "priority": "high",
  "purpose": "To achieve project goals",
  "assignees": ["user1@example.com", "user2@example.com"]
}
  * Example Response: {
  "status": "success",
  "data": {
    "task": {
      "_id": "609c45623c59522ae8d554c3",
      "title": "Task 1",
      "description": "Complete task 1",
      "status": "todo",
      "tags": "Development",
      "priority": "high",
      "purpose": "To achieve project goals",
      "assignees": ["user1@example.com", "user2@example.com"]
    }
  }
}
### getAllTasks
  * URL:/projects/task/:projectId
  
 * Method: GET
 * Authorization Header: Bearer <JWT_TOKEN>
 * Example Response: {
  "status": "success",
  "data": {
    "task": {
      "_id": "609c45623c59522ae8d554c3",
      "title": "Task 1",
      "description": "Complete task 1",
      "status": "todo",
      "tags": "Development",
      "priority": "high",
      "purpose": "To achieve project goals",
      "assignees": ["user1@example.com", "user2@example.com"]
    }
  }
}
### getTaskById
  * URL:/projects/task/:projectId/:taskId
  
 * Method: GET
 * Authorization Header: Bearer <JWT_TOKEN>
 * Example Response: {
  "status": "success",
  "data": {
    "task": {
      "_id": "609c45623c59522ae8d554c3",
      "title": "Task 1",
      "description": "Complete task 1",
      "status": "todo",
      "tags": "Development",
      "priority": "high",
      "purpose": "To achieve project goals",
      "assignees": ["user1@example.com", "user2@example.com"]
    }
  }
}

 ### Delete Task

  * URL:/projects/:projectId/:taskId
  
 * Method: DELETE
 * Authorization Header: Bearer <JWT_TOKEN>

  
 * Example Response: {
  "status": "success",
  "message": "Task deleted successfully"
}

