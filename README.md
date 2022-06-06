### FONEAPI-CHAT-APP

View Live Production at https://foneapi-chat-app.herokuapp.com

API Documentation at  https://documenter.getpostman.com/view/11129402/Uz5Gobqj

This project is completion for the 4th or Final Assesstment from FONEAPI
the project is heavily derived from my previous project [E-Consultation-App](https://e-consultation-app.herokuapp.com/) -> [Github](https://github.com/user109436/Medical-Services-Management-App)

#### Specifications
1. RESTful API with s3 Bucket
   - GoogleAPI
   - Email Verification
   -  Forgot Password
   -   Sign Up
   -   Upload & Get Image to/from AWS
   -   Image Processing max of 3MB retain 80% quality

2. UI
    - Login UI (CORS issues with domain of foneapi)
    - Chat UI (unfinished)

3. CRUD Features
    - Chats
    - Chatroom
    - Users

Pending
1. Realtime Chat App

#### Technology Used
1. **M**ongoose
2. **E**xpress.js
3. **R**eact.js with Material UI
4. **N**ode.js
5. socket.io

#### Deployment on Heroku
https://devcenter.heroku.com/articles/deploying-nodejs


#### Installation

1. Before following this steps, environment variables must be define in **.env** in root directory 

**IMPORTANT!!** DO NOT UPLOAD **.env** to your repo or when deployment

```sh
NODE_ENV = development
PORT = 3001
DATABASE=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

EMAIL_FROM =
EMAIL_USERNAME=

GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=

PRODUCTION_HOST=foneapi-chat-app.herokuapp.com/
DEVELOPMENT_HOST=localhost:3003/

AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=

```
   
1. Copy Files
```sh 
git clone https://github.com/user109436/FONEAPI-CHAT-APP.git
```
1. Open Directory in VS Code or Any Text Editor
2. Install Packages in main directory (Server Level)
```sh
npm install
```
4. Run Database Seeds or Dummy Data ensure that you 
   uncomment this in the database.js otherwise 
   it won't read your environment variables
```sh
#require("dotenv").config({ path: "../.env" });
```
Navigate to **utils** folder by doing
```sh
cd utils
node database
```

5. Install Packages in client folder (Client Level)
```sh
cd client
npm install
```
6. Run project on developement (will run server and client)
```sh
npm run develop
```
6. Run Server Only (Optional)
```sh
npm run server
```
6. Run Client Only (Optional)
```sh
cd client
npm start
```
