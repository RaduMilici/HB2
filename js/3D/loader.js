define(["three", "texture"],
function(three, texture){
  var loader = function()
  {
    var ground_width = 10;

    this.Scene = new THREE.Scene();

    this.Add = function(obj)
    {
      this.Scene.add(obj);
    };

    this.Add_Ground = function(size)
    {
      size = size || 100;
    	var groundGeom, groundTex, groundMat, groundMesh;
    	var shape = new THREE.Shape();

    	shape.absarc( 0, 0, size, 0, Math.PI*2, true );
    	groundGeom = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, amount: ground_width } );
    	groundGeom = texture.Make_UV(groundGeom);
    	groundGeom.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ));
    	groundMesh = texture.Mesh_From_Geometry(groundGeom, 'grass', 64, true);
    	groundMesh.position.y -= 3;
    	groundMesh.castShadow = false;
    	groundMesh.receiveShadow = true;
    	this.Add(groundMesh);
    };

    this.Add_Skybox = function(size)
    {
      size = size || 2000;
    	var imagePrefix = "skybox/grand_canyon_";
    	var directions  = ["front", "back", "top", "left", "left", "right"];
    	var skyGeometry = new THREE.BoxGeometry( size, size, size );
    	var materialArray = [];

      /*********************************************************/
    	for (var i = 0; i < 6; i++)
    		materialArray.push( new THREE.MeshBasicMaterial(
          {
    			map: texture.Load(imagePrefix + directions[i]),
    			side: THREE.BackSide
         }));
    	/*********************************************************/

    	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    	this.Add( skyBox );
    }

    this.Add_Lights = function()
    {
      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	    var ambientLight = new THREE.AmbientLight( 0xffffff );
      this.Add(directionalLight);
      this.Add(ambientLight);
    }
  };

  return loader;
});
