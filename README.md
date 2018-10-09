# FatFractal Boilerplate
## Dependencies
1. Java SDK 8
2. NodeJS
3. ccze
4. curl
## Setup
1. `> npm install`
2. `> npm start`
3. Call `http://localhost:8080/boilerplate/populate` on browser or curl
4. Auth can now be made with `admin`, `johndoe` or `clinician` by default (same pw as user)
## Configuration
Edit `ff-config/application.ffdl` file ([Documentation](http://fatfractal.com/v2/documentation/#document-noserver-ffdl-overview))
## Deploy Local
```bash
npm run deploy
```
## Deploy Production
```bash
npm run production
```
## WebApp
1. Open `http://localhost:8080/boilerplate/index.html`
## Databrowser
1. Open `http://localhost:8080/boilerplate/databrowser/databrowser.html`
2. Login with `system` (same pw as user)
