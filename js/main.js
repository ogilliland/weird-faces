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

  for(var i = 0; i < COLS; i++) {
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
  var width = (FACE_WIDTH_BASE + FACE_WIDTH_VAR * Math.random()) * COL_WIDTH / 400;
  var height = (FACE_HEIGHT_BASE + FACE_HEIGHT_VAR * Math.random()) * ROW_HEIGHT / 400;

  drawEllipse(x, y, width, height);
}

function drawEllipse(x, y, width, height) {
  var points = POINTS_BASE + POINTS_VAR * Math.random();
  var center = new paper.Point(x, y);

  var path = new paper.Path();
  path.closed = true;

  for(var i = 0; i < points; i++) {
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
  path.strokeColor = 'black';
  path.strokeWidth = 2;
}