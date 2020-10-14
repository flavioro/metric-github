# 📈 Metrics GitHub API

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/flavioro/metrics-github/CI?logo=github&style=flat-square)](https://github.com/flavioro/metrics-github/actions)
[![mongoose](https://img.shields.io/badge/mongoose-5.10.2-green?style=flat-square&logo=mongo&logoColor=white)](https://mongoosejs.com/)
[![eslint](https://img.shields.io/badge/eslint-7.8.1-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-26.4.2-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/flavioro/metrics-github?logo=codecov&style=flat-square)](https://codecov.io/gh/flavioro/metrics-github)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/flavioro/metrics-github/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=metrics-github&uri=https://github.com/flavioro/metrics-github/blob/master/Insomnia_2020-10-13-Flavio.json)

## 🏷️ ABOUT

NodeJs - Backend - MetricsGitHub will collect metrics from GitHub projects and make them available in a consolidated dashboard. End users can query by Project name (like “React”) then they will see a #issues, average, and standard deviation time. App MetricsGitHub use JWT authentication.

Allow users to search by project name and check issues status like opened issues, average days opened and deviation. The app use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
- [Requirements:](#Requirements:)
- [Installing](#installing)
  - [Configuring](#configuring)
    - [MongoDB](#mongodb)
- [Usage](#usage)
  - [Bearer Token](#bearer-token)
  - [Versioning](#versioning)
  - [Routes](#routes)
    - [Requests](#requests)
- [Running the tests](#running-the-tests)
  - [Coverage report](#coverage-report)

# Requirements: - 🚀 Technologies used

VS Code - Visual Studio Code [Link](https://code.visualstudio.com/download)
npm - [Link](https://www.npmjs.com/get-npm)
Node.js 10+ [Link](https://nodejs.org/en/download/)
MongoDB [Link](https://docs.mongodb.com/manual/administration/install-community/)
Optional - Docker [Link](https://docs.docker.com/get-docker/) - Docker is a tool designed to make it easier to create, deploy, and run applications by using containers, I use and recommend.
GitHub - [Link](https://git-scm.com/downloads)

# Installing


Getting a Git Repository [Link](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)

```
$ npm install
```

> Testing your application is part of the development. [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) I use it as a pre-test and also typescript to keep the code clean and patterned.

## Configuring - 🌐 Environment variables


env file. It's actually a simple configuration text file that is used to define some variables you want to pass into your application's environment. Rename file `.env.example` to `.env`
.env(https://github.com/motdotla/dotenv)

| key                 | description                                                                                                                                                                           | default      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| APP_PORT            | Port number where the app will run.                                                                                                                                                   | `3333`       |
| GITHUB_TOKEN            | A personal token for GitHub access, it **is necessary**                                                                                                                                                  | `token-created`       |
| GITHUB_API            | API to GitHub access                                                                                                                                                    | `https://api.github.com`       |
| JWT_SECRET          | A alphanumeric random string. Used to create signed tokens.                                                                                                                           | -            |
| JWT_EXPIRATION_TIME | How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.                                                | `7d`         |
| MONGO_DB            | Database name.                                                                                                                                                                        | `metricsGithub` |
| MONGO_HOST          | MongoDB host. For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host to `192.168.99.100` (docker machine IP) instead of localhost or `localhost`. | `localhost`  |
| MONGO_PORT          | MongoDB standard port.                                                                                                                                                                         | `27017`       |


To create a personal access token in GitHub [link](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) is required to use the app metrics-github.


### MongoDB

The motivation of the MongoDB language is to implement a data store that provides high performance, high availability, and automatic scaling. MongoDB is extremely simple to install and implement. MongoDB uses JSON or BSON documents to store data.

Or use docker to mongoDB
```
$ docker run --name metrics-github-mongo -d -p 27017:27017 mongo
```


# Usage

To start up the app run:

```
$ yarn dev:server
```

Or:

```
npm run dev:server
```

## Bearer Token

A few routes expect a Bearer Token in an `Authorization` header.

> You can see these routes in the [routes](#routes) section.

```
GET http://localhost:3333/v1.0/repositories/libquality Authorization: Bearer <token>
```

> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Versioning

A simple versioning was made. Just remember to set after the `host` the `/v1.0/` string to your requests.

```
GET http://localhost:3333/v1.0/repositories/libquality
```

## Routes

| route                                 | HTTP Method |                                   params                                   |                                                         description                                                         |    auth method     |
| :------------------------------------ | :---------: | :------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :----------------: |
| `/sessions`                           |    POST     |                  Body with user's `email` and `password`.                  |                            Authenticates user, return a Bearer Token and user's id and session.                             |        :x:         |
| `/users`                              |    POST     |                  Body with user's `email` and `password`.                  |                                                     Create a new user.                                                      |        :x:         |
| `/repositories/:gitNamesRepositories` |     GET     |                   `:gitNamesRepositories` to search for.                   |                                    Search repositories in GitHub and return suggestions.                                    | :heavy_check_mark: |
| `/metrics/:user/:repository`          |     GET     |    `:user` and `:repository` from a GitHub's repository (`full name`).     |                 Return repository's name, open issues count, days opened average and days opened deviation.                 | :heavy_check_mark: |
| `/metrics/chart`                      |     GET     | `repository[0]`, `repository[1]` ... `repository[n]`, repository full name | Return data to fill a chart of lines ([Chart.js](https://www.chartjs.org). You can see an example inside `example` folder.) |

> Routes with auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests

- `POST /session`

Request body:

```json
{
  "email": "diegovictorgonzaga@gmail.com",
  "password": "123456"
}
```

- `POST /users`

Request body:

```json
{
  "email": "diegovictorgonzaga@gmail.com",
  "password": "123456"
}
```

# Running the tests

[Jest](https://jestjs.io/) was the choice to test the app, to run:

```
$ yarn test
```

Or:

```
$ npm run test
```

## Coverage report

You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
