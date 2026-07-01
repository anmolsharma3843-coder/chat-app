# 💬 MERN Chat Application

A real-time chat application built with the **MERN Stack** and **Socket.IO**. Users can chat privately, create groups, send messages instantly, and manage their profiles.

## Features

* User Authentication (JWT)
* Private Chat
* Group Chat
* Real-time Messaging
* Typing Indicator
* Read Receipts
* Message Reactions
* Reply, Edit & Delete Messages
* Create, Update & Delete Groups
* Add/Remove Members
* Leave Group
* Profile Image Upload
* Group Image Upload
* Search Users & Groups
* Responsive Design

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Install dependencies

#### Backend

cd server
npm install
npm run dev


#### Frontend


cd client
npm install
npm run dev


## Environment Variables

### Backend (`.env`)


PORT=4600
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

### Frontend (`.env`)


VITE_BASE_URL=http://localhost:4600


## Author

**Anmol Sharma**
