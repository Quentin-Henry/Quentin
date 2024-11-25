// Global variables
var width, height, center;
var smooth = true;
var mousePos = view.center;
var targetHeight = view.center.y / 3;
var mouseFactor = 0.3;
var maxHeightFactor = 0.4;
var isDragging = false;
var dragPoints = [];
var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 30,
};

// Ripple management
var ripples = [];

function createDragPoint(x, y) {
  return {
    x: x,
    y: y,
    strength: 20,
    life: 1,
  };
}

var dragStartTime = 0;
var dragStartPos = null;
var dragThreshold = 10;
var clickThreshold = 200;

function createRipple(x, y) {
  return {
    x: x,
    y: y,
    radius: 0,
    maxRadius: width * 0.4,
    speed: 15,
    strength: 150,
    life: 1,
  };
}

// Single wave object
var wave = {
  path: new Path(),
  color: "#D0483D",
  amplitudeScale: 0.4,
  speedScale: 0.6,
  mouseEffect: 0.15,
  rippleStrength: 10,
  hoverEffect: { horizontal: 0.5, vertical: 0.4 },
  dragEffect: 0.15,
  heightOffset: 100,
  xOffset: view.size.width * 0.72,
  points: 3,
  frequency: 7,
  amplitude: 1,
  pathHeight: view.center.y / 3,
  targetHeight: view.center.y / 3,
  phase: Math.random() * 100,
  noiseOffset: Math.random() * 1000,
  isDragging: false,
};

// Initialize wave appearance
wave.path.fillColor = wave.color;
wave.path.onClick = function (event) {
  ripples.push(createRipple(event.point.x, event.point.y));
};

function initializePath() {
  center = view.center;
  width = view.size.width;
  height = view.size.height / 2;

  wave.path.segments = [];
  wave.path.add(new Point(view.bounds.left + wave.xOffset, view.bounds.bottom));

  for (var i = 1; i < wave.points; i++) {
    var point = new Point(
      (width / wave.points) * i + wave.xOffset,
      center.y + wave.heightOffset
    );
    wave.path.add(point);
  }

  wave.path.add(
    new Point(view.bounds.right + wave.xOffset, view.bounds.bottom)
  );
}

function calculateDragEffect(x, y, dragPoint) {
  var distance = Math.abs(x - dragPoint.x);
  var dragEffect = 0;

  if (distance < 150) {
    var normalizedDistance = distance / 150;
    dragEffect =
      (1 - normalizedDistance * normalizedDistance) *
      dragPoint.strength *
      dragPoint.life *
      wave.dragEffect;
  }

  return dragEffect;
}

function calculateRippleEffect(x, y, ripple) {
  var distance = Math.sqrt(
    Math.pow(x - ripple.x, 2) + Math.pow(y - ripple.y, 2)
  );
  var rippleEffect = 0;

  if (distance < ripple.radius + 100 && distance > ripple.radius - 100) {
    var normalizedDistance = Math.abs(distance - ripple.radius) / 100;
    rippleEffect =
      Math.cos(normalizedDistance * Math.PI) *
      ripple.strength *
      ripple.life *
      wave.rippleStrength;
    rippleEffect *= 1 - Math.abs(normalizedDistance);
  }

  return rippleEffect;
}

function onFrame(event) {
  // Update ripples
  for (var i = ripples.length - 1; i >= 0; i--) {
    var ripple = ripples[i];
    ripple.radius += ripple.speed;
    ripple.life *= 0.97;
    ripple.strength *= 0.97;

    if (ripple.life < 0.01) {
      ripples.splice(i, 1);
    }
  }

  // Update drag points
  for (var i = dragPoints.length - 1; i >= 0; i--) {
    var dragPoint = dragPoints[i];
    dragPoint.life *= 0.95;

    if (dragPoint.life < 0.01) {
      dragPoints.splice(i, 1);
    }
  }

  var mouseXFactor = (mousePos.x - center.x) / width;
  var mouseYFactor = Math.max(
    -maxHeightFactor,
    Math.min(maxHeightFactor, (mousePos.y - center.y) / height)
  );

  wave.targetHeight =
    (center.y / 3) * (1 + mouseYFactor * 2 * wave.mouseEffect);
  wave.pathHeight += (wave.targetHeight - wave.pathHeight) * 0.2;

  for (var i = 1; i < wave.points; i++) {
    var xPos = (width / wave.points) * i + wave.xOffset;
    var yPos = height + wave.heightOffset;

    var sinSeed =
      event.count * wave.speedScale + i * (100 * wave.frequency) + wave.phase;

    var waveHeight =
      Math.sin(sinSeed / 250) *
      wave.pathHeight *
      wave.amplitudeScale *
      wave.amplitude;

    var secondaryHeight =
      Math.sin(sinSeed / 400 + wave.phase) *
      wave.pathHeight *
      0.3 *
      wave.amplitude;

    var distanceFromMouse = Math.abs(mousePos.x - xPos) / (width * 0.5);
    var mouseInfluence = Math.max(0, 1 - distanceFromMouse) * mouseFactor;

    var horizontalOffset =
      mouseXFactor * mouseInfluence * 50 * wave.hoverEffect.horizontal;
    var verticalOffset = mouseInfluence * 30 * wave.hoverEffect.vertical;

    var noiseValue =
      Math.sin(event.count * 0.02 + wave.noiseOffset + i * 0.3) *
      5 *
      wave.amplitude;

    var totalDragEffect = 0;
    if (wave.isDragging) {
      for (var d = 0; d < dragPoints.length; d++) {
        totalDragEffect += calculateDragEffect(xPos, yPos, dragPoints[d]);
      }
    }

    yPos +=
      waveHeight +
      secondaryHeight +
      verticalOffset +
      noiseValue -
      totalDragEffect * 0.5;

    wave.path.segments[i].point.x = xPos + horizontalOffset;
    wave.path.segments[i].point.y = yPos;
  }

  if (smooth) {
    wave.path.smooth({ type: "continuous" });
  }
}

function onMouseMove(event) {
  mousePos = {
    x: mousePos.x + (event.point.x - mousePos.x) * 0.2,
    y: mousePos.y + (event.point.y - mousePos.y) * 0.2,
  };

  if (dragStartPos) {
    var dragDistance = event.point.subtract(dragStartPos).length;

    if (dragDistance > dragThreshold) {
      isDragging = true;
      var hitResult = project.hitTest(event.point, hitOptions);
      if (hitResult && hitResult.item === wave.path) {
        wave.isDragging = true;
        dragPoints.push(createDragPoint(event.point.x, event.point.y));
      }
    }
  }
}

function onMouseDown(event) {
  dragStartTime = Date.now();
  dragStartPos = event.point;

  var hitResult = project.hitTest(event.point, hitOptions);
  wave.isDragging = hitResult && hitResult.item === wave.path;
}

function onMouseUp(event) {
  var dragDuration = Date.now() - dragStartTime;
  var dragDistance = dragStartPos
    ? event.point.subtract(dragStartPos).length
    : 0;

  if (dragDuration < clickThreshold && dragDistance < dragThreshold) {
    var hitResult = project.hitTest(dragStartPos, hitOptions);
    if (hitResult && hitResult.item === wave.path) {
      ripples.push(createRipple(dragStartPos.x, dragStartPos.y));
    }
  }

  isDragging = false;
  dragStartPos = null;
  dragStartTime = 0;
  wave.isDragging = false;
}

function onResize(event) {
  wave.xOffset = view.size.width * 0.72;
  initializePath();
}

// Initialize the path
initializePath();
