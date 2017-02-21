(function() {
"use strict";

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
  generateGridStyles(parseInt(request.body.numCols));
  generateFloatStyles(parseInt(request.body.numCols));

  addVars(request);

  compileSass();

  // archive.pipe(output);
  // archive
  // .directory(__dirname + '/app/return-files')
  // .finalize();

  response.download(path.join(__dirname + '/app/return-files/grid-system.min.css'));
});

app.use(express.static('app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

const generateGridStyles = function(numCols) {
  let gridFileContents = `.grid {
    .row {
    display: grid;
    grid-template-columns: repeat(${numCols}, 1fr);
    max-width: $content-max-width;
    margin: 0 auto;
    grid-column-gap: $gutter-width;
  }

  [class*='col-'] {
    grid-column-end: span ${numCols};
  }\n`;

  for (let i = numCols; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.col-xs-' + i + ' { grid-column-end: span ' + i + '; }\n');
  }

  for (let i = numCols - 1; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.offset-xs-' + i + ' { grid-column-start: '+ (i + 1) + '; }\n');
  }

  gridFileContents = gridFileContents.concat('@media (min-width: $small-breakpoint) {\n');

  for (let i = numCols; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.col-sm-' + i + ' { grid-column-end: span ' + i + '; }\n');
  }

  for (let i = numCols - 1; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.offset-sm-' + i + ' { grid-column-start: '+ (i + 1) + '; }\n');
  } 

  gridFileContents = gridFileContents.concat('}\n @media (min-width: $medium-breakpoint) {\n');

  for (let i = numCols; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.col-md-' + i + ' { grid-column-end: span ' + i + '; }\n');
  }

  for (let i = numCols - 1; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.offset-md-' + i + ' { grid-column-start: '+ (i + 1) + '; }\n');
  } 

  gridFileContents = gridFileContents.concat('}\n @media (min-width: $large-breakpoint) {\n');

  for (let i = numCols; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.col-lg-' + i + ' { grid-column-end: span ' + i + '; }\n');
  }

  for (let i = numCols - 1; i > 0; i--) {
    gridFileContents = gridFileContents.concat('.offset-lg-' + i + ' { grid-column-start: '+ (i + 1) + '; }\n');
  } 

  gridFileContents = gridFileContents.concat('}\n }');

  fs.writeFile('app/new-scss/_grid.scss', gridFileContents, (err) => {
    if (err) throw err;
  });
}

const generateFloatStyles = function(numCols) {
	let floatFileContents = `.no-grid {
	.container {
		max-width: $content-max-width;
		margin: 0 auto;
		overflow: hidden;
	}

	.row {
		width: calc(100% + #{$gutter-width});
		margin-left: -$half-gutter-width;
		@include clearfix;
	}

	[class*='col-'] {
		float: left;
		width: 100%;
		min-height: 1px;
		margin: 0 $half-gutter-width;
	}\n`;

	for (let i = numCols; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.col-xs-' + i + '{ \nwidth: calc((100% / 12) * ' + numCols + ' - #{$gutter-width});\n}');
	}

	for (let i = numCols - 1; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.offset-xs-' + i + ' {\nmargin-left: calc((100% / 12) * ' + i + ' + #{$half-gutter-width});\n}');
	}

	floatFileContents = floatFileContents.concat('@media (min-width: $small-breakpoint) {\n');

	for (let i = numCols; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.col-sm-' + i + '{ \nwidth: calc((100% / 12) * ' + numCols + ' - #{$gutter-width});\n}');
	}

	for (let i = numCols - 1; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.offset-sm-' + i + ' {\nmargin-left: calc((100% / 12) * ' + i + ' + #{$half-gutter-width});\n}');
	}

	floatFileContents = floatFileContents.concat('}\n@media (min-width: $medium-breakpoint) {\n');

	for (let i = numCols; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.col-md-' + i + '{ \nwidth: calc((100% / 12) * ' + numCols + ' - #{$gutter-width});\n}');
	}

	for (let i = numCols - 1; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.offset-md-' + i + ' {\nmargin-left: calc((100% / 12) * ' + i + ' + #{$half-gutter-width});\n}');
	}

	floatFileContents = floatFileContents.concat('}\n @media (min-width: $large-breakpoint) {\n');

	for (let i = numCols; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.col-lg-' + i + '{ \nwidth: calc((100% / 12) * ' + numCols + ' - #{$gutter-width});\n}');
	}

	for (let i = numCols - 1; i > 0; i--) {
		floatFileContents = floatFileContents.concat('.offset-lg-' + i + ' {\nmargin-left: calc((100% / 12) * ' + i + ' + #{$half-gutter-width});\n}');
	}

	floatFileContents = floatFileContents.concat('}\n}');

	fs.writeFile('app/new-scss/_float.scss', floatFileContents, (err) => {
	    if (err) throw err;
	});
}

const addVars = function(request) {
	const gutter = request.body.gutter,
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
})();