Fais tes choix sur [theodercafe.com](https://theodercafe.com)

![preview](app-preview.png)

## Database

- Dev
  `docker-compose exec postgresql psql -d theodercafe -U the`

* Prod
  `psql -h localhost -d theodercafe -U the`

## Deploy

- ssh ubuntu@theodercafe.com
- pm2 start ecosystem.config.js --env production
- npm run deploy
