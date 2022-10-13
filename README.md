Fais tes choix sur [theodercafe.com](https://theodercafe.com)

![preview](app-preview.png)

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
