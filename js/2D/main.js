define(["paper", "helpers2D", "events2D", "draw2D"],
function(paper, helpers2D, events2D, draw2D)
{
  var main = {};
  var tool;
  var paperZoom;
  var active_color = '#000000';
//grid
  var grid_size = 100;
  var grid_thickness = 0.1;
  var grid_color = '#444';
//house
  var house, curent_floor, object;
  var floor = 'Storey_0';
  var floor_names = [];
  var default_house = helpers2D.ParseJSON('JSON/default-house.json');

  main.Start_Paper = function()
  {
    paper.install(window);
    window.openSettings = false;
    paper.setup('paperCanvas');
    view.setCenter(0, 0);
    view.onResize = function()
    {
        helpers.drawGridLines(grid_size);
        view.setCenter(0, 0);
    };

    tool = new Tool();
    var layer_0 = new Layer();//    0    Ghost
    var layer_1 = new Layer();//    1    Grid
    var layer_2 = new Layer();//    2    Slabs
    var layer_3 = new Layer();//    3    Walls
    var layer_4 = new Layer();//    4    Objects
    var layer_5 = new Layer();//    5    Helpers
    var layer_6 = new Layer();//    6    Doors and Windows
    var layer_7 = new Layer();//    7    Dimensions
    var layer_8 = new Layer();//    8    Snaps
    var layer_9 = new Layer();//    9    Roof
    paperZoom = paper.view.zoom = 0.4;
    layer_1.selectedColor = layer_2.selectedColor = layer_3.selectedColor =
    layer_4.selectedColor = layer_5.selectedColor = layer_6.selectedColor =
    layer_7.selectedColor = layer_8.selectedColor = layer_9.selectedColor = active_color;
    helpers2D.drawGridLines(grid_size, grid_thickness, grid_color);
    main.Load_House(default_house);
  };

  main.Load_House = function(incoming_house)
  {
    house = incoming_house;
    clearPaper();
    main.displayFloor(floor);
  }

  main.displayFloor = function (floor) {
    window.default_method = true;
    window.roof_method = false;
    window.slab_method = false;
    clearPaper();
    curent_floor = floor;
    floorNames = [];

    for (var key in house) {
        if (key.startsWith("Storey")) {
            floorNames.push(key);
            draw2D.drawWalls(house[key]);
            draw2D.drawAllHelpers(house[key]);
        }
    }

    if (floor != "Storey_0") {
        var previous_storey = floorNames.indexOf(floor) - 1;
        var ghost_storey = "Storey_" + previous_storey;
        draw2D.drawGhostStorey($scope.house[ghost_storey]);
        window.ghost_storey = $scope.house[ghost_storey];
    }
    draw2D.draw(house[floor]);
    events2D.selectAndDrag(house[floor], house);

    window.openSettings = false;
    window.openSettings = true;
    calcualte2D.calculateProperties(house);
  }

  function clearPaper() {
    if (paper.project.layers[0].children.length > 0)
        paper.project.layers[0].removeChildren();
    if (paper.project.layers[2].children.length > 0)
        paper.project.layers[2].removeChildren();
    if (paper.project.layers[3].children.length > 0)
        paper.project.layers[3].removeChildren();
    if (paper.project.layers[4].children.length > 0)
        paper.project.layers[4].removeChildren();
    if (paper.project.layers[5].children.length > 0)
        paper.project.layers[5].removeChildren();
    if (paper.project.layers[6].children.length > 0)
        paper.project.layers[6].removeChildren();
    if (paper.project.layers[7].children.length > 0)
        paper.project.layers[7].removeChildren();
    if (paper.project.layers[8].children.length > 0)
        paper.project.layers[8].removeChildren();
    if (paper.project.layers[9].children.length > 0)
        paper.project.layers[9].removeChildren();

    window.openSettings = false;
    window.openSettings = true;
  }

  return main;
});
