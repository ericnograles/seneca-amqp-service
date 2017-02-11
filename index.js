const winston = require('winston');
const fs = require('fs');

const configuration = {
  role: 'sample',
  logFileName: 'worker.log'
};

/**
 * A sample AMQP microservice for service bus communication via RabbitMQ with the seneca-service-api
 * @param options
 */
function worker(options) {
  let log;

  this.add(`init:${configuration.role}`, init);
  this.add(`role:${configuration.role},version:*,cmd:*,method:*`, noMatch);
  this.add(`role:${configuration.role},version:*,cmd:hello_world,method:GET`, helloWorld);

  function init(msg, respond) {
    winston.info(`Initializing ${configuration.role} service`);
    // TODO: Any initialization routines go here
  }

  function noMatch(msg, respond) {
    respond(null, {
      statusCode: 404,
      original: msg,
      error: {
        message: 'Invalid service command'
      }
    });
  }

  function helloWorld(msg, respond) {
    winston.info('RECEIVED: ' + JSON.stringify(msg));
    respond(null, {status: 'success', message: `I am the ${configuration.role} worker!`});
  }
}

// Define queues
require('seneca')()
  .use(worker, { logfile: `./${configuration.logFileName}`})
  .use('seneca-amqp-transport')
  .listen({
    type: 'amqp',
    pin: `role:${configuration.role},version:*,cmd:*,method:*`,
    url: process.env.AMQP_URL || 'amqp://127.0.0.1'
  });