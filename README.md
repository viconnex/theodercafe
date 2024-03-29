Fais tes choix sur [theodercafe.com](https://theodercafe.com)

<img width="175" alt="app-preview" src="https://user-images.githubusercontent.com/22373097/197242059-7b00d811-a151-4b8a-ab60-bbd8ff0ab031.png">

## Install

### Backend
```
cd backend && cp .env.dev.dist .env.dev && cd ..
docker-compose up
```

### Frontend

```
cd frontend
cp .env.dist .env
npm install
npm run start
```


### Setup Google OAuth Client for Login

Authentication is performed via Google OAuth (see Authentication Flow schema below). To use OAuth locally, you need to:

- create a new project on [google cloud console](https://console.cloud.google.com/projectcreate) or use an existing one
- in the [Credential Service](https://console.cloud.google.com/apis/credentials) create OAuth Client ID credentials with params
  - _Application type_ : "Web application"
  - _Authorized JavaScript origins_: http://localhost:3000
  - _Authorized redirect URIs_: http://localhost:8080/auth/google/callback
- copy `Client ID` and `Client secret` and paste them in `GOOGLE_OAUTH2_CLIENT_ID` and `GOOGLE_OAUTH2_CLIENT_SECRET` variables in your `.env.dev` file

Help: [passport-google-oauth20 library](http://www.passportjs.org/packages/passport-google-oauth20/)



### Install check 🤞
Login from the frontend: `http://localhost:3000/login`.


### Grant admin role to your user
Connect to database :
```
docker-compose exec postgresql psql -d theodercafe -U the
```

```
UPDATE "users" SET "isAdmin"=true;
```

You should be able to see http://localhost:3000/admin#/questions page.

### Add questions

Add questions from frontend with the '+' button on bottom right.

From the [admin panel](http://localhost:3000/admin#/questions), mark them as `Validated for asakai`.

Toggle Live Mode : you should see an asakai set with validated questions.


## Features



### Live Mode (or Asakai Mode)
Asakai Mode provides a new set quesitons every day. These quesitions are randomly chosen among "validated questions".

It is also named `Live Mode` because you can see others choices live.

You can mark a question as `Validated for Asakai` from [the admin panel](http://localhost:3000/admin#/questions).

The Asakai Set also depends of the `Question Set` chosen by the user.

An admin may click `changeTodaySet` button to renew the Asakai Set.

On the admin panel, mark a question as `Classic` : the question will necessary be part of the `Live Mode` set.

Turning on `Coach Mode` enables a coach to ask the questions to a brand new Theodoer. Indeed, it will:
- prevent from attaching the choices to the coach's account
- propose an email form at the end of the questioning to register the new Theodoer. If the email does not exist yet:
  - a new user is created
  - a welcome email is sent
  - choices made during asakai and also asakai alterodo result are attached to the new user

### All questions mode
If you Toggle `Live Mode` to OFF, you may filter questions with the FILTRES menu.


## Database

### Connexion
- Dev:
  `docker-compose exec postgresql psql -d theodercafe -U the`
- Prod
  `PGDATABASE=theodercafe gcloud sql connect theodercafe --user=the`
### Diagram

Diagram here https://dbdiagram.io/d/63c40a1b296d97641d79bfe7.

Dump:
```
docker-compose exec postgresql pg_dump -d theodercafe -U the -s >schema.sql
```


## Architecture

### Services

<img width="953" alt="image" src="https://user-images.githubusercontent.com/22373097/197242282-d3a471df-40e1-4ad5-a2e9-1ed00bc4a519.png">

### Authentication flow

<img width="963" alt="image" src="https://user-images.githubusercontent.com/22373097/197247676-c044ea17-f0c1-414a-a86e-6ae8636a0fd2.png">

## Firebase setup

To run Live Mode features locally, you need to :
- add a [firebase project](https://console.firebase.google.com/)
- enable `Firestore Database` on this project.
- in the project settings -> service accounts, create a Firebase Admin SDK
  - copy the firebase service account email and paste it into the `FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL` variable of your .env.dev
  - Generate a new private key and paste the `secret_key` value into variable. For example:

  ```
  FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL="firebase-adminsdk-xxx@theodercafe.iam.gserviceaccount.com"
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nMIIEuaIBADANBgkq...\n-----END PRIVATE KEY-----\n'
  ```
- in the Cloud Firestore -> Rules, paste the following rules. It allows any authenticated to read other users' answers. But a user may only modify the answer corresponding to its `userId`.

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /questioning/{questioningId}/questions/{questionId}/users/{userId}{
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      match /questioning/{questioningId}/questions/{questionId}/{users=**}{
        allow read: if request.auth != null;
      }
    }
  }
  ```

  ## Database Entities

  https://dbdiagram.io/d/63c40a1b296d97641d79bfe7