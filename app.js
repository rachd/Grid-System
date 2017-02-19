var gulp = require('gulp');
var sass = require('gulp-sass');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/app/index.html'));
});

app.post('/', function (request, response) {
  // response.send('Got a POST request');
  // response.sendFile(path.join(__dirname + '/app/css/main.css'));
  console.log(request.body.numCols);
  console.log(request.body.gutter);
  console.log(request.body.maxWidth);
  console.log(request.body.prefix);
  console.log(request.body.smBreakpoint);
  console.log(request.body.mdBreakpoint);
  console.log(request.body.lgBreakpoint);

  compileSass(function () {
	  console.log('Done!');
	});
});

app.use(express.static('app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

function compileSass(done) {
  // eg: copy *.js files into `./dist`
  gulp.src('./app/new-scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/new-css/'))
    .on('end', function () {
      if (done) { 
        done(); // callback to signal end of build
      }
    });
}