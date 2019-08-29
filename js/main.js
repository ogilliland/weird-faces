var canvas, paper;

var WIDTH = 1000;
var HEIGHT = 1000;

var ROWS = 6;
var COLS = 8;

var ROW_HEIGHT = HEIGHT / ROWS;
var COL_WIDTH = WIDTH / COLS;

var CONFIG = {
  face: {
    widthBase: 60, // percent
    widthVar: 15, // percent
    heightBase: 50, // percent
    heightVar: 25 // percent
  },
  ellipse: {
    pointsBase: 8,
    pointsVar: 2,
    roughness: 15 // percent
  },
  line: {
    pointsBase: 4,
    pointsVar: 2,
    roughness: 15, // percent
    strokeWidth: 1 // px
  }
};

var FACES = [];

function init() {
  canvas = document.getElementById("canvas");
  
  paper.setup(canvas);
  resize();

  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      // drawFace((i + 0.5) * COL_WIDTH, (j + 0.5) * ROW_HEIGHT);
      FACES.push(new Face((i + 0.5) * COL_WIDTH, (j + 0.5) * ROW_HEIGHT));
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

/* === object definitions === */
function Face(x, y) {
  this.x = x;
  this.y = y;
  this.width = (CONFIG.face.widthBase + CONFIG.face.widthVar * Math.random()) * COL_WIDTH / 400;
  this.height = (CONFIG.face.heightBase + CONFIG.face.heightVar * Math.random()) * ROW_HEIGHT / 400;
  
  this.group = new paper.Group();
  this.features = {};
  this.generate();
  this.draw();
}

Face.prototype.generate = function() {
  this.generateEyes();
  this.generateNose();
  this.generateMouth();
  this.generateEars();
}

Face.prototype.draw = function() {
  this.group.removeChildren(); // clear before re-drawing
  this.drawEars();
  this.drawHead(); // head covers ears
  this.drawNose();
  this.drawEyes(); // eyes cover nose
  this.drawMouth();
}

Face.prototype.drawHead = function() {
  this.group.addChild(
    drawEllipse(this.x, this.y, this.width, this.height, "white")
  );
}

Face.prototype.generateEyes = function() {
  this.features.eyes = {};
  this.features.eyes.yPos = this.y - Math.random() * this.height;
  this.features.eyes.size = this.width / 8 + Math.random() * this.width / 8;
  this.features.eyes.spacing = this.width + Math.random() * this.width;
  this.features.eyes.skew = Math.random() * this.height / 4 - this.height / 8;
  this.features.eyes.pupilSize = 0.25 + Math.random() * 0.5; // percent as decimal
}

Face.prototype.drawEyes = function() {
  // outlines
  this.group.addChild(
      drawEllipse(
      this.x - this.features.eyes.spacing / 2,
      this.features.eyes.yPos + this.features.eyes.skew,
      this.features.eyes.size,
      this.features.eyes.size,
      "white"
    )
  );
  this.group.addChild(
    drawEllipse(
      this.x + this.features.eyes.spacing / 2,
      this.features.eyes.yPos - this.features.eyes.skew,
      this.features.eyes.size,
      this.features.eyes.size,
      "white"
    )
  );

  // pupils
  this.group.addChild(
    drawEllipse(
      this.x - this.features.eyes.spacing / 2,
      this.features.eyes.yPos + this.features.eyes.skew,
      this.features.eyes.size * this.features.eyes.pupilSize,
      this.features.eyes.size * this.features.eyes.pupilSize,
      "black"
    )
  );
  this.group.addChild(
    drawEllipse(
      this.x + this.features.eyes.spacing / 2,
      this.features.eyes.yPos - this.features.eyes.skew,
      this.features.eyes.size * this.features.eyes.pupilSize,
      this.features.eyes.size * this.features.eyes.pupilSize,
      "black"
    )
  );
}

Face.prototype.generateNose = function() {
  this.features.nose = {};
  this.features.nose.length = Math.random() * 2 + 2;
  this.features.nose.skew = Math.random() * this.width / 3 - this.width / 6;
  this.features.nose.base = Math.floor(Math.random() * 4); // boolean // TO DO - rename to nose.type
  this.features.nose.spacing = this.height / this.features.nose.length * (0.5 + Math.random() * 0.5); // length of each line segment
}

Face.prototype.drawNose = function() {
  var nose = new paper.Path();

  for (var i = 0; i < this.features.nose.length; i++) {
    var dx = this.x + this.features.nose.skew * 2 * (1 + Math.random() * CONFIG.ellipse.roughness / 100 - CONFIG.ellipse.roughness / 200);
    var dy = this.features.eyes.yPos + i * this.features.nose.spacing;

    var delta = new paper.Point(dx, dy);
    nose.add(delta);
  }

  if(this.features.nose.base > 0) {
    var dx = this.x + -1 * this.features.nose.skew;
    var dy = this.features.eyes.yPos + this.features.nose.length * this.features.nose.spacing;

    var delta = new paper.Point(dx, dy);
    nose.add(delta);
  }

  nose.smooth();
  nose.strokeColor = "black";
  nose.strokeWidth = CONFIG.line.strokeWidth;

  this.group.addChild(nose);
}

Face.prototype.generateMouth = function() {
  this.features.mouth = {};
  this.features.mouth.yPos = this.y + this.height;
  this.features.mouth.width = this.width / 8 + Math.random() * this.width / 4;
  this.features.mouth.height = this.features.mouth.width / 8 + Math.random() * this.features.mouth.width / 8;
}

Face.prototype.drawMouth = function() {
  this.group.addChild(
    drawEllipse(
      this.x - this.features.mouth.width / 2,
      this.features.mouth.yPos,
      this.features.mouth.width,
      this.features.mouth.height,
      "white"
    )
  );
  this.group.addChild(
    drawLine(
      this.x - this.features.mouth.width,
      this.features.mouth.yPos,
      this.x + this.features.mouth.width,
      this.features.mouth.yPos
    )
  );
}

Face.prototype.generateEars = function() {
  this.features.ears = {};
  this.features.ears.yPos = this.y - Math.random() * this.height / 4;
  this.features.ears.height = (CONFIG.face.heightBase + CONFIG.face.heightVar * Math.random()) * ROW_HEIGHT / 1200;
  this.features.ears.width = (CONFIG.face.widthBase + CONFIG.face.widthVar * Math.random()) * COL_WIDTH / 1400;
  this.features.ears.spacing = this.width + this.features.ears.width * 2;
}

Face.prototype.drawEars = function() {
  // outlines
  this.group.addChild(
    drawEllipse(
      this.x - this.features.ears.spacing,
      this.features.ears.yPos,
      this.features.ears.width,
      this.features.ears.height,
      "white"
    )
  );
  this.group.addChild(
    drawEllipse(
      this.x + this.features.ears.spacing,
      this.features.ears.yPos,
      this.features.ears.width,
      this.features.ears.height,
      "white"
    )
  );

  // detail
  this.group.addChild(
    drawEllipse(
      this.x - this.features.ears.spacing,
      this.features.ears.yPos,
      this.features.ears.width / 2,
      this.features.ears.height / 2
    )
  );
  this.group.addChild(
    drawEllipse(
      this.x + this.features.ears.spacing,
      this.features.ears.yPos,
      this.features.ears.width / 2,
      this.features.ears.height / 2
    )
  );
}

/* === utility functions === */
function drawEllipse(x, y, width, height, fill) {
  var points = CONFIG.ellipse.pointsBase + CONFIG.ellipse.pointsVar * Math.random();
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
      length: radius * (1 + Math.random() * CONFIG.ellipse.roughness / 100 - CONFIG.ellipse.roughness / 200),
      angle: angle * 180 / Math.PI
    });

    path.add(delta.add(center));
  }

  path.smooth();
  path.strokeColor = "black";
  path.strokeWidth = CONFIG.line.strokeWidth;

  if (fill !== undefined) {
    path.fillColor = fill;
  }

  return path;
}

function drawLine(x1, y1, x2, y2) {
  var points = CONFIG.line.pointsBase + CONFIG.line.pointsVar * Math.random();

  var path = new paper.Path();

  for (var i = 0; i < points; i++) {
    var dx = (x1 + (x2 - x1) * i / points) * (1 + Math.random() * CONFIG.line.roughness / 5000 - CONFIG.line.roughness / 10000); // TO DO - fix these ratios
    var dy = (y1 + (y2 - y1) * i / points) * (1 + Math.random() * CONFIG.line.roughness / 5000 - CONFIG.line.roughness / 10000); // ***

    var delta = new paper.Point(dx, dy);
    path.add(delta);
  }

  path.smooth();
  path.strokeColor = "black";
  path.strokeWidth = CONFIG.line.strokeWidth;

  return path;
}