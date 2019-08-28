var canvas, paper;

var WIDTH = 1000;
var HEIGHT = 1000;

var ROWS = 5;
var COLS = 5;

var ROW_HEIGHT = HEIGHT / ROWS;
var COL_WIDTH = WIDTH / COLS;

var FACE_WIDTH_BASE = 50; // percent
var FACE_WIDTH_VAR = 25; // percent
var FACE_HEIGHT_BASE = 50; // percent
var FACE_HEIGHT_VAR = 25; // percent

var POINTS_BASE = 8;
var POINTS_VAR = 2;

var ROUGHNESS = 25; // percent

function init() {
  canvas = document.getElementById("canvas");
	
  paper.setup(canvas);
  resize();

  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      drawFace((i + 0.5) * COL_WIDTH, (j + 0.5) * ROW_HEIGHT);
    }
  }
  
  paper.view.onResize = function(event) {
    resize();
  };
}

window.onload = function() {
  init();
}

function resize() {
  paper.view.setViewSize(new paper.Size(WIDTH, HEIGHT));
}

function drawFace(x, y) {
  /* === properties === */
  // face
  var width = (FACE_WIDTH_BASE + FACE_WIDTH_VAR * Math.random()) * COL_WIDTH / 400;
  var height = (FACE_HEIGHT_BASE + FACE_HEIGHT_VAR * Math.random()) * ROW_HEIGHT / 400;

  // ears
  var earLine = y - Math.random() * height / 4;
  var earHeight = (FACE_HEIGHT_BASE + FACE_HEIGHT_VAR * Math.random()) * ROW_HEIGHT / 1200;
  var earWidth = (FACE_WIDTH_BASE + FACE_WIDTH_VAR * Math.random()) * COL_WIDTH / 1400;
  var earSpacing = width + earWidth * 2;

  // eyes
  var eyeLine = y - Math.random() * height;
  var eyeSize = width / 8 + Math.random() * width / 8;
  var eyeSpacing = width + Math.random() * width;
  var eyeSkew = Math.random() * height / 4 - height / 8;
  var pupilSize = 0.25 + Math.random() * 0.5; // percent as decimal

  // nose
  var noseLength = Math.random() * 4 + 2;
  var noseSkew = Math.random() * width / 2 - width / 4;
  var noseBase = Math.floor(Math.random() * 4); // boolean
  var noseSpacing = height / 4;

  // mouth
  var mouthWidth = width / 8 + Math.random() * width / 4;
  var mouthHeight = mouthWidth / 8 + Math.random() * mouthWidth / 8;
  var mouthLine = y + height;

  /* === draw === */
  // ears
  drawEars(earLine, earSpacing, earWidth, earHeight, x, y);

  // face outline
  drawEllipse(x, y, width, height, "white");

  // features
  drawNose(eyeLine, noseLength, noseSkew, noseBase, noseSpacing, x, y);
  drawEyes(eyeLine, eyeSize, eyeSpacing, eyeSkew, pupilSize, x, y);
  drawMouth(mouthLine, mouthWidth, mouthHeight, x, y);
}

function drawEyes(eyeLine, eyeSize, eyeSpacing, eyeSkew, pupilSize, x, y) {
  // outlines
  drawEllipse(x - eyeSpacing / 2, eyeLine + eyeSkew, eyeSize, eyeSize, "white");
  drawEllipse(x + eyeSpacing / 2, eyeLine - eyeSkew, eyeSize, eyeSize, "white");

  // pupils
  drawEllipse(x - eyeSpacing / 2, eyeLine + eyeSkew, eyeSize * pupilSize, eyeSize * pupilSize, "black");
  drawEllipse(x + eyeSpacing / 2, eyeLine - eyeSkew, eyeSize * pupilSize, eyeSize * pupilSize, "black");
}

function drawNose(eyeLine, noseLength, noseSkew, noseBase, noseSpacing, x, y) {
  var nose = new paper.Path();

  for (var i = 0; i < noseLength; i++) {
    var dx = x + noseSkew * 2 * (1 + Math.random() * ROUGHNESS / 100 - ROUGHNESS / 200);
    var dy = eyeLine + i * noseSpacing;

    var delta = new paper.Point(dx, dy);
    nose.add(delta);
  }

  if(noseBase > 0) {
    var dx = x + -1 * noseSkew;
    var dy = eyeLine + noseLength * noseSpacing;

    var delta = new paper.Point(dx, dy);
    nose.add(delta);
  }

  nose.smooth();
  nose.strokeColor = "black";
  nose.strokeWidth = 2;
}

function drawEars(earLine, earSpacing, earWidth, earHeight, x, y) {
  // outlines
  drawEllipse(x - earSpacing, earLine, earWidth, earHeight, "white");
  drawEllipse(x + earSpacing, earLine, earWidth, earHeight, "white");
}

function drawMouth(mouthLine, mouthWidth, mouthHeight, x, y) {
  drawEllipse(x - mouthWidth / 2, mouthLine, mouthWidth, mouthHeight, "white");
  drawLine(x - mouthWidth, mouthLine, x + mouthWidth, mouthLine);
}

function drawEllipse(x, y, width, height, fill) {
  var points = POINTS_BASE + POINTS_VAR * Math.random();
  var center = new paper.Point(x, y);

  var path = new paper.Path();
  path.closed = true;

  for (var i = 0; i < points; i++) {
    var angle = i * 2 * Math.PI / (points + 0.5);
    var radius = height * width / Math.sqrt(
      Math.pow(0.5 * height * Math.cos(angle), 2) +
      Math.pow(0.5 * width * Math.sin(angle), 2)
    );

    var delta = new paper.Point({
      length: radius * (1 + Math.random() * ROUGHNESS / 100 - ROUGHNESS / 200),
      angle: angle * 180 / Math.PI
    });

    path.add(delta.add(center));
  }

  path.smooth();
  path.strokeColor = "black";
  path.strokeWidth = 2;

  if (fill !== undefined) {
    path.fillColor = fill;
  }
}

function drawLine(x1, y1, x2, y2) {
  var points = POINTS_BASE + POINTS_VAR * Math.random();

  var path = new paper.Path();

  for (var i = 0; i < points; i++) {
    var dx = (x1 + (x2 - x1) * i / points) * (1 + Math.random() * ROUGHNESS / 5000 - ROUGHNESS / 10000);
    var dy = (y1 + (y2 - y1) * i / points) * (1 + Math.random() * ROUGHNESS / 5000 - ROUGHNESS / 10000);

    var delta = new paper.Point(dx, dy);
    path.add(delta);
  }

  path.smooth();
  path.strokeColor = "black";
  path.strokeWidth = 2;
}