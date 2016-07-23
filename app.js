/**
 * web.js
 * starts the express server and manages routes
 */

'use strict';

var config = require('config')
  , express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , jade = require('jade')
  , bodyParser = require('body-parser')
  , favicon = require('serve-favicon')
  , helper = require('./src/libs/helper')
  , logger = require('./src/libs/logger')
  , authHTTP = require('./src/controllers/http/middleware/auth')
  , pageRouter = require('./src/controllers/http/page-router')
  , apiRouter = require('./src/controllers/http/api-router')
  , ioHandler = require('./src/controllers/ws/io-handler')
  , user = require('./src/models/user')
  , socketIO = require('socket.io')
  ;

//----------
// Initialize the default connection for Mongoose
//----------

var MONGOOSE_MAX_RETRIES = 10
var mongooseRetryCount = 0;

function connectMongoose() {
  mongoose.connect(config.get('mongoDB.location'), err => {
    if (err) {
      if (mongooseRetryCount >= MONGOOSE_MAX_RETRIES) {
        logger.error('failed to connect to mongodb, exiting after ' + MONGOOSE_MAX_RETRIES +
          ' attempts.', {err});

        process.exit();
      }

      logger.error('failed to connect to mongodb, retrying in 2s', {err});
      return setTimeout(connectMongoose, 2000);
    }

    logger.info('mongoose database connected', {url: config.get('mongoDB.location')});
  });
};

connectMongoose();

//----------
// Setup up the express application and connect routes.
//----------

var app = express();

// settings
app
  .set('views', process.cwd() + '/src/views')
  .set('view engine', 'jade')
  .set('query parser', 'extended')
  .set('trust proxy', true)
  ;

// middleware
app
  .use('/public', express.static(__dirname + '/public'))
  .use(bodyParser.urlencoded({extended: true, limit: '5kb'}))
  // .use(favicon(__dirname + '/public/img/favicon.ico'));
  ;

if (helper.isDevel()) {
  var morgan = require('morgan');
  app.use(morgan('dev'));
}

// routing
app
  .use('/api', apiRouter)
  .use(pageRouter)
  ;

//----------
// Setup an HTTP server. Attach our express application and begin listening
//----------

var httpServer = http.createServer(app);
httpServer.listen(config.get('app.port'), function() {
  var host = httpServer.address().address;
  var port = httpServer.address().port;
  logger.info('Web server started', {host: host, port: port});

  if (helper.isDevel) {
    logger.warn('!!! development mode enabled !!!');
  }
});

//----------
// Setup an web socket server.
//----------
var io = socketIO(httpServer)

// socket routing
io.on('connection', ioHandler.onConnect);
