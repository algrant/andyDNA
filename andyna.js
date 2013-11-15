var container, stats;
var camera, scene, renderer, scene_width, scene_height;
var snake;
var deliciousBall;
var lastTime = 0;


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - orthographic view';
  container.appendChild( info );


  scene_width = 1500;
  scene_height = 1500;
  var cam_width, cam_height;

  if ( window.innerHeight / window.innerWidth  > scene_width / scene_height  ){
    cam_width = scene_width;
    cam_height = scene_height  * window.innerHeight / window.innerWidth;
  }else{
    cam_width = scene_width* window.innerWidth / window.innerHeight;
    cam_height = scene_height ;
  }

  camera = new THREE.OrthographicCamera( cam_width / - 2, cam_width / 2, cam_height / 2, cam_height / - 2, - 500, 1000 );
  //camera.position.x = 200;
  camera.position.y = 500;
  //camera.position.z = 200;

  scene = new THREE.Scene();

  // Grid

  var size = 500, step = 50;

  var geometry = new THREE.Geometry();

  for ( var i = - size; i <= size; i += step ) {

    geometry.vertices.push( new THREE.Vector3( - size, i, 0 ) );
    geometry.vertices.push( new THREE.Vector3(   size, i, 0 ) );

    geometry.vertices.push( new THREE.Vector3( i, - size, 0 ) );
    geometry.vertices.push( new THREE.Vector3( i,   size, 0 ) );

  }

  var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: .1 } );

  var line = new THREE.Line( geometry, material );
  line.type = THREE.LinePieces;
  scene.add( line );

  // Snake

  andy = new Snake(scene, "gtcagtccggtcagtccggtcagtccg") ; 

  deliciousBall = new THREE.Mesh( geometry, material.clone());
  //deliciousBall.rotation.set(Math.PI*1.5,0,0);
  deliciousBall.material.color.setHex(0xaaaa00) ;
  deliciousBall.position.x = Math.random()*1000-500;
  deliciousBall.position.z = Math.random()*1000-500;
  scene.add(deliciousBall);
  // Lights

  // var directionalLight = new THREE.PointLight( 0xffffff,1 );
  // directionalLight.position.x = 0;
  // directionalLight.position.y = 0;
  // directionalLight.position.z = 100;
  // //directionalLight.position.normalize();
  // console.log(directionalLight.position)
  // scene.add( directionalLight );

  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  scene.fog = new THREE.Fog(0xffffff, 10, 60);
  scene.fog.color.setHSL( 0.51, 0.6, 0.6 );

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  //
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );

  window.addEventListener( 'resize', onWindowResize, false );
}
function onDocumentKeyDown( event ) {

  switch( event.keyCode ) {
    //left, up, right, down
    case 37: 
      andy.direction = "left";
      //snake.angle += snake.angle_acc;
      break;
    case 38: 
      /*snake.speed *=1.2; 
      //snake.turn_radius += 3;
      snake.angle_acc = Math.PI/2 - Math.acos(snake.speed/snake.turn_radius);*/
      break; 
    case 39: 
      andy.direction = "right";
      //snake.angle -= snake.angle_acc; 
      break; 
    case 40: /*
    snake.speed /=1.2; 
      //snake.turn_radius -= 3;
      snake.angle_acc = Math.PI/2 - Math.acos(snake.speed/snake.turn_radius);*/
      break; 

  }
}

