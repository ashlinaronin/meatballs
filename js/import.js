// if (!Detector.webgl) Detector.addGetWebGLMessage();

var viewport, stats;

var scene, camera, renderer, loader, mesh, material, cube, controls;

var dirLight, spotLight, ambientLight;

// Need to add event listener here
document.addEventListener('keydown', onKeyDown, false);


// var group;
// change cubes to be array of objects, not a group
var cubes = [];
var spheres = [];
var blobs = [];
var loader;

init();
animate();


function init() {
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
  scene.fog = new THREE.FogExp2( 0x111111, 0.0025 );

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.aspect = window.innerWidth / window.innerHeight;

  // camera.updateProjectionMatrix();
  // Move back a little bit so the cube isn't in our face!!
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;

  // now trying to add camera as child of object so it tracks it
  scene.add(camera);

  // Not using a Group anymore
  // cubes = new THREE.Group();
  // scene.add(cubes);

  // controls = new THREE.TrackballControls(camera);
  // controls = new THREE.OrbitControls(camera);
  // controls.addEventListener('change', render);
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  controls.addEventListener( 'change', render );




  loader = new THREE.TextureLoader();

  // Ambient light
  ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);



  // Directional light
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-1, 1.75, 1);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 50;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;



  // Ground
  var groundGeo = new THREE.PlaneBufferGeometry(10000,10000);
  var groundMat = new THREE.MeshPhongMaterial({color: 0x111111, specular: 0x050505});
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -33;
  scene.add(ground);
  ground.receiveShadow = true;




  // Spotlight
  spotLight = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
  spotLight.position.set(0,100,0);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  scene.add(spotLight);
  scene.add(new THREE.PointLightHelper(spotLight, 1));


  // Set background to have transparency- alpha: true
  renderer = new THREE.WebGLRenderer({ antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapType = THREE.PCFSoftShadowMap;

  viewport = document.getElementById("viewport").appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  document.getElementById("container").appendChild(stats.domElement);

  window.addEventListener('resize', onWindowResize, false);






  // Texture
  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  }

  var texture = new THREE.Texture();

  // Define onProgress and onError callbacks to use in loaders later
  // xhr = XML HTTP Request
  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  // Do nothing on error?
  var onError = function(xhr) {
  };

  // Create a new loader using the LoadingManager we created above
  // Then load the texture
  var loader = new THREE.ImageLoader(manager);
  loader.load('faces/3.jpg', function(image) {
    texture.image = image;
    texture.needsUpdate = true;
  });

  // Create a new loader using the LoadingManager
  // Overwrite the previous loader because we don't need it anymore
  var loader = new THREE.OBJLoader(manager);
  loader.load('new_meatballs/0.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial();
        // child.material.map = texture;
      }
    });
    // object.scale.set(9,9,9);
    // object.scale.x = 30;
    // object.scale.y = 30;
    // object.scale.z = 30;

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;
    scene.add(object);
    blobs.push(object);
    // object.add(camera);
  }, onProgress, onError); // Attach error, progress callbacks we defined above

  // var meatballCallback = function(geo) {
  //   // using texture global here
  //   console.log(texture);
  //   var meatball = new THREE.Mesh(geo, texture);
  //   meatball.position.set(0,0,0);
  //   meatball.scale.set(3,3,3);
  //   scene.add(meatball);
  //   debugger;
  // }
  //
  //
  // var loader = new THREE.JSONLoader();
  // loader.load('meatballs-js/meatball1.js', meatballCallback);



  // axes = buildAxes(1000);
  // scene.add(axes);





























} // end init

/*
** Returns a random integer between min (inclusive) and max (inclusive).
** Thanks to MDN.
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// From soledadpenades.com
// function buildAxes( length ) {
//   var axes = new THREE.Object3D();
//
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
//   axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
//
//   return axes;
// }
//
// // from soledadpenades.com
// function buildAxis( src, dst, colorHex, dashed ) {
//   var geom = new THREE.Geometry(),
//       mat;
//
//   if(dashed) {
//           mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
//   } else {
//           mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
//   }
//
//   geom.vertices.push( src.clone() );
//   geom.vertices.push( dst.clone() );
//   geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
//
//   var axis = new THREE.Line( geom, mat, THREE.LineSegments );
//
//   return axis;
// }


// Create a cube with the given size, texture url and position.
// Add it to the cubes group.
function createTextureCube(textureUrl, size, xpos, ypos, zpos) {
  loader.load(
    textureUrl,
    function(texture) {
      var newGeometry = new THREE.BoxGeometry(size, size, size);
      var newMaterial = new THREE.MeshPhongMaterial({ map: texture });
      var newCube = new THREE.Mesh(newGeometry, newMaterial);
      scene.add(newCube);
      cubes.push(newCube);
      newCube.position.x = xpos;
      newCube.position.y = ypos;
      newCube.position.z = zpos;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(xhr) {
      console.log('An error happened while loading texture images.');
    }
  );
}

// Create a sphere with the given texture url and position.
// Add it to the spheres group.
function createTextureSphere(textureUrl, xpos, ypos, zpos) {
  loader.load(
    textureUrl,
    function(texture) {
      var newGeometry = new THREE.SphereGeometry(5,32,32);
      var newMaterial = new THREE.MeshPhongMaterial({ map: texture });
      var newSphere = new THREE.Mesh(newGeometry, newMaterial);
      scene.add(newSphere);
      spheres.push(newSphere);
      newSphere.position.x = xpos;
      newSphere.position.y = ypos;
      newSphere.position.z = zpos;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(xhr) {
      console.log('An error happened while loading texture images.');
    }
  );
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
  render();
}

// Can do something with keydown here
function onKeyDown (event) {
	switch ( event.keyCode ) {
		case 83: // s
		  spotLight.visible = !spotLight.visible;
  		break;

		case 68: // d
		  dirLight.visible = !dirLight.visible;
  		break;

    case 67: // c
      console.log('camX: ' + camera.position.x);
      console.log('camY: ' + camera.position.y);
      console.log('camZ: ' + camera.position.z);
      break;
    case 79: // o
      console.log('meatX: ' + blobs[0].position.x);
      console.log('meatY: ' + blobs[0].position.y);
      console.log('meatZ: ' + blobs[0].position.z);

      break;
	}
}




function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();
  stats.update();
}


function render() {
  // for (var i = 0; i < cubes.length; i++) {
  //   console.log('cubes');
    // cubes[0].rotation.y += 0.01;
    // cubes[i].rotation.y += (i * 0.01);
  // }
  var rotateAngle = 0.05;

  for (var i = 0; i < spheres.length; i++) {
    // console.log('cubes');
    // cubes[0].rotation.y += 0.01;
    spheres[i].rotation.y += (i * 0.01);
  }

  // Don't try to rotate it first time before cube is created
  if (cubes[0]) {
    cubes[0].rotation.y += 0.008;
  }

  if (spheres[0]) {
    spheres[0].rotation.y += 0.01;
  }

  if (blobs[0]) {
    // blobs[0].rotation.y += 0.01;
    // blobs[0].rotation.x += 0.002;
    // var rotation_matrix = new THREE.Matrix4().makeRotationZ(rotateAngle);
    // blobs[0].matrix.multiplySelf(rotation_matrix);
    // blobs[0].setEulerFromRotationMatrix(blobs[0].matrix);
  }

  renderer.render(scene, camera);
}
