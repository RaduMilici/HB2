define(["three"],
function(three){

  var texture = {
    folder: "img/",
    format: ".jpg"
  };

  texture.Mesh_From_Geometry = function(geom, name, repeat, skipUV)
  {
    var material = undefined;

    if(!skipUV)
    {
      geom = texture.Make_UV(geom);
    }

    name = name.replace(":", "");

    var tex = texture.Load(name);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set( repeat, repeat );

    if(name)
    {
      material = new THREE.MeshLambertMaterial( { map: tex, side: THREE.DoubleSide, color: 0xffffff,
        transparent: false, wireframe: false});
    }
    else
    {
      material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: false });
    }

    var mesh = new THREE.Mesh(geom , material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  texture.Make_UV = function(geom)
  {
  	var faces = geom.faces;
  	var uvSquareSize = 500;
  	var max     = new THREE.Vector3( uvSquareSize, uvSquareSize, uvSquareSize );
  	var min     = new THREE.Vector3( -uvSquareSize, -uvSquareSize, -uvSquareSize );
  	var offset  = new THREE.Vector2(0 - min.x, 0 - min.z);
  	var range   = new THREE.Vector2(max.x - min.x, max.z - min.z);

  	geom.faceVertexUvs[0] = [];

  	for (i = 0; i < geom.faces.length ; i++)
    {
  	    var v1 = geom.vertices[faces[i].a];
  	    var v2 = geom.vertices[faces[i].b];
  	    var v3 = geom.vertices[faces[i].c];

  	    var normal = geom.faces[i].normal;
  	    normal.normalize();

  	    if(Math.abs(normal.y) == 1)
        {
    	    geom.faceVertexUvs[0].push([
    	        //  From Y
    	        new THREE.Vector2( ( v1.z + offset.x ) / range.x , ( v1.x + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v2.z + offset.x ) / range.x , ( v2.x + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v3.z + offset.x ) / range.x , ( v3.x + offset.y ) / range.y )]);
  	    }
  	    else if(Math.abs(normal.x) > Math.abs(normal.z))
        {
    	    geom.faceVertexUvs[0].push([
    	        //  From Z
    	        new THREE.Vector2( ( v1.z + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v2.z + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v3.z + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )]);
  	    }
  	    else if (Math.abs(normal.x) <= Math.abs(normal.z))
        {
    	    geom.faceVertexUvs[0].push([
    	        //  From X
    	        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
    	        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )]);
  	    }
  	}

  	geom.uvsNeedUpdate = true;
  	return geom;
  };

  texture.Load = function(name)
  {
    return THREE.ImageUtils.loadTexture( texture.folder + name + texture.format );
  }

  return texture;
});
