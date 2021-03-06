//======================================================
// Global Varibles
// begin
//======================================================

console.log("Starting Musical_chair.js");
//objFileContents.fetch("./exact_geometry_with_photos/foo.obj"); //before script
objFileContents.fetch("/output/tween/foo.obj");
//objFileContents.fetch("../output/tween/Desk.obj");
objFileContents.parse();
console.log(objFileContents.vectors);

var mtl_file_name = "";

// Getting the obj files
var objMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });

var container, stats;

var camera, scene, renderer;


//initial camera location
var CAMERA_X = 0;
var CAMERA_Y = 10;
var CAMERA_Z = 60;

//size of canvas
var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth ;

//Scale Factor
var SCALE_FACTOR = 50;

//stores data found in obj file
var v = [];
var vt = [];
var vn = [];

var o;

//meshes for different items
var mesh = [];
var material = [];


//rotation variables
var targetRotationX = 0;
var targetRotationY = 0;
var targetRotationOnMouseDownX = 0;
var targetRotationOnMouseDownY = 0;

//translation variables
var targetTranslationX = 0;
var targetTranslationY = 0;
var targetTranslationOnMouseDownX = 0;
var targetTranslationOnMouseDownY = 0;

//zoom variables
var targetZoomY = 0;
var targetZoomOnMouseDownY = 0;

//mouse variables for transformations
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//variables for storing image info
var image_names = [];
var image_textures = [];
var image_materials = [];

//geometry for the faces
var geometries = [];

//var meshes = [];
var all_vertices = [];

//will keep track of keyboard calls
var keyboard;

//run main
main();


//======================================================
// Main Function
// mainy
//======================================================
function main(){


  // Set up mesh with walls and table
  init();

  // Set up mesh with desk objects
  

  // Allow animations
  animate();


}


//======================================================
// All the other functions
//======================================================

function getObjData(){

  // get the name of the mtl file; it is the second thing on the first line
  // vectors[line_number] [word_number]
  mtl_file_name = objFileContents.vectors[0][1];
  console.log(mtl_file_name);

  // loop through the arrays from the file data and analyze their contents
  // start at 1 because line 1 is the name of the .mtl file 
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
      all_vertices.push( new THREE.Vector3( 
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
      if(geometries.length == 0) console.log("Adding stuff, where there is no geometry");
      geometries[geometries.length-1].faces.push( new THREE.Face3(temp_vertex_1[0]-1,temp_vertex_2[0]-1,temp_vertex_3[0]-1 ) );

      //add texture coordinates for each face 
      //						geometries[geometries.length-1].faceVertexUvs[0].push([new THREE.Vector2(vt[temp_vertex_1[0]-1][0],vt[temp_vertex_1[0]-1][1]),
      //																				new THREE.Vector2(vt[temp_vertex_2[0]-1][0],vt[temp_vertex_2[0]-1][1]),
      //																				new THREE.Vector2(vt[temp_vertex_3[0]-1][0],vt[temp_vertex_3[0]-1][1])]);

      //add texture coordinates flopping x and y coordinates
      geometries[geometries.length-1].faceVertexUvs[0].push([new THREE.Vector2(vt[temp_vertex_1[0]-1][1],vt[temp_vertex_1[0]-1][0]),
                        new THREE.Vector2(vt[temp_vertex_2[0]-1][1],vt[temp_vertex_2[0]-1][0]),
                        new THREE.Vector2(vt[temp_vertex_3[0]-1][1],vt[temp_vertex_3[0]-1][0])]);

    }else if(objFileContents.vectors[o][0] == "#"){
      //Don't do anything
    }

    /*
    //getting texture names from the obj filek
    else if (objFileContents.vectors[o][0] == "usemtl"){
      console.log("trying to load in generic texture");
      //a new texture means a new geometry
      geometries.push(new THREE.Geometry());

      //must add vertices to each geometry because faces share them
      geometries[geometries.length-1].vertices = all_vertices;

      //assign random materical
      var hex = 0x000000; //this is the line that used to generate a random number
      image_materials.push(new THREE.MeshBasicMaterial ({color: hex}));
    }
    */
    else if (objFileContents.vectors[o][0] == "usemtl"){
      // Assumed the first thing that happens

      //a new texture means a new geometry
      geometries.push(new THREE.Geometry());

      //must add vertices to each geometry because faces share them
      geometries[geometries.length-1].vertices = all_vertices;

      //Why is this?
      if(objFileContents.vectors[o][1] == "EXTRA_wall_top"){
        var hex = 0x000000; //this is the line that used to generate a random number
        image_materials.push(new THREE.MeshBasicMaterial ({color: hex}));
      }

      else{
        //get file from other folder
        //image_names.push("../textures/exact_geometry_photos/surface_camera_" + objFileContents.vectors[o][1] + "_texture.png");
        image_names.push("../output/slow/surface_camera_" + objFileContents.vectors[o][1] + "_texture.png");
        //last image added
        image_textures.push(THREE.ImageUtils.loadTexture( image_names[image_names.length - 1] ));
        //create a material out of the loaded image
        image_materials.push(new THREE.MeshBasicMaterial( {map: image_textures[image_textures.length-1]} ));
      }
    }
  }

  //TODO 
  console.log(geometries[0]);
  console.log(geometries[0].faces[0]);
  for(var loop = 0; loop < geometries.length; loop++){
    geometries[loop].computeCentroids();
    geometries[loop].computeFaceNormals();
    geometries[loop].computeVertexNormals();	
  }
}


function getObjData_table(mesh,scene){
  var radius = 20,
      segments = 16,
      rings = 16;



  // Task add to the mesh[] array with a new mesh object
  // how do i setup mesh object?
  // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial(
      {
        color: 0xCC0000
      });

  // create a new mesh with
  // sphere geometry - we will cover
  // the sphereMaterial next!
  var sphere = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),
    sphereMaterial);


  sphere.geometry.dynamic = true;
  sphere.geometry.verticesNeedUpdate = true;
  sphere.geometry.normalsNeedUpdate = true;
  sphere.overdraw = true;

  // cube
  var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10), new THREE.MeshLambertMaterial({
    color: 'blue' 
  }));
  cube.overdraw = true;

  mesh.push(cube);
  scene.add(cube);
}


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.left = '8px';
  //info.style.left = window.innerWidth/2+'px';
  //info.style.right = '0px';
  info.style.textAlign = 'center';

  //This used to hold message "Drag to spin the cube" -> info.innterHTML moved to end to try to get it on top of the canvas
  //info.innerHTML = '<a href="../cgi-bin/run_remesher_and_lsvo.sh?/server_data/wallfiles/cat.wall+/server_data" style="position: absolute; z-index: 1;"  target="_blank">Joshs scripty bit</a>';
  //container.appendChild( info );

  //last two values are near and far clipping planes
  //camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 5, 120 );
  camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 5, 120 );
  camera.position.x = CAMERA_X;
  camera.position.y = CAMERA_Y;
  camera.position.z = CAMERA_Z;
  camera.rotation.x = 0;
  camera.rotation.y = 0;

  scene = new THREE.Scene();

  //getObjData();


  //console.log("Num geometries: "  + geometries.length + "  Num materials: " + image_materials.length);

  // Get every mesh and put in into the scene with meshes
  for(var g = 0; g < geometries.length; g++){
    //meshes.push(new THREE.Mesh( geometries[g], image_materials[g] ));
    for(var i = 0; i < geometries[g].faces.length; i++){
      var hex = Math.random() * 0xffffff;
      geometries[g].faces[ i ].color.setHex( hex );
    }
    material.push(new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } ));
    mesh.push(new THREE.Mesh( geometries[g], image_materials[g] ));
    material[g].side = THREE.DoubleSide;
    mesh[g].doubleSided = true;
    mesh[g].position.y = 0;
    mesh[g].position.z = 0;
    mesh[g].rotation.y = 0;
    scene.add(mesh[g]);

  }

  // Max Edit pushes a cube
  getObjData_table(mesh,scene);
  

  renderer = new THREE.WebGLRenderer({ antialias : true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  //renderer.setSize(WIDTH,HEIGHT);
  //renderer.setViewport(window.innerWidth/4,window.innerHeight/10,WIDTH,HEIGHT);

  // EDIT 4/24
  // Adjusting to recenter the scene
  //var renderer_position = renderer.getPosition();
  //renderer_position.x = window.innerWidth/2;
  //renderer.setPosition(window.innerWidth/2, 0);
  //renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  window.addEventListener( 'resize', onWindowResize, false );

  keyboard = new THREEx.KeyboardState();



}

function onWindowResize() {

windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}
//These two functions keep the right click menu from coming up
//http://stackoverflow.com/questions/6789843/disable-right-click-menu-in-chrome
function mouseDown(e) {
  if (e.which==3) {//righClick
  }
}
function RightMouseDown() { return false;}

function onDocumentMouseDown( event ) {

  switch (event.button){
  case 0:
  console.log("On Document Mouse Down Case 0: Left button");
  event.preventDefault();

  document.addEventListener( 'mousemove', onDocumentMouseMoveRotate, false );
  document.addEventListener( 'mouseup', onDocumentMouseUpRotate, false );
  document.addEventListener( 'mouseout', onDocumentMouseOutRotate, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDownX = targetRotationX;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationOnMouseDownY = targetRotationY;
  break;
  case 1:
  console.log("On Document Mouse Down Case 1: Middle button");
  event.preventDefault();

  document.addEventListener( 'mousemove', onDocumentMouseMoveTranslate, false );
  document.addEventListener( 'mouseup', onDocumentMouseUpTranslate, false );
  document.addEventListener( 'mouseout', onDocumentMouseOutTranslate, false );

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetTranslationOnMouseDownX = targetTranslationX;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetTranslationOnMouseDownY = targetTranslationY;
  break;
  case 2:
  //These two lines keep the right click menu from coming up. (call other functions)
  document.oncontextmenu=RightMouseDown;
  document.onmousedown = mouseDown; 

  console.log("On Document Mouse Down Case 2: Right button");
  event.preventDefault();

  document.addEventListener( 'mousemove', onDocumentMouseMoveZoom, false );
  document.addEventListener( 'mouseup', onDocumentMouseUpZoom, false );
  document.addEventListener( 'mouseout', onDocumentMouseOutZoom, false );

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetZoomOnMouseDownY = targetZoomY;
  break;
  }

}

function onDocumentMouseMoveRotate( event ) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.02;
  targetRotationY = targetRotationOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.02;

}

function onDocumentMouseMoveTranslate( event ) {


  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  targetTranslationX = targetTranslationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.02;
  targetTranslationY = targetTranslationOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.02;

}

function onDocumentMouseMoveZoom( event ) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

  targetZoomY = targetZoomOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.02;
}


function onDocumentMouseUpRotate( event ) {


  document.removeEventListener( 'mousemove', onDocumentMouseMoveRotate, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpRotate, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutRotate, false );

}

function onDocumentMouseUpTranslate( event ) {

  document.removeEventListener( 'mousemove', onDocumentMouseMoveTranslate, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpTranslate, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutTranslate, false );
}

function onDocumentMouseUpZoom( event ) {

  document.removeEventListener( 'mousemove', onDocumentMouseMoveZoom, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpZoom, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutZoom, false );
}

function onDocumentMouseOutRotate( event ) {


  document.removeEventListener( 'mousemove', onDocumentMouseMoveRotate, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpRotate, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutRotate, false );

}

function onDocumentMouseOutTranslate( event ) {

  document.removeEventListener( 'mousemove', onDocumentMouseMoveTranslate, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpTranslate, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutTranslate, false );

}

function onDocumentMouseOutZoom( event ) {

  document.removeEventListener( 'mousemove', onDocumentMouseMoveZoom, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUpZoom, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOutZoom, false );

}

function onDocumentTouchStart( event ) {

  switch (event.button){
    case 0:
    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDownX = targetRotationX;

      mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
      targetRotationOnMouseDownY = targetRotationY;

    }
    
    break;
    case 1:
    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetTranslationOnMouseDownX = targetTranslationX;

      mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
      targetTranslationOnMouseDownY = targetTranslationY;

    }

    break;
    case 2:
    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
      targetZoomOnMouseDownY = targetZoomY;

    }

    break;
  }
}

function onDocumentTouchMove( event ) {

  switch (event.button){
  case 0:
  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

    mouseY = event.touches[ 0 ].pageY - windowHalfY;
    targetRotationY = targetRotationOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.05;

  }
  break;
  case 1:
  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    targetTranslationX = targetTranslationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

    mouseY = event.touches[ 0 ].pageY - windowHalfY;
    targetTranslationY = targetTranslationOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.05;

  }
  break;
  case 2:

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseY = event.touches[ 0 ].pageY - windowHalfY;
    targetZoomY = targetZoomOnMouseDownY + ( mouseY - mouseYOnMouseDown ) * 0.05;

  }
  break;
  }



}

function animate() {

  requestAnimationFrame( animate );
  render();
  stats.update();
}

function render() {

  //apply rotation
  //use oposite target rotation because we want to rotate around axis perpendicular to mouse movement
  for(var m = 0; m < mesh.length; m++){
    mesh[m].rotation.y += ( targetRotationX - mesh[m].rotation.y ) * 0.05;
    mesh[m].rotation.x += ( targetRotationY - mesh[m].rotation.x ) * 0.05;
  }

  //apply translation
  for(var m = 0; m < mesh.length; m++){
    mesh[m].position.y += ( targetTranslationY - mesh[m].position.y ) * 0.05;
    mesh[m].position.x += ( targetTranslationX - mesh[m].position.x ) * 0.05;
    //	console.log("Target Translation Y " + targetTranslationY + " Mesh position y: " + mesh[m].position.y);
  }
  camera.position.z += (CAMERA_Z + targetZoomY - camera.position.z ) * 0.05;

  //keyboard controls
  if(keyboard.pressed("up")){
    camera.position.z -= 2;
  }
  if(keyboard.pressed("down")){
    camera.position.z += 2;
  }
  if(keyboard.pressed("left")){
    camera.position.x -= 2;
  }
  if(keyboard.pressed("right")){
    camera.position.x += 2;
  }
  renderer.render( scene, camera );
}
