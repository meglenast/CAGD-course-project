var addOn = false;
var canDrag = true;
var moveCoordinates = -1;

function start() 
{
	canvas = document.getElementById("canvas");
	
	canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
	canvas.addEventListener('webglcontextrestored',function(){init();},false);
	
	init();
}

function init()
{
	gl = canvas.getContext("2d");
	canvas.addEventListener("click", eventHandlerOnMouseClick);
	canvas.addEventListener("mousedown", eventHandlerMouseDown);
	canvas.addEventListener("mousemove", eventHandlerMouseMove);
    canvas.addEventListener("mouseup", eventHandlerMouseUp);
}

function eventHandlerMouseDown(event)
{
	if (addOn || !canDrag)
		return;
	
	var point = getCursorPosition(event);

	for (var i = 0; i < controlPointsData.length; ++i)
	{
		if (Math.pow(point.x - controlPointsData[i].x, 2) 
	      + Math.pow(point.y - controlPointsData[i].y, 2) <= Math.pow(r, 2)+ 1)
		{
			moveCoordinates = i;
			break;
		}
	}
}

function eventHandlerMouseUp(event)
{
	moveCoordinates = -1;
}

function eventHandlerMouseMove(event)
{
	if (moveCoordinates == -1)
		return;

	var point = getCursorPosition(event);
	controlPointsData[moveCoordinates] = point;
	
	gl.clearRect(0, 0, canvas.width, canvas.height);
	drawCurve();
	drawControlPointsPoligon();
}

function eventHandlerOnMouseClick(event)
{
	var point = getCursorPosition(event);
	
	if (addingControlPoints)
	{
		controlPointsData.push(point);
		point.draw(ctrPtsCol);
	}
}

function btnAddControlPoints_OnClick()
{
	setControlPointsAddingStateActive(true);

	var btnCurve = document.getElementById("drawCurveBtn");
	btnCurve.disabled = false;
	var btnPolar = document.getElementById("drawPolarBtn");
	btnPolar.disabled = false;
}

function btnDrawCurve_OnClick()
{
	if (controlPointsData.length == 0)
		return;
	
	setControlPointsAddingStateActive(false);
	drawCurve();
	drawControlPointsPoligon();

	var button = document.getElementById("drawCurveBtn");
	button.disabled = true;
	button = document.getElementById("addBtn");
	button.disabled = true;
}

function btnDrawPolar_OnClick()
{
	if (controlPointsData.length == 0)
		return;
	
	drawPolar();

	var button = document.getElementById("drawPolarBtn");
	button.disabled = true;
}

function btnClear_OnClick()
{
	gl.clearRect(0, 0, canvas.width, canvas.height);
	cleanData();

	var button = document.getElementById("addBtn");
	button.disabled = false;
}

function setControlPointsAddingStateActive(state)
{
	addingControlPoints = state;
	
	if (addingControlPoints)
		cleanData();

    var button = document.getElementById("addBtn");
	
	if (addingControlPoints)
	{
        button.innerHTML = "Stop adding control points";
		button.disabled = true;
	}
    else
    {
		button.innerHTML = "Start adding control points";
		button.disabled = false;
	}
}