
// imports
//var table_gen = require('/table_generator');

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();



// custom global variables
var array_table_mesh = [];
var array_walls_mesh = []; 


// Note there is a 1-1 ratio between these geo
// with the meshes, they are just pushed and 
// cannot be accesses with OBJload
var array_walls_geometry = [];
var array_table_geometry = [];

var sphere_mesh;
var arrow;
var time_prev;


// constant global varibles
var INT_TABLE_NUM;
var SCALE_FACTOR = 300; 
var TABLE_SCALE = .01;
var GLOBAL_OFFSET = 161;

// start
main();



//===========================================
// Main function
//===========================================
function main(){
  inputs();
  init();
  animate();
}


// FUNCTIONS    
function inputs(){
// This function runs and gathers inputs on how many tables to apply
// Will be extended to ask for more information regarding furnature
// to be concidered in a room, desk/tables/lamps ect....
  INT_TABLE_NUM = parseInt(prompt("Number of Desk","5"));
}

function init() 
{

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400+GLOBAL_OFFSET);
  camera.lookAt(scene.position);  
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(100,250,100);
  scene.add(light)

  /*
  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  */

  // SKYBOX
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  
  // Setting up Desk Objects
  setup_objs('../output/tween/tbl017.obj', '../output/tween/TBL01701.jpg ',array_table_mesh, array_table_geometry, INT_TABLE_NUM);

  // Seeting up Contraption online =======================
  

  //Creating new objFileContents object
  objFileContents.fetch("../output/tween/foo.obj");
  objFileContents.parse();

  // setting up the walls and new floor
  var v = [], vt = [], vn = [], image_materials = [];

  setup_objs_contraption(array_walls_mesh, objFileContents, v ,vt, vn, image_materials, array_walls_geometry);

  // Adding them into array_walls_mesh
  for(var g = 0; g < array_walls_mesh.length; g++){
    array_walls_mesh[g].position.x += GLOBAL_OFFSET;
    array_walls_mesh[g].position.z += GLOBAL_OFFSET;

  }

  // Setting up contraptions visualization
  

  //// TEXTURE OF DESK
  //var manager = new THREE.LoadingManager();
  //manager.onProgress = function ( item, loaded, total ) {
  //  console.log( item, loaded, total );
  //};

  //var texture = new THREE.Texture();
  //var loader = new THREE.ImageLoader( manager );
  //loader.load( '../textures/UV_Grid_Sm.jpg', function ( image ) {
  //  texture.image = image;
  //  texture.needsUpdate = true;

  //} );

  //// MESH OBJ LOADER
  //var loader = new THREE.OBJLoader( manager );
  //loader.load( '../output/tween/tbl017.obj', function ( object ) {
  //  object.traverse( function ( child ) {
  //    if ( child instanceof THREE.Mesh ) {
  //      child.material.map = texture;
  //    }
  //  } );
  //  mesh_table = object;
  //  object.position.y = 0;
  //  object.scale.x = .01;
  //  object.scale.y = .01;
  //  object.scale.z = .01;
  //  object.rotation.x += 0.5*Math.PI;
  //  object.rotation.x += 0.5*Math.PI;
  //  object.rotation.x += 0.5*Math.PI;
  //  scene.add( mesh_table );
  //  animate();
  //});

  // getting middle point of first table



  // SPHERE
  geometry = new THREE.SphereGeometry( 3, 32, 16 );
  var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
  sphere_mesh = new THREE.Mesh( geometry, material );
  sphere_mesh.position.set(40,40,40);
  scene.add(sphere_mesh);

  // Background
  var axes = new THREE.AxisHelper(50);
  axes.position = sphere_mesh.position;
  scene.add(axes);
  
  var gridXZ = new THREE.GridHelper(GLOBAL_OFFSET, 10);
  gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
  gridXZ.position.set( GLOBAL_OFFSET,0,GLOBAL_OFFSET );
  scene.add(gridXZ);
  
  var gridXY = new THREE.GridHelper(GLOBAL_OFFSET, 10);
  gridXY.position.set( GLOBAL_OFFSET,GLOBAL_OFFSET,0 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
  scene.add(gridXY);

  var gridYZ = new THREE.GridHelper(GLOBAL_OFFSET, 10);
  gridYZ.position.set( 0,GLOBAL_OFFSET,GLOBAL_OFFSET );
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
  scene.add(gridYZ);
  
  // direction (normalized), origin, length, color(hex)
  var origin = new THREE.Vector3(50,100,50);
  var terminus  = new THREE.Vector3(75,75,75);
  var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
  arrow = new THREE.ArrowHelper(direction, origin, 50, 0x884400);
  scene.add(arrow);
}

