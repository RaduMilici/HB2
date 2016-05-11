define([], function(){
  var animate = {
    //Container
    Container: undefined,
    ContainerHeight: undefined,
    ContainerWidth: undefined,
    //Renderer
    Renderer: undefined,
    //Loader
    Loader: undefined,
    //Camera
    Camera: undefined,
    CamFov: 45,
    CamNear: 1,
    CamFar: 20000
  };

  var frameID = undefined;

//private
  function render()
  {
    frameID = requestAnimationFrame( render );
    animate.Renderer.render( animate.Loader.Scene, animate.Camera );
  }

//public
  animate.Start = function()
  {
    render();
  };

  animate.Stop = function()
  {
    cancelAnimationFrame(frameID);
    frameID = undefined;
  };

  return animate;
});
