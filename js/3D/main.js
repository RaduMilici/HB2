define(["animate", "jquery", "three", "loader", "orbitControls", "events"],
function(animate, jquery, three, Loader, orbitControls, events){
  var main = {};
  var camera_default_position = new THREE.Vector3(20, 10, 20);

//private
  function find_container()
  {
    animate.Container = $("#webGL");
    animate.ContainerWidth = $(animate.Container).width();
    animate.ContainerHeight = $(animate.Container).height();
  }

  function add_camera()
  {
    animate.Camera = new THREE.PerspectiveCamera(
      animate.CamFov, animate.ContainerWidth / animate.ContainerHeight, animate.camNear, animate.camFar );
    animate.Camera.position.copy(camera_default_position);
  };

  function add_renderer()
  {
    animate.Renderer = new THREE.WebGLRenderer({antialias: true});
    animate.Renderer.setSize( animate.ContainerWidth, animate.ContainerHeight);
    $(animate.Container).append(animate.Renderer.domElement);
  }

  function add_events()
  {
    events.Camera = animate.Camera;
    events.DomElement = animate.Renderer.domElement;
    events.Add_Orbit_Controls();
  }

  function load_scene()
  {
    animate.Loader = new Loader();
    animate.Loader.Add_Ground();
    animate.Loader.Add_Skybox();
    animate.Loader.Add_Lights();
  }

//public
  main.Start = function()
  {
    find_container();
    add_camera();
    add_renderer();
    add_events();
    load_scene();
    animate.Start();

  };

  return main;
});