function animate() 
{
  // Keeping track of time
  requestAnimationFrame( animate );
  render();   
  update();
}
function update()
{

  if ( keyboard.pressed("d") ) 
  { // do something   
    sphere_mesh.position.x += .05;
    console.log(sphere_mesh.position.x, sphere_mesh.position.y, sphere_mesh.position.z);
  }
  if ( keyboard.pressed("w") ) 
  { // do something   
    sphere_mesh.position.y += .05;
    console.log(sphere_mesh.position.x, sphere_mesh.position.y, sphere_mesh.position.z);
  }
  if ( keyboard.pressed("s") ) 
  { // do something   
    sphere_mesh.position.z += .05;
    console.log(sphere_mesh.position.x, sphere_mesh.position.y, sphere_mesh.position.z);
  }
  if ( keyboard.pressed("r") ) 
  { // do something   
    //console.log(array_table_mesh);
    //console.log(array_table_geometry);

    for(var i = 0; i <array_table_mesh.length; i++){
      // For each table/desk
      if(array_table_mesh[i]){

        // jitter
        array_table_mesh[i].position.x =Math.floor(Math.random()*200);
        array_table_mesh[i].position.z =Math.floor(Math.random()*200);

        // get bounding Sphere
        //console.log("-=-=-=-=-");
        //console.log(array_table_geometry[i].boundingBox);
        console.log("-=-=-=-=-=");
        

        var max =  array_table_geometry[i].boundingBox.max;
        var min = array_table_geometry[i].boundingBox.min;

        

        var center= new THREE.Vector3(max.x + min.x, max.y + min.y, max.z+ min.z);
        center.multiplyScalar(0.5);
        center.add(array_table_mesh[i].position);
        center.setY(center.y + 30);

        // yes
        console.log(center);

        var projection = new THREE.Vector3(center.x,0,center.z);
        var direction = new THREE.Vector3().subVectors(projection, center).normalize();

        var ray = new THREE.Raycaster(center,direction);

        /*
        arrow.position = center;
        console.log(arrow);
        arrow.setDirection(direction);
       */

       var intersect = ray.intersectObjects(array_walls_mesh);
       intersect[0].face.color.setRGB( 1,1,1 );
       intersect[0].object.geometry.colorsNeedUpdate = true;

       console.log(intersect);
      }
    }
  }
  
  
  controls.update();
  stats.update();
}

function render() 
{
  renderer.render( scene, camera );
}

function setup_objs(str_obj, str_texture ,array_mesh,array_geo, int_copies){

  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };

  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader( manager );
  loader.load( str_texture, function ( image ) {
    texture.image = image;
    texture.needsUpdate = true;
  } );


  var int_offset = 20;
  var int_x = 0;

  // load in meshes
  for(var i = 0 ; i < int_copies; i++ ){

    var loader = new THREE.OBJLoader( manager );
    loader.load( str_obj, function ( object ) {
      // Map textures
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {

          // update texture
          child.material.map = texture;

          // update bounding box's
          child.geometry.computeBoundingBox();
          child.geometry.boundingBox.max.multiplyScalar(TABLE_SCALE);
          child.geometry.boundingBox.min.multiplyScalar(TABLE_SCALE);

          //push into global var like hussla
          array_geo.push(child.geometry);

        }
      });
      // Ready the mesh for loading
      // add to array
      array_mesh.push(object);
      
      // roations to table
      object.scale.x = TABLE_SCALE;
      object.scale.y = TABLE_SCALE;
      object.scale.z = TABLE_SCALE;
      object.rotation.x += 1.5*Math.PI;

      // offsets
      object.position.x = int_x*int_offset;
      int_x++;

      // Adding to scene
      scene.add(array_mesh[array_mesh.length -1]);
      animate();

    });//loader
  } //for
}// setup_obj


function setup_objs_contraption(array_walls_mesh, objFileContents, v ,vt, vn, image_materials,array_walls_geometry){
  //Major note: With loaded OBJ objects you cannot access the innards outside this fucntion. I link the rest right now
  //with global arrays. bad practice but oh well :(

  var array_material = [], all_v = [];
  var image_textures  = [], image_names = [];

  for(o = 1; o < objFileContents.vectors.length; o++){

      // new vertex defined on this line 
      if(objFileContents.vectors[o][0] == "v"){

      // use v.length to add one to the length and add x,y, and z components
      v.push(new Array());

      // Adding x,y,z
      v[v.length-1].push(objFileContents.vectors[o][1]);
      v[v.length-1].push(objFileContents.vectors[o][2]);
      v[v.length-1].push(objFileContents.vectors[o][3]);

      //how I would like to add vertices to the geometry
      //TODO what is the 50 for?
      all_v.push( new THREE.Vector3( 
            SCALE_FACTOR*v[v.length-1][0], 
            SCALE_FACTOR*v[v.length-1][1], 
            SCALE_FACTOR*v[v.length-1][2])); 

    }

    //get the texture coordinates for each vertex
    else if(objFileContents.vectors[o][0] == "vt"){
      vt.push(new Array());
      //						vt[vt.length-1].push(objFileContents.vectors[o][1]);
      //						vt[vt.length-1].push(objFileContents.vectors[o][2]);

      //multiply texture coordinates by .999 for threejs cutoff
      vt[vt.length-1].push(objFileContents.vectors[o][1]*0.999);
      vt[vt.length-1].push(objFileContents.vectors[o][2]*0.999);
    }

    //get the normals for each vertex
    else if(objFileContents.vectors[o][0] == "vn"){
      vn.push(new Array());
      vn[vn.length-1].push(objFileContents.vectors[o][1]);
      vn[vn.length-1].push(objFileContents.vectors[o][2]);
      vn[vn.length-1].push(objFileContents.vectors[o][3]);
    }
    
    //adding a new face
    else if(objFileContents.vectors[o][0] == "f"){

      //format is #/#/#.  Pull apart to only grab # in temp_vertex_*[0]
      var temp_vertex_1 = objFileContents.vectors[o][1]; //3 vertices in the face
      var temp_vertex_2 = objFileContents.vectors[o][2]; 
      var temp_vertex_3 = objFileContents.vectors[o][3]; 

      //split for list
      temp_vertex_1 = temp_vertex_1.split("/");
      temp_vertex_2 = temp_vertex_2.split("/");
      temp_vertex_3 = temp_vertex_3.split("/");

      //using -1 because the vertices are 1-indexed
      if(array_walls_geometry.length == 0) console.log("Adding stuff, where there is no geometry");
      array_walls_geometry[array_walls_geometry.length-1].faces.push( new THREE.Face3(temp_vertex_1[0]-1,temp_vertex_2[0]-1,temp_vertex_3[0]-1 ) );

      //add texture coordinates flopping x and y coordinates
      array_walls_geometry[array_walls_geometry.length-1].faceVertexUvs[0].
        push([
            new THREE.Vector2(
              vt[temp_vertex_1[0]-1][1],
              vt[temp_vertex_1[0]-1][0]),

            new THREE.Vector2(
              vt[temp_vertex_2[0]-1][1],
              vt[temp_vertex_2[0]-1][0]),

            new THREE.Vector2(
              vt[temp_vertex_3[0]-1][1],
              vt[temp_vertex_3[0]-1][0])
          ]);
    }


    else if (objFileContents.vectors[o][0] == "usemtl"){
      // Assumed the first thing that happens

      //a new texture means a new geometry
      array_walls_geometry.push(new THREE.Geometry());

      //must add vertices to each geometry because faces share them
      array_walls_geometry[array_walls_geometry.length-1].vertices = all_v;

      //Why is this?
      if(objFileContents.vectors[o][1] == "EXTRA_wall_top"){
        var hex = 0x000000; //this is the line that used to generate a random number
        //image_materials.push(new THREE.MeshBasicMaterial ({color: hex}));
        image_materials.push(new THREE.MeshBasicMaterial ({color: hex}));
      }

      else{
        //get file from other folder
        //image_names.push("../textures/exact_geometry_photos/surface_camera_" + objFileContents.vectors[o][1] + "_texture.png");
        image_names.push("../output/slow/surface_camera_" + objFileContents.vectors[o][1] + "_texture.png");
        //last image added jump
        image_textures.push(THREE.ImageUtils.loadTexture( image_names[image_names.length - 1] ));
        //create a material out of the loaded image
        image_materials.push(new THREE.MeshBasicMaterial( {map: image_textures[image_textures.length-1]} ));
      }
    }
  }//endfor

  // computing important into for rendering
  for(var loop = 0; loop < array_walls_geometry.length; loop++){
    array_walls_geometry[loop].computeCentroids();
    array_walls_geometry[loop].computeFaceNormals();
    array_walls_geometry[loop].computeVertexNormals();	
  }

  // Adding them into array_walls_mesh
  for(var g = 0; g < array_walls_geometry.length; g++){

    //random color faces?
    for(var i = 0; i < array_walls_geometry[g].faces.length; i++){
      var hex = Math.random() * 0xffffff;
      array_walls_geometry[g].faces[ i ].color.setHex( hex );
    }
    
    // Creating Material
    array_material.push(new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } ));

    // Creating mesh objects in array
    array_walls_mesh.push(new THREE.Mesh( array_walls_geometry[g], image_materials[g] ));

    array_material[g].side = THREE.DoubleSide;
    array_walls_mesh[g].doubleSided = true;
    array_walls_mesh[g].position.y = 0;
    array_walls_mesh[g].position.z = 0;
    array_walls_mesh[g].rotation.x = 0;
    scene.add(array_walls_mesh[g]);
    animate();
  }
}