function onDocumentKeyUp( event ) {

  switch( event.keyCode ) {

    case 37: andy.direction = "straight";
      break;
    case 39: andy.direction = "straight"; break;

  }
}
function onWindowResize() {

  var cam_width, cam_height;

  if ( window.innerHeight / window.innerWidth  > scene_width / scene_height  ){
    cam_width = scene_width;
    cam_height = scene_height  * window.innerHeight / window.innerWidth;
  }else{
    cam_width = scene_width* window.innerWidth / window.innerHeight;
    cam_height = scene_height ;
  }

  camera.left = cam_width / - 2;
  camera.right = cam_width / 2;
  camera.top = cam_height / 2;
  camera.bottom = cam_height / - 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function Snake(scene, dna){
  
  this.positionArray = [];
  this.snakeGeometry = [];
  this.snakeGeometryPair = [];
  this.scene = scene;
  this.segmentsPerBasePair = 4;
  this.segmentLength = 10;
  this.angle = -Math.PI/2;
  this.dna = dna || "agctc";
  this.complements ={"a":"t","t":"a","g":"c","c":"g"};
  this.angle_acc = .1;
  this.headIndex = 0;
  this.helicalRadius = 30;
  this.helicalAngleOffset = Math.PI/3;
  this.headHelicalAngle = 0;
  for (var i = 0; i < dna.length; i++){
    for (var j = 0; j < this.segmentsPerBasePair; j++){
      this.positionArray.push({x:this.segmentLength*(i*this.segmentsPerBasePair + j),y:0});
    }
  }
  this.averageCentre = {x:this.segmentLength*this.segmentsPerPair*this.dna.length /2, y:0}

  this.initGeometry();

}

Snake.prototype.initGeometry = function(){
  var circleRadius = 20;
  var circleShape = new THREE.Shape();
  circleShape.moveTo( 0, circleRadius );
  var quad_offset = .90;
  circleShape.quadraticCurveTo( circleRadius*quad_offset, circleRadius*quad_offset, circleRadius, 0 );
  circleShape.quadraticCurveTo( circleRadius*quad_offset, -circleRadius*quad_offset, 0, -circleRadius );
  circleShape.quadraticCurveTo( -circleRadius*quad_offset, -circleRadius*quad_offset, -circleRadius, 0 );
  circleShape.quadraticCurveTo( -circleRadius*quad_offset, circleRadius*quad_offset, 0, circleRadius );

  var geometry = new THREE.ShapeGeometry( circleShape ); //new THREE.SphereGeometry( 30, 10, 3 );

  //geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
  var materials = { "a":new THREE.MeshLambertMaterial( { color: 0x2CA7DD, overdraw: true } ),
                    "t":new THREE.MeshLambertMaterial( { color: 0xFAA327, overdraw: true } ),
                    "c":new THREE.MeshLambertMaterial( { color: 0xE6278A, overdraw: true } ),
                    "g":new THREE.MeshLambertMaterial( { color: 0x5EBC9A, overdraw: true } )}

  for ( var i = 0; i < this.dna.length; i ++ ) {

    var sphere = new THREE.Mesh( geometry, materials[this.dna[i]] );
    var sphere2 = new THREE.Mesh( geometry, materials[this.complements[this.dna[i]]] );

    sphere.position.x = this.positionArray[i*this.segmentsPerBasePair].x;
    sphere.position.y = this.positionArray[i*this.segmentsPerBasePair].y;
    sphere.position.z = Math.random()*50-25;

    sphere2.position.x = this.positionArray[i*this.segmentsPerBasePair].x;
    sphere2.position.y = this.positionArray[i*this.segmentsPerBasePair].y;
    sphere2.position.z = Math.random()*50-25;

    //sphere.rotation.set(Math.PI*1.5,0,0);

    this.snakeGeometry.push(sphere);
    this.snakeGeometryPair.push(sphere2);
    this.scene.add( sphere );
    this.scene.add( sphere2 );
  }
}

Snake.prototype.update = function(dt){
  if (this.direction == "left"){
    this.angle -= this.angle_acc;
  }else if (this.direction == "right"){
    this.angle += this.angle_acc;
  }
  this.headHelicalAngle = (this.headHelicalAngle - this.helicalAngleOffset/15)%(Math.PI * 2);

  var vx = Math.sin(this.angle)*this.segmentLength;
  var vy = Math.cos(this.angle)*this.segmentLength;
  
  var oldHead = this.headIndex ;
  var newHead = (this.headIndex - 1) ;
  if (newHead < 0 ) newHead = this.positionArray.length -1;

  this.averageCentre.x -= this.positionArray[oldHead].x/this.positionArray.length;
  this.averageCentre.y -= this.positionArray[oldHead].y/this.positionArray.length;

  this.positionArray[newHead] = {x: this.positionArray[oldHead].x + vx,
                                 y: this.positionArray[oldHead].y + vy}
  this.averageCentre.x += this.positionArray[newHead].x/this.positionArray.length;
  this.averageCentre.y += this.positionArray[newHead].y/this.positionArray.length;

  var diff = 50;
  for (var i = 0; i < this.snakeGeometry.length; i++){
    var thisIndex = (newHead + i*this.segmentsPerBasePair)%this.positionArray.length;
    var prevIndex = (thisIndex + 1)%this.positionArray.length;

    var thisAngle = Math.atan2(this.positionArray[thisIndex].y - this.positionArray[prevIndex].y,  this.positionArray[thisIndex].x - this.positionArray[prevIndex].x)
    var thisNormal = thisAngle - Math.PI/2;
    var thisHelicalAngle = this.headHelicalAngle + i*this.helicalAngleOffset;
    var helicalR = this.helicalRadius * Math.cos(thisHelicalAngle);
    var helicalZ = this.helicalRadius * Math.sin(thisHelicalAngle);

    this.snakeGeometry[i].position.x = this.positionArray[thisIndex].x + helicalR * Math.cos(thisNormal);
    this.snakeGeometry[i].position.y = this.positionArray[thisIndex].y + helicalR * Math.sin(thisNormal);
    this.snakeGeometry[i].position.z = helicalZ;
    this.snakeGeometryPair[i].position.x = this.positionArray[thisIndex].x - helicalR * Math.cos(thisNormal);
    this.snakeGeometryPair[i].position.y = this.positionArray[thisIndex].y - helicalR * Math.sin(thisNormal);
    this.snakeGeometryPair[i].position.z = -helicalZ;

  }  
  this.headIndex = newHead;
}

function animate(t) {

  //console.log(t,c);

  requestAnimationFrame( animate );

  var dt = t - lastTime;
  if (!dt){
    dt = 0;
  }
  lastTime = t;

  andy.update(dt);
  //gameLogic();

  /*var coll = collisions();
  var max = 0;
  while (coll && max < 10){
    collisions();
    max ++;
  }*/

  render();
  stats.update();
}

function collisions(){
  var coll = false;
  for (var i = -1; i < snake.body.length; i++){
    var x1,z1,x2,z2,dx,dz;
    var r = 50;
    if(i == -1){
      x1 = snake.head.position.x;
      z1 = snake.head.position.z;
    }else{
      x1 = snake.body[i].position.x;
      z1 = snake.body[i].position.z;            
    }
    for (var j = i+1; j < snake.body.length; j++){
      x2 = snake.body[j].position.x;
      z2 = snake.body[j].position.z;
      dx = Math.abs(x2 - x1);
      dz = Math.abs(z2 - z1);
      var l = Math.sqrt(dx*dx+dz*dz);
      if ( l < r){
        //collision
        if (i!=-1){
          snake.body[i].position.x = x1 - 0.25*dx*(1-r/l)/2;
          snake.body[i].position.z = z1 - 0.25*dz*(1-r/l)/2;
        } else{
          snake.head.position.x = x1 - 0.25*dx*(1-r/l)/2;
          snake.head.position.z = z1 - 0.25*dz*(1-r/l)/2;             
        }
        snake.body[j].position.x = x2 + 0.25*dx*(1-r/l)/2;
        snake.body[j].position.z = z2 + 0.25*dz*(1-r/l)/2;

        coll = true;
      }     
    }
  }
  return coll;
}

function updateSnake(dt) {
  if (snake.direction == "left"){
    snake.angle += snake.angle_acc;
  }else if (snake.direction == "right"){
    snake.angle -= snake.angle_acc;
  }

  var vx = Math.sin(snake.angle)*snake.speed*dt/16;
  var vz = Math.cos(snake.angle)*snake.speed*dt/16;
  
  snake.head.position.x += vx;
  snake.head.position.z += vz;
  var diff = 50;
  for (var i = snake.body.length-1; i >= 0; i--){
    var dx, dy, l, ux, uz;
    if (i == snake.body.length - 1){
      dx = snake.head.position.x - snake.body[i].position.x;
      dz = snake.head.position.z - snake.body[i].position.z;
    }else{          
      dx = snake.body[i+1].position.x - snake.body[i].position.x;
      dz = snake.body[i+1].position.z - snake.body[i].position.z;
    }
    l = Math.sqrt(dx*dx + dz*dz);
    ux = dx*diff/l;
    uz = dz*diff/l;

    if (i == snake.body.length - 1){
      snake.body[i].position.x = snake.head.position.x - ux;
      snake.body[i].position.z = snake.head.position.z - uz;
    }else{
      snake.body[i].position.x = snake.body[i+1].position.x - ux;
      snake.body[i].position.z = snake.body[i+1].position.z - uz;
    }
  }
}

function gameLogic(){
  var hp = snake.head.position;
  var dbp = deliciousBall.position;
  var dx = dbp.x-hp.x;
  var dz = dbp.z-hp.z;
  if (Math.sqrt(dx*dx + dz*dz) < 50){
    //got the ball!
    snake.angle = Math.atan2(dx,dz);
    snake.body.push(new THREE.Mesh(snake.body[0].geometry, snake.body[0].material));
    scene.add(snake.body[snake.body.length - 1]);
    //snake.body[snake.body.length - 1].rotation.set(Math.PI*1.5,0,0);
    snake.body[snake.body.length - 1].position.x = hp.x;
    snake.body[snake.body.length - 1].position.z = hp.z;
    snake.head.position.x = dbp.x;
    snake.head.position.z = dbp.z;
    deliciousBall.position.x = Math.random()*1000-500;
    deliciousBall.position.z = Math.random()*1000-500;
  }
}

function render() {
  var timer = Date.now() * 0.0001;

  //camera.rotation.x = Math.cos( timer ) * 200;
  camera.position.x = andy.positionArray[andy.headIndex].x;
  camera.position.y = andy.positionArray[andy.headIndex].y;
  //camera.lookAt( andy.snakeGeometry[0].position );



  renderer.render( scene, camera );

}


init();
animate();