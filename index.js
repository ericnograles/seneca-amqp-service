var fs = require('fs');

/**
 * A sample AMQP microservice for service bus communication via RabbitMQ with the seneca-service-api
 * @param options
 */
function twitter(options) {
  var log;

  this.add('init:twitter', init);
  this.add('role:twitter,version:*,cmd:*,method:*', noMatch);
  this.add('role:twitter,version:*,cmd:tweets,method:GET', tweets);

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

  function tweets(payload, respond) {
    // TODO: Your service begins here
    log('RECEIVED: ' + payload);
    respond(null, {status: 'success', tweets: []});
  }
}

// Define queues
require('seneca')()
  .use(twitter, { logfile: './twitter.log'})
  .use('seneca-amqp-transport')
  .listen({
    type: 'amqp',
    pin: 'role:twitter,version:*,cmd:*,method:*',
    url: process.env.AMQP_URL || 'amqp://127.0.0.1'
  });