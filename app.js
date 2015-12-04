var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;
var filmSchema = new Schema({
  film_name: String
});
var Film = mongoose.model('Film', filmSchema);
module.exports = Film;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// Routes
// ------------------------------------------

var router = express.Router(); //router instance

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Request has been received');
  next(); //pass control to next route
});

//add routes here:
//routes that end in /films
router.route('/films')

  //add a film
  .post(function(req, res) {

    var film = new Film(); //new instance of Film
    film.film_name = req.body.film_name;

    film.save(function(err) {
      if(err)
        res.send(err);

      res.json({ message: 'Film created!' });
    });
  })

  //get all films
  .get(function(req, res) {
    Film.find(function(err, films) {
      if(err)
        res.send(err);

      res.json(films);
    });
  })

  //delete all films
  .delete(function(req, res) {
    Film.remove(function(err) {
      if(err)
        res.send(err);

      res.json({ message: 'All films deleted!'});
    });
  });

//routes that end in /films/:film_id
router.route('/films/:film_id')

  .get(function(req, res) {
    Film.findById(req.params.film_id, function(err, film) {
      if(err)
        res.send(err);
      res.json(film);
      //console.log(film);
    });
  })

  //update film with specific id
  .put(function(req, res) {

    Film.findById(req.params.film_id, function(err, film) {
      if(err)
        res.send(err);

      film.film_name = req.body.film_name; //update the film name

      film.save(function(err) {
        if(err)
          res.send(err);
        res.json({ message: 'Film updated!'});
      });
    });
  })

  //delete film with specific id
  .delete(function(req, res) {
    Film.remove({
      _id: req.params.film_id
    }, function(err, film) {
      if(err)
        res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });

// Register routes
// ------------------------------------------

app.use('/api', router);

// Error catching
// ------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

//Application
//---------------------------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(8080);
console.log('Server running on port 8080');
