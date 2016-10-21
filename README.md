# seneca-amqp-service

## Overview

This is a sample of an AMQP service as part of an ecosystem that is exposed by [seneca-service-api](https://github.com/ericnograles/seneca-service-api)

## Prerequisites

1. [RabbitMQ](https://www.rabbitmq.com/install-homebrew.html)
1. [Node Version Manager](https://github.com/creationix/nvm)
1. [Yarn](https://yarnpkg.com/)
1. `nvm install 6.9.0`
1. `nvm alias default 6.9.0`

## Installation

1. Clone this repo
1. `yarn install`
1. `npm start`
1. The service will listen to requests via RabbitMQ under the `seneca.add.role:twitter.cmd:any` queue

## Usage

1. Start this service using `npm start`
1. Start the [seneca-service-api](https://github.com/ericnograles/seneca-service-api)
1. Browse to `http://localhost:3001/api/v1/twitter/tweets`
1. You should receive the following payload

```javascript
{
  status: "success",
  tweets: [ ]
}
```
