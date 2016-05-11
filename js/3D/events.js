define(["orbitControls"],
function(OrbitControls){
  var events = {
    Camera: undefined,
    DomElement: undefined
  };

  events.Add_Orbit_Controls = function()
  {
    events.Controls = new OrbitControls( events.Camera, events.DomElement );
  };


  return events;
});
//this.Controls = new orbitControls( animate.camera, animate.renderer.domElement );
