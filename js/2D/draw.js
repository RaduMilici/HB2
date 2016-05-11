define([], function(){
  var draw = {};
  var wall_color = '#345';
  var helper_point_size = 16;
  var active_color = '#f00';
  var helper_line_thickness = 11;
//public
  draw.draw = function(object){
  	draw.drawAllHelpers(object);
  	draw.drawOpenings(object);

  	draw.drawWalls(object);
  	draw.drawAllHVACs(object);
  	draw.drawAllDimensions(object);
  	//draw.drawSideRoofScene(object);
  	draw.drawAllRoofs(object);
  	draw.drawAllSlabs(object);

  	draw.cleanOrphanPoints(object);
  	view.draw();
  }

  draw.drawAllRoofs = function(object){
  	if(object.roofs){
  		//draw.drawSideRoofScene(object)
  		for (var i = 0, l = object.roofs.length; i<l; i++) {
  			draw.drawRoof(object, object.roofs[i]);
  		}
  	}
  }

  draw.drawRoof = function(object, current_roof){
  	paper.project.layers[9].activate();

  	if(current_roof._roof2D)
  		current_roof._roof2D.remove();


  	current_roof._roof2D = new Path();
  	current_roof._roof2D.strokeColor = roof_color;
  	current_roof._roof2D.dashArray = [10, 12];
  	current_roof._roof2D.strokeWidth = 1;
  	current_roof._roof2D.closed = true;
  	current_roof._roof2D._connect = current_roof;
  	for (var j = 0, m = current_roof.points.length; j<m; j++) {
  		current_roof._roof2D.add(new Point(current_roof.points[j].x, current_roof.points[j].y));
  	}

  	/*if(current_roof.type === 'pitched')
  		this.drawRoofFromSide(object, current_roof);*/

  	current_roof._needsUpdate = true;
  	current_roof._roof2D.bringToFront();
  	paper.view.draw()
  }

  draw.drawAllDimensions = function(object){
  	if(!window.isMobile){
  		if(window.allDimensions){
  			if(paper.project.layers[7].children.length>0)
  				paper.project.layers[7].removeChildren();

  			var minimu_distance_to_measure = 50;
  			for(var i=0,l=object.walls.length;i<l;i++){
  				this.drawDimension(object, object.walls[i])
  			}
  	   }
  	}
  }

  draw.drawAllHVACs = function(object){
  	if(paper.project.layers[4].children.length>0)
  		paper.project.layers[4].removeChildren();

  	for(var i=0;i<object.HVAC.length;i++){
  		this.drawHVAC(object,object.HVAC[i])
  	}
  	view.draw();
  }

  draw.drawOpenings = function(object){
  	if(paper.project.layers[6].children.length>0)
  		paper.project.layers[6].removeChildren();

  	for(var i=0;i<object.doors.length;i++){
  		this.drawDoor(object, object.doors[i]);
  	}
  	for(var j=0;j<object.windows.length;j++){
  		this.drawWindow(object, object.windows[j]);
  	}
  	view.draw();
  }

  draw.drawWalls = function(object, layer){
  	if(paper.project.layers[3].children.length>0)
  		paper.project.layers[3].removeChildren();

  	for(var i=0,l=object.walls.length;i<l;i++){
  		draw.drawWall2D(object, object.walls[i], layer)
  	}
  }

  draw.drawWall2D = function(object, current_wall, layer){
  	var wall_points = [];
  	var point_a = object.points[current_wall.a];
  	//	Second Point
  	var point_b = object.points[current_wall.b];
  	//	Calculate Offset points of initial line based on wall thichness
  	var points_ab = getOffsetPoints(point_a,point_b,current_wall.t);
  	//	Check vicinity of point A
  	var neighbour_a = getWall(object, current_wall.a, current_wall.b);
  	var neighbour_b = getWall(object, current_wall.b, current_wall.a);
  	var inside = calculatePaths(wall_points, neighbour_a, point_a, points_ab, 'A', false);
  	var outside = calculatePaths(wall_points, neighbour_b, point_b, points_ab,'B', false);
  	drawPathFromPoints(wall_points, current_wall.type, false, layer, current_wall);
  	current_wall._needsUpdate = true;
  };

  draw.drawAllHelpers = function(object){
  	if(paper.project.layers[5].children.length>0)
  		paper.project.layers[5].removeChildren();
  	for(var i=0;i<object.points.length;i++){
  		this.drawPointHelper(object,object.points[i])
  	}
  	for(var j=0;j<object.walls.length;j++){
  		this.drawWallHelper(object, object.walls[j])
  	}
  }

  draw.drawPointHelper = function(object, current_point){
  	drawPointHelper2(object, current_point);
  }

  draw.drawWallHelper = function(object, current_wall, layer){
  	drawWallHelper2(object, current_wall, layer);
  }
//private
  function drawPathFromPoints(points_array, type, debug, layer,current_wall){
  	if(layer)
  		layer.activate();
  	else
  		paper.project.layers[3].activate();

  		if(current_wall._wall2D)
  			current_wall._wall2D.remove();

  		current_wall._wall2D = new Path();
  		current_wall._wall2D.closed= true;
  		current_wall._wall2D.strokeWidth = 1;
  		if(current_wall.partyWall){
  			current_wall._wall2D.strokeColor = party_wall_color;
  			current_wall._wall2D.fillColor = party_wall_color;
  		}else{
  			current_wall._wall2D.strokeColor = wall_color;
  			current_wall._wall2D.fillColor = wall_color;
  		}
  		if(debug) current_wall._wall2D.selected = true;
  	for (var i = points_array.length - 1; i >= 0; i--) {
  		current_wall._wall2D.add(new Point(Number(points_array[i].x.toFixed(2)),Number(points_array[i].y.toFixed(2))));
  	}
  	if(layer) current_wall._wall2D.opacity = 0.1;
  		current_wall._wall2D._connect = current_wall;

  	arrangePath(current_wall._wall2D);
  }

  function getOffsetPoints(p1,p2,thickness){
  	var points = [];
  	var vec = {x: p2.x - p1.x ,y: p2.y - p1.y };
  		vec.Length = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
  	var vec_x = vec.x/vec.Length;
  	var vec_y = vec.y/vec.Length;
  	var perp = {x: - vec_y, y: vec_x};
  	var offset = thickness/2;

  	var p1_inisde = {x: p1.x - (offset * perp.x), y: p1.y - (offset * perp.y)};
  	var p2_inisde = {x: p2.x - (offset * perp.x), y: p2.y - (offset * perp.y)};

  	var p2_outside = {x: p2.x + (offset * perp.x), y: p2.y + (offset * perp.y)};
  	var p1_outside = {x: p1.x + (offset * perp.x), y: p1.y + (offset * perp.y)};

  	points.push(p1_inisde,p2_inisde,p2_outside,p1_outside);
  	return points
  }

  function getWall(obj, connect, exception){
  	var posibilities = [];
  	for(var i=0;i<obj.walls.length;i++){
  		var details = {};
  		if(obj.walls[i].a === connect && obj.walls[i].b != exception){
  			details.point = obj.points[obj.walls[i].b];
  			details.wall = obj.walls[i];
  			posibilities.push(details)
  		}
  		if(obj.walls[i].b === connect && obj.walls[i].a != exception){
  			details.point = obj.points[obj.walls[i].a];
  			details.wall = obj.walls[i];
  			posibilities.push(details)
  		}
  	}
  	return posibilities
  }

  function calculatePaths(wall_points, neighbours, point, corners, letter, debug){
  	if(letter === 'A'){
  		if(!neighbours.length){	//	No neighbour - push original points
  			if(debug) console.log(letter + ': Dead End');
  			wall_points.push(corners[3],corners[0]);
  		}else if(neighbours.length === 1){		//	One neighbour
  			if(debug) console.log(letter + ': Single Neighbour');
  			//	Calculate Offset points of neighbour line based on wall thichness
  			var points_na = getOffsetPoints(point,neighbours[0].point,neighbours[0].wall.t);
  			//	Check for intersections between initial line and neighbour line
  			var points = checkIntersectFor2Lines(corners, points_na, point,debug);
  				wall_points.push(points[1],points[0]);
  		}else{	//	Multiple neighbours
  			if(debug) console.log(letter + ': Multiple Neighbours');
  			var points = checkIntersectForMultipleLines(corners, neighbours, point,debug);
  			wall_points.push(points[2],points[1],points[0]);
  		}
  	}else if(letter === 'B'){
  		if(!neighbours.length){	//	No neighbour - push original points
  			if(debug) console.log(letter + ': Dead End');
  			wall_points.push(corners[1],corners[2]);
  		}else if(neighbours.length === 1){		//	One neighbour
  			if(debug) console.log(letter + ': Single Neighbour');
  			//	Calculate Offset points of neighbour line based on wall thichness
  			var points_na = getOffsetPoints(point,neighbours[0].point,neighbours[0].wall.t);
  			//	Check for intersections between initial line and neighbour line
  			var points = checkIntersectFor2Lines(corners, points_na, point,debug);
  				wall_points.push(points[0],points[1]);
  		}else{	//	Multiple neighbours
  			if(debug) console.log(letter + ': Multiple Neighbours');
  			var points = checkIntersectForMultipleLines(corners, neighbours, point,debug);
  			wall_points.push(points[0],points[1],points[2]);
  		}
  	}
  	return wall_points
  }

  function checkIntersectFor2Lines(original_points, neighbour_points, point,debug){
  	var original_inside = makePaperPathFrom2Points(original_points[0],original_points[1],debug);

  	var original_outside = makePaperPathFrom2Points(original_points[2],original_points[3],debug);

  	var neighbour_inside = makePaperPathFrom2Points(neighbour_points[0],neighbour_points[1],debug);
  	var neighbour_outside = makePaperPathFrom2Points(neighbour_points[2],neighbour_points[3],debug);
  	var point1, point2;

  	if(original_inside.intersects(neighbour_inside)){
  		point1 = original_inside.getIntersections(neighbour_inside)[0].point;
  		original_outside.scale(2);
  		neighbour_outside.scale(2);
  		if(original_outside.intersects(neighbour_outside))
  			point2 = original_outside.getIntersections(neighbour_outside)[0].point;
  	}else if(original_inside.intersects(neighbour_outside)){
  		point1 = original_inside.getIntersections(neighbour_outside)[0].point;
  		original_outside.scale(2);
  		neighbour_inside.scale(2);
  		if(original_outside.intersects(neighbour_inside))
  			point2 = original_outside.getIntersections(neighbour_inside)[0].point;
  	}else if(original_outside.intersects(neighbour_inside)){
  		point1 = original_outside.getIntersections(neighbour_inside)[0].point;
  		original_inside.scale(2);
  		neighbour_outside.scale(2);
  		if(original_inside.intersects(neighbour_outside))
  			point2 = original_inside.getIntersections(neighbour_outside)[0].point;
  	}else if(original_outside.intersects(neighbour_outside)){
  		point1 = original_outside.getIntersections(neighbour_outside)[0].point;
  		original_inside.scale(2);
  		neighbour_inside.scale(2);
  		if(original_inside.intersects(neighbour_inside))
  			point2 = original_inside.getIntersections(neighbour_inside)[0].point;
  	}else{	//	If there is no line intersections
  		if(distanceBetween2Points(point.x, point.y,original_points[2].x,original_points[2].y) < distanceBetween2Points(point.x, point.y,original_points[3].x,original_points[3].y)){
  			point2 = (original_points[2]);
  		}else{
  			point2 = (original_points[3]);
  		}
  		if(distanceBetween2Points(point.x, point.y,original_points[1].x,original_points[1].y) < distanceBetween2Points(point.x, point.y,original_points[0].x,original_points[0].y)){
  			point1 = (original_points[1]);
  		}else{
  			point1 = (original_points[0]);
  		}
  	}

  	if(!point1){
  		if(distanceBetween2Points(point.x, point.y,original_points[1].x,original_points[1].y) < distanceBetween2Points(point.x, point.y,original_points[0].x,original_points[0].y)){
  			point1 = (original_points[1]);
  		}else{
  			point1 = (original_points[0]);
  		}
  	}

  	if(!point2){
  		if(distanceBetween2Points(point.x, point.y,original_points[2].x,original_points[2].y) < distanceBetween2Points(point.x, point.y,original_points[3].x,original_points[3].y)){
  			point2 = (original_points[2]);
  		}else{
  			point2 = (original_points[3]);
  		}
  	}

  	return [point1,point2]
  }

  function makePaperPathFrom2Points(p1,p2,draw,scale){
  	var path = new Path();
  		path.add(new Point(p1.x,p1.y));
  		path.add(new Point(p2.x,p2.y));
  		if(draw) path.selected = true;
  		if(scale) path.scale(scale)
  	return path
  }

  function arrangePath(path){
  	if(path.getIntersections(path).length){
  		var old_points = [];
  		var len = path.segments.length;
  		//	Calculate center point
  		var center = {x : 0, y : 0};
  		for(var i=0;i<len;i++){
  			center.x += path.segments[i].point.x;
  			center.y += path.segments[i].point.y;
  			var old_point = {x: angular.copy(path.segments[i].point.x),y: angular.copy(path.segments[i].point.y)}
  			old_points.push(old_point)
  		}
  		center.x = center.x / (path.segments.length);
  		center.y = center.y / (path.segments.length);

  		//	Calculate vectors
  		var vectors = [];
  		for(var i=0;i<len;i++){
  			var vector = {x : 0, y : 0};
  				vector.x = center.x - path.segments[i].point.x;
  				vector.y = center.y - path.segments[i].point.y;
  			var length = Math.sqrt((path.segments[i].point.x - vector.x) * (path.segments[i].point.x - vector.x) + (path.segments[i].point.y - vector.y) * (path.segments[i].point.y - vector.y));
  			vectors.push(vector)
  		}

  		//	Calculate angles
  		var angles = [];
  		for(var i=0;i<len;i++){
  			angles.push(Math.atan2(vectors[i].y,vectors[i].x))
  		}

  		function sortWithIndeces(toSort) {
  		  for (var i = 0; i < toSort.length; i++) {
  		    toSort[i] = [toSort[i], i];
  		  }
  		  toSort.sort(function(left, right) {
  		    return left[0] < right[0] ? -1 : 1;
  		  });
  		  toSort.sortIndices = [];
  		  for (var j = 0; j < toSort.length; j++) {
  		    toSort.sortIndices.push(toSort[j][1]);
  		    toSort[j] = toSort[j][0];
  		  }
  		  return toSort;
  		}

  		var new_order = sortWithIndeces(angles).sortIndices;

  		//	Write them back
  		for(var i=0;i<len;i++){
  			path.segments[i].point.x = old_points[new_order[i]].x;
  			path.segments[i].point.y = old_points[new_order[i]].y;
  		}
  	}
  }

  function drawPointHelper2(object, current_point){
  	paper.project.layers[5].activate();
  	current_point._helper = new Path.Circle(new Point(current_point.x, current_point.y),helper_point_size);
  	current_point._helper._connect = current_point;
  	current_point._helper.style = {fillColor: active_color};
  	current_point._helper.opacity = 0;
  	current_point._helper.bringToFront();
  }

  function drawWallHelper2(object, current_wall, layer){

  	if(layer)
  		layer.activate();
  	else
  		paper.project.layers[5].activate();

  	var from = new Point(object.points[current_wall.a].x, object.points[current_wall.a].y);
  	var to = new Point(object.points[current_wall.b].x, object.points[current_wall.b].y);
  	current_wall._helper = new Path.Line(from, to);
  	current_wall._helper._connect = current_wall;
  	current_wall._helper.segments[0].connect = current_wall.a;
  	current_wall._helper.segments[1].connect = current_wall.b;
  	current_wall._helper.style = {strokeColor: active_color,strokeWidth: helper_line_thickness};
  	current_wall._helper.opacity = 0;
  	current_wall._helper.onDoubleClick = function(event) {

  		//	Store last wall properties
  		var last_index_a = current_wall.a;
  		var last_index_b = current_wall.b;
  		var last_tichness = current_wall.t;
  		var last_type = current_wall.type;
  		var last_party = current_wall.partyWall;
  		var last_uid = current_wall.uid;
  		var last_height = current_wall.h;
  		var last_material = current_wall.material;



  		var closest_point = current_wall._helper.getNearestPoint(event.point);
  		var new_point = {x: closest_point.x, y: closest_point.y};

  		object.points.push(new_point);
  		var index_of_last_point = object.points.length - 1;


  		var wall_left = angular.copy(default_wall);
  			wall_left.a = last_index_a;
  			wall_left.b = index_of_last_point;
  			wall_left.t = last_tichness;
  			wall_left.type = last_type;
  			wall_left.partyWall = last_party;
  			wall_left.uid = parseInt('9' + last_index_a + '999' + index_of_last_point);
  			wall_left.h = last_height;
  			wall_left.material = last_material;

  		var wall_right = angular.copy(default_wall);
  			wall_right.a = index_of_last_point;
  			wall_right.b = last_index_b;
  			wall_right.t = last_tichness;
  			wall_right.type = last_type;
  			wall_right.partyWall = last_party;
  			wall_right.uid = parseInt('9' + index_of_last_point + '999' + last_index_b);
  			wall_right.h = last_height;
  			wall_right.material = last_material;


  		removeLocalWall(object, current_wall);
  		object.walls.push(wall_left);
  		drawWallHelper2(object, object.walls[object.walls.length-1], false);

  		object.walls.push(wall_right);
  		drawWallHelper2(object, object.walls[object.walls.length-1], false);

  		drawPointHelper2(object, object.points[index_of_last_point]);

  		drawThemWalls(object);

  		drawAllDimensions2(object);


  		/*
  		//Reposition doors and windows
  		for(var i=0,l=object.windows.length;i<l;i++){
  			if(object.windows[i])
  				console.log(object.windows[i])
  		}*/
  	}
  }

  return draw;
});
