var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');
var express = require('express');
// var archiver = require('archiver');
// var archive = archiver.create('zip', {});
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// var output = fs.createWriteStream(__dirname + '/grid_system.zip');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/app/index.html'));
});

app.post('/', function (request, response) {
  addVars(request);

  compileSass();

  // archive.pipe(output);
  // archive
  // .directory(__dirname + '/app/return-files')
  // .finalize();

  // response.download(path.join(__dirname + '/grid_system.zip'));
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

const compileSass = function() {
  gulp.src('./app/new-scss/**/*.scss')
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('grid-system.min.css'))
    .pipe(gulp.dest('./app/return-files/'));
    
}