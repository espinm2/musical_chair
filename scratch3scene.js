/*
  Three.js "tutorials by example"
  Author: Lee Stemkoski
  Date: July 2013 (three.js v59dev)
 */

// imports
//var table_gen = require('/table_generator');

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();


// custom global variables
var array_table_mesh = [];
var sphere_mesh;
var time_prev;

// constant global varibles
var INT_TABLE_NUM;

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
  INT_TABLE_NUM = prompt("Number of Desk","5");
}

function init() 
{

  // TIME
  time_prev = 
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
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
  
  setup_objs('../output/tween/tbl017.obj', '../textures/UV_Grid_Sm.jpg ',array_table_mesh, INT_TABLE_NUM);
  console.log(array_table_mesh);

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
  
  var gridXZ = new THREE.GridHelper(100, 10);
  gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
  gridXZ.position.set( 100,0,100 );
  scene.add(gridXZ);
  
  var gridXY = new THREE.GridHelper(100, 10);
  gridXY.position.set( 100,100,0 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
  scene.add(gridXY);

  var gridYZ = new THREE.GridHelper(100, 10);
  gridYZ.position.set( 0,100,100 );
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
  scene.add(gridYZ);
  
  // direction (normalized), origin, length, color(hex)
  var origin = new THREE.Vector3(50,100,50);
  var terminus  = new THREE.Vector3(75,75,75);
  var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
  var arrow = new THREE.ArrowHelper(direction, origin, 50, 0x884400);
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
    for(var i = 0; i <array_table_mesh.length; i++){
      
      if(array_table_mesh[i]){
        array_table_mesh[i].position.x =Math.floor(Math.random()*200);
        array_table_mesh[i].position.z =Math.floor(Math.random()*200);
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

function setup_objs(str_obj, str_texture ,array_mesh, int_copies){

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
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material.map = texture;
        }
      } );
      
      // add to array
      array_mesh.push(object);
      
      // roations to table
      object.scale.x = .01;
      object.scale.y = .01;
      object.scale.z = .01;
      object.rotation.x += 1.5*Math.PI;

      // offsets
      object.position.x = int_x*int_offset;
      int_x++;

      // Adding to scene
      scene.add(array_mesh[array_mesh.length -1]);
      animate();

    });
  } //for
}
