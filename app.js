var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
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
  addVars(request);

  compileSass();
});

app.use(express.static('app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

const addVars = function(request) {
	const numCols = request.body.numCols,
		gutter = request.body.gutter,
		halfGutter = parseInt(gutter) / 2,
		maxWidth = request.body.maxWidth,
		smBreakpoint = request.body.smBreakpoint,
		mdBreakpoint = request.body.mdBreakpoint,
		lgBreakpoint = request.body.lgBreakpoint;

  	var variablesFileContents = "$content-max-width: " + maxWidth + "px;$gutter-width: " + gutter + "px;$half-gutter-width: " + halfGutter + "px;$small-breakpoint: " + smBreakpoint + "px;$medium-breakpoint: " + mdBreakpoint + "px;$large-breakpoint: " + lgBreakpoint + "px;"

	fs.writeFile('app/new-scss/_variables.scss', variablesFileContents, (err) => {
		if (err) throw err;
	});
}

const compileSass = function(done) {
  // eg: copy *.js files into `./dist`
  gulp.src('./app/new-scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/new-css/'));
}