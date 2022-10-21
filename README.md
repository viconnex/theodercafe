Fais tes choix sur [theodercafe.com](https://theodercafe.com)

<img width="175" alt="app-preview" src="https://user-images.githubusercontent.com/22373097/197242059-7b00d811-a151-4b8a-ab60-bbd8ff0ab031.png">


## Install

### Backend

```
cd backend && cp .env.dev.dist .env.dev && cd ..
docker-compose up
docker exec -it backend sh
npm run migration:run
```

### Frontend

```
cd frontend
cp .env.dist .env
npm install
npm run start
```

### Data

Create a user from the frontend with Google Login.

Then add the role admin to the user:

```
update "users" set "isAdmin"=true where id = 1;
```

Logout, Login, you should be able to see http://localhost:3000/admin#/questions page

Add question and validate them via the admin panel to be able to see them on Live Mode.

## Backlog

- In asakai mode, merge postgre db votes with live firebase votes
- Display a single url for each question so they can be shared

## Database

- Dev
  `docker-compose exec postgresql psql -d theodercafe -U the`

* Prod
  `PGDATABASE=theodercafe gcloud sql connect theodercafe --user=the`

## Architecture

### Services
<img width="953" alt="image" src="https://user-images.githubusercontent.com/22373097/197242282-d3a471df-40e1-4ad5-a2e9-1ed00bc4a519.png">

### Authentication flow
<img width="963" alt="image" src="https://user-images.githubusercontent.com/22373097/197247676-c044ea17-f0c1-414a-a86e-6ae8636a0fd2.png">
