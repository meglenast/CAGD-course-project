const ITER_STEP = 0.001;
const r = 2;

const ctrPtsCol = "LightSlateGray";
const ctrPoligonCol = "LightSlateGray";

const polarPtsCol = "IndianRed";
const polarPoligonCol = "IndianRed";

const curveCol = "black";

var controlPointsData = [];
var polarPointsData = [];
var pointsAdded = false;

function point(x, y)
{
	this.x = x;
	this.y = y;
}

point.prototype.draw = function(color)
{
	gl.beginPath();
	gl.arc(this.x, this.y, r, 0, 2 * Math.PI, false);
	gl.lineWidth = 2;
	gl.fillStyle = color;
	gl.fill();
	gl.strokeStyle = color;
	gl.stroke();
}

function getCursorPosition(e)
{
	var c = canvas.getBoundingClientRect();
	var x = e.clientX - c.left;
	var y = e.clientY - c.top;

	return new point(x, y);
}

function drawControlPointsPoligon()
{
	var points = controlPointsData;
	if (points.length == 0)
	{
		alert("No contorl points data..");
		return;
	}

	gl.beginPath();
	gl.strokeStyle = ctrPoligonCol;
	gl.lineWidth = 1;

	for (var i = 0; i < points.length - 1; ++i)
	{
		gl.moveTo(points[i].x, points[i].y);
		gl.lineTo(points[i + 1].x, points[i + 1].y);
		gl.stroke();
	}
}

function drawCurve()
{
	gl.strokeStyle = curveCol;

	for (var t = 0; t < 1; t += ITER_STEP)
	{
		var point = calculateNext(t, controlPointsData);
		gl.strokeRect(point.x, point.y, 0.15, 0.15);
	}
	for (var i = 0; i < controlPointsData.length; ++i)
		controlPointsData[i].draw(ctrPtsCol);
}

function drawPolar()
{
	canDrag = false;
	calculatePolarPointsData();

	for (var i = 0; i < polarPointsData.length; ++i)
		polarPointsData[i].draw(polarPtsCol);

	gl.strokeStyle = polarPoligonCol;
	gl.lineWidth = 1;

	for (var t = 0; t < 1; t += ITER_STEP)
	{
		var point = calculateNext(t, polarPointsData);
		gl.strokeRect(point.x, point.y, 0.01, 0.01);
	}
}

function calculatePolarPointsData()
{
	if (controlPointsData.length == 1)
		return NaN;

	var points = controlPointsData.slice();
	var t = parseFloat(document.getElementById('txtT').value);

	if (isNaN(t) || t < 0 || t > 1)
	{
		alert("Invalid value for t..");
		return NaN;
	}
	for (var i = 1; i < points.length; i++)
	{
		var x = (1 - t) * points[i - 1].x + t * points[i].x;
		var y = (1 - t) * points[i - 1].y + t * points[i].y;
		
		polarPointsData.push(new point(x,y));
	}
}

function calculateNext(t, pointsData)
{
	var CasteljauArgumentsArray = new Array(pointsData.length - 1)
	CasteljauArgumentsArray.fill(t);
	return deCasteljauAlgorithm(CasteljauArgumentsArray, pointsData);
}

function deCasteljauAlgorithm(parameters, pointsData)
{
	if (!Array.isArray(parameters) || parameters.length != (pointsData.length - 1))
	{
		alert("Alert, wrong control points data..");
		return;
	}

	if (pointsData.length == 1)
		return controlPointsData[0];

	var points = pointsData.slice();
	var iteration = 0;
	
	while (points.length != 1)
	{
		var t = parameters[iteration];
		var newPoints = [];

		for (var i = 1; i < points.length; ++i)
		{
			var x = (1 - t) * points[i - 1].x + t * points[i].x;
			var y = (1 - t) * points[i - 1].y + t * points[i].y;
			newPoints.push(new point(x, y)); 

		}
		++iteration;
		points = newPoints.slice();
	}
	return points[0];
}

function cleanData()
{
	canDrag = true;
	controlPointsData = [];
	polarPointsData = [];
    document.getElementById('txtT').value = "0";
}