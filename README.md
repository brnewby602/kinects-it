# kinectsit       

####Master branch build status: ![](https://travis-ci.org/Kinectsit/kinects-it.svg?branch=master)

> Bringing your 1.0 stuff to the 2.0 world....kinectsit.
> Bringing your things into the Internet of Things.
> 

## Team

  - __Product Owner__: Bucko Perley
  - __Scrum Master__: Bryan Newby
  - __Development Team Members__: Krista Moroder, Bucko Perley, Bryan Newby

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Resources] (#resources)
1. [Contributing](#contributing)

## Usage 

> Some usage instructions

## Requirements

### Tech Stack

#### Server
- Node 
- Express
- Postgres
- Sequelize
- Little Bits (hardware integration) & Little Bits API

#### Client
- React 
- Redux 
- Foundation 
- SASS
- Webpack

#### Continuous Integration and Testing
- Mocha
- Supertest
- TravisCI - https://travis-ci.org/Kinectsit/kinects-it

#### Deployment
- AWS EC2 
- Docker (will remove if time constraints require it)

## Development

### Installing Dependencies

From within the root directory:

The following command will create the persistent database and schema.  Prerequisite is that you have
postgres installed.

```sh
createdb kinectdb -U postgres
psql -U postgres -d kinectdb -f ./server/config/schema.sql
```
For Device management, a redis database is also required. Prerequisite is that you have redis installed. Then run the following command:

```sh
redis-server /usr/local/etc/redis.conf --port 6379
```

### Database

From within postgres terminal:

```sh
create user postgres
create database kinectdb owner postgres
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)

## Resources
Below are some of the helpful resources used to build this application
- __Project Boilerplate__- [React Slingshot] (https://github.com/coryhouse/react-slingshot)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
