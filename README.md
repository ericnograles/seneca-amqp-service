# seneca-amqp-service

## Overview

This is a sample of an AMQP service as part of an ecosystem that is exposed by [seneca-service-api](https://github.com/ericnograles/seneca-service-api)

## Developer's Note

While Seneca does support TCP and HTTP point-to-point microservices, it is of my opinion that a pure AMQP implementation is ideal.  I have this opinion for several reasons:

1. Allows for a purely dynamic, conventions based development flow. Developers can release services at will, and as long as it follows the Service API's conventions, the Service API will never have to be altered
1. AMQP offers durability.  If messages fail, they can be retried at a later time.  This is great for "push style" integrations, such as social media firehoses.
1. Easier infrastructure integration.  With a point-to-point system, you have to deal potentially with firewall and security concerns.  AMQP is a standard port and is designed for high throughput.
1. While some developers are concerned with the "hops" between the API to the MQ to the Service and back, the latency introduced is minimal.  Observed response times at load for a baseline call hovered at around 150ms.

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
