# UE API

API pour la gestion du guide des UEs de l'Université de Technologie de Troyes

## Requirements

* [Node.js](https://nodejs.org/)
* [yarn](https://yarnpkg.com/)

## Installation

```
git clone 
# or
git clone 

cd ue-api
yarn
```

## Database

```
# create the databse 'ue', should be in utf8 not utf8mb4, otherwise it wont work
CREATE DATABASE ue CHARACTER SET utf8;
```

## Configuration

```
# copy env file for all environments
cp .env .env.local
# makes your changes in .env.local, which will not be pushed
nano .env.local
# you should change DB settings for your database
```


## Commands

```
yarn dev    # development server
yarn start  # production server
yarn serve  # pm2 production server (load balancing)
yarn reload # pm2 hot reload
yarn lint   # prettier lint
```

## Structure

```
.
├── bin
│   └── start.js          # prod entry point, launches src/index.js
├── src
│   ├── api
│   │   ├── controllers   # routes
│   │   ├── middlewares   # middlewares, mostly to restrict routes
│   │   ├── models        # models for sequelize, define DB tables
│   │   └── utils         # utilities, like libraries or plugins
│   ├── database.js       # config and launch database
│   ├── env.js            # add .env variables to process.env
│   ├── index.js          # application entry point
│   └── main.js           # core codes
├── .env                  # env variables
├── LICENSE               # license
├── README.md             # this file
├── package.json          # define project and dependencies
├── tslint.json           # linting
└── yarn.lock             # yarn file
```
