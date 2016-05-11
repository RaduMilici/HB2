require.config({
   paths:
   {
     //3D
     main: "3D/main",
     animate: "3D/animate",
     events: "3D/events",
     loader: "3D/loader",
     texture: "3D/texture",
     jquery: "../node_modules/jquery/dist/jquery",
     three: "../node_modules/three/three",
     underscore: "../node_modules/underscore/underscore",
     orbitControls : "../node_modules/three/OrbitControls",
     //2D
     main2D: "2D/main",
     helpers2D: "2D/helpers",
     events2D: "2D/events",
     draw2D: "2D/draw",
     paper: "../node_modules/paper/paper"
   }
   ,
   shim:
   {
       //fileSaver: { exports: "fileSaver" },
       //tween: { exports: "tween" }
   }
});

requirejs(["main2D"], function(main2D){
    //main.Start();
    main2D.Start_Paper();
});
