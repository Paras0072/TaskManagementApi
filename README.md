Task management system developed using Node.js ,Express,MongoDb as database
 # Task Management System 

 Welcome to the Task management ! This API is designed to provide the backend functionality for an task management platform, allowing users to create projects and manage tasks within those projects.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Endpoints](#endpoints)
  - [Authentication](#authentication)
- [Models](#models)
- [Contributing](#contributing)
- [License](#license)


## Getting Started

### Prerequisites
Make sure you have the following installed before running the API:
- [Node.js](https://nodejs.org/)
- MongoDb or firebase for storing data


### Installation
1. Clone the repository:
   git clone https://github.com/your-username/TaskManagementApi.git
Install dependencies:

npm install


### Configuration
Configure your MongoDb database settings in congif/mongoose.js
 MONGODB_URI=mongodb://localhost:27017/project_management

Configure your Jwt secret key in config/passport.js
JWT_SECRET_KEY = Your-secret-Key

Configure your Jwt secret key in index.js
SESSION_SECRET_KEY = Your-secret-Key
  
### Starting the server

 Start the server: npm start

 ###  Usage
 ##  Endpoints
The API provides the following endpoints:

 # User Authentication
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
 # Project Management
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

# Task Management
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

## Authentication
Authentication is required for certain endpoints. Use your preferred authentication method (JWT, OAuth, etc.) and secure sensitive endpoints.
After login a token get generated put that token into the Authorization section of request as 
Type : Bearer Token 
value: generated token
### Models
The API uses the following Sequelize models:

User
Project
Task

Ensure to check the models and associations for database structure details.

### Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

### License
This project is licensed under the MIT License.
This README provides a starting point for users and contributors to understand the project structure, installation process, and available endpoints. Customize it further based on your specific project features and details.

