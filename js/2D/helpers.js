define([], function(){
  var helpers = {};

  helpers.drawGridLines = function(cellSize, grid_thickness, grid_color){
    grid_color = grid_color || '#444';
    grid_thickness = grid_thickness || 0.1;

  	if(!window.isMobile){
 			if(paper.project.layers[1].children.length>0)
 				paper.project.layers[1].removeChildren();

 			paper.project.layers[1].activate();

 		  var num_rectangles_wide = paper.view.bounds.width / 100;
 		  var num_rectangles_tall = paper.view.bounds.height / 100;

 		  var boundingRect = paper.view.bounds;
 		  var widthPerCell, heightPerCell;
      widthPerCell = heightPerCell = cellSize;

 		    for (var i = 0; i <= num_rectangles_wide; i++) {
 		        var correctedXPos = Math.ceil(boundingRect.left/30) * 30;
 		        var xPos = correctedXPos + i * widthPerCell;
 		        var topPoint = new paper.Point(xPos, boundingRect.top);
 		        var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
 		        var aLine = new paper.Path.Line(topPoint, bottomPoint);
 		        aLine.strokeColor = grid_color;
 		        aLine.strokeWidth = grid_thickness /paper.view.zoom;
 		    }

 		    for (var i = 0; i <= num_rectangles_tall; i++) {
 		        var correctedYPos = Math.ceil(boundingRect.top/30) * 30;
 		        var yPos = correctedYPos + i * heightPerCell;
 		        var leftPoint = new paper.Point(boundingRect.left, yPos);
 		        var rightPoint = new paper.Point(boundingRect.right, yPos);
 		        var aLine = new paper.Path.Line(leftPoint, rightPoint);
 		        aLine.strokeColor = grid_color;
 		        aLine.strokeWidth = grid_thickness /paper.view.zoom;
 		    }
     }
   };

  helpers.ParseJSON = function(file){
    //	file - JSON path
    //	returns JS object
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null)
    var JSON_object = JSON.parse(request.responseText);
    return JSON_object;
  };

  return helpers;
});
