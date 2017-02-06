const fs = require('fs');

const configuration = {
  role: 'twitter',
  logFileName: 'twitter.log'
};

/**
 * A sample AMQP microservice for service bus communication via RabbitMQ with the seneca-service-api
 * @param options
 */
function worker(options) {
  let log;

  this.add(`init:${configuration.role}`, init);
  this.add(`role:${configuration.role},cmd:*`, noMatch);
  this.add(`role:${configuration.role},cmd:hello_world`, helloWorld);

  function init(msg, respond) {
    // Note, all the code below is optional
    // log to a custom file
    fs.open(options.logfile, 'a', function (err, fd) {

      // cannot open for writing, so fail
      // this error is fatal to Seneca
      if (err) return respond(err);

      log = makeLog(fd);
      respond();
    });
  }

  function makeLog(fd) {
    // TODO: Tie this into something like Winston
    return function (entry) {
      fs.write(fd, '\n' + new Date().toISOString() + ' ' + entry, null, 'utf8', function (err) {
        if (err) return console.log(err);

        // ensure log entry is flushed
        fs.fsync(fd, function (err) {
          if (err) return console.log(err);
        })
      });
    }
  }

  function noMatch(payload, respond) {
    respond(null, {
      statusCode: 404,
      original: payload,
      error: {
        message: 'Invalid service command'
      }
    });
  }

  function helloWorld(payload, respond) {
    // TODO: Your service begins here
    log('RECEIVED: ' + payload);
    respond(null, {status: 'success', message: `I am the ${configuration.role} worker!`});
  }
}

// Define queues
require('seneca')()
  .use(worker, { logfile: `./${configuration.logFileName}`})
  .use('seneca-amqp-transport')
  .listen({
    type: 'amqp',
    pin: `role:${configuration.role},cmd:*`,
    url: process.env.AMQP_URL || 'amqp://127.0.0.1'
  });