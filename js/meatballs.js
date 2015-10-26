if (!Detector.webgl) Detector.addGetWebGLMessage();

// Declare all the variables we'll be using so they can be accessed
// from many functions
var viewport, stats, scene, camera, renderer, loader, controls, manager;
var meatTexture, ground;
var ambientLight, orangeLight, redLight, greenLight;

// Bind keydown event listener for lighting controls
document.addEventListener('keydown', onKeyDown, false);

// Bind the onWindowResize function as an event listener so the viewport
// is updated if the user resizes the window
window.addEventListener('resize', onWindowResize, false);


// change cubes to be array of objects, not a group
var meatballs = [];
var pumpkin;
var loader;

init();
animate();

/* Define the scene, camera, controls, lights, ground plane, stats bar and
** LoadingManager. Then initialize the meatballs and pumpkin. */
function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x111111, 0.0025 );


  // Create a camera and move it back a bit so we can see the action
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;
  scene.add(camera);

  // Create TrackballControls
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render );


  // Ambient light
  ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Point lights -- they point at the origin by default, which is fine for us
  var intensity = 2.5;
  var distance = 100;
  var orange = 0xffa500; // orange
  var red = 0xff0000; // red
  var green = 0x00ff00; // green

  orangeLight = new THREE.PointLight(orange, intensity, distance);
  orangeLight.position.set(0,-25,0);
  scene.add(orangeLight);

  redLight = new THREE.PointLight(red, intensity, distance);
  redLight.position.set(100,0,0);
  scene.add(redLight);

  greenLight = new THREE.PointLight(green, intensity, distance);
  greenLight.position.set(-100,0,0);
  scene.add(greenLight);



  // Create the ground plane
  var groundGeo = new THREE.PlaneBufferGeometry(10000,10000);
  var groundMat = new THREE.MeshPhongMaterial(
    {
      color: 0x111111,
      specular: 0x050505,
      shininess: 30
    }
  );
  ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -33;
  ground.receiveShadow = true;
  scene.add(ground);


  // Set up WebGL renderer scaled to window size
  // If user doesn't have WebGL, try using canvas renderer
  renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Create the viewport to display the scene and attach it to the DOM
  viewport = document.getElementById("viewport").appendChild(renderer.domElement);


  // Attach an fps display -- Stats library also created by MrDoob
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  document.getElementById("container").appendChild(stats.domElement);



  // Create a LoadingManager to manage the loading of image textures
  manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  }

  // Load meat texture with an ImageLoader using our ol' LoadingManager
  // When the texture is loaded, create the initial objects
  meatTexture = new THREE.Texture();
  var imgLoader = new THREE.ImageLoader(manager);
  imgLoader.load('textures/meatball-sq.jpg', function(image) {
    meatTexture.image = image;
    meatTexture.needsUpdate = true;

    createInitialObjects();
  });

} // end init


// Encapsulate initial object creation to make sure the texture loads first.
function createInitialObjects() {
  // Make punkin sun before meatball planets
  createMeatball('meatballs-obj/pumpkin.obj', 1, 0, 0, 0);

  // Create numMeatballs meatballs with random coords and sizes
  var numMeatballs = 10;
  var meatballMaxSize = 50;
  for (var i = 0; i < numMeatballs; i++) {
    var xpos = getRandomInt(0, meatballMaxSize);
    var ypos = getRandomInt(0, meatballMaxSize);
    var zpos = getRandomInt(0, meatballMaxSize);
    var size = getRandomInt(1,5);
    createMeatball('meatballs-obj/' + i + '.obj', size, xpos, ypos, zpos);
  }
}


/*
** Returns a random integer between min (inclusive) and max (inclusive).
** Thanks to MDN.
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Define onProgress and onError callbacks to use in loaders later
// xhr = XML HTTP Request
var onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
}

var onError = function(xhr) {
  console.log("Error loading texture image.");
};


/* Create a new meatball with the given size, geometry url, and position.
** Load it from OBJ models exported from 3DS Max.
** Add it to the meatballs array or pumpkin, as the case may be. */
function createMeatball(geometryUrl, size, xpos, ypos, zpos) {
  var loader = new THREE.OBJLoader(manager);
  loader.load(geometryUrl, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {

        // Create a material to hold the meat texture
        child.material = new THREE.MeshPhongMaterial(
          {
            specular: 0xffffff,
            metal: true,
            map: meatTexture,
            shininess: 1,
            shading: THREE.SmoothShading
          }
        );

      }
    }); // end object traverse

    // Set size and position of new blob and add it to the scene
    object.scale.set(size, size, size);
    object.position.x = xpos;
    object.position.y = ypos;
    object.position.z = zpos;
    scene.add(object);

    // If it's the pumpkin, add it to global pumpkin, else add to meatballs array
    if (geometryUrl == 'meatballs-obj/pumpkin.obj') {
      pumpkin = object;
    } else {
      meatballs.push(object);
    }
  }, onProgress, onError); // Attach error, progress callbacks we defined above
}



// Event handler for window being resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
  render();
}

// Toggle visibility of lights with letter keys
function onKeyDown (event) {
	switch ( event.keyCode ) {
    case 65: // a toggles visibility of ambient light
      ambientLight.visible = !ambientLight.visible;
      break;

		case 79: // o toggles visibility of orange light
		  orangeLight.visible = !orangeLight.visible;
  		break;

		case 82: // r toggles visibility of red light
		  redLight.visible = !redLight.visible;
  		break;

    case 71: // g toggles visibility of green light
      greenLight.visible = !greenLight.visible;
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
  // Rotate meatballs at different rates
  for (var i = 0; i < meatballs.length; i++) {
    if (i === 0) {
      meatballs[i].rotation.y += 0.005;
    } else {
      meatballs[i].rotation.y += (i * 0.005);
    }
  }

  // Rotate the pumpkin very slowly
  // Don't run until it has been created
  if (pumpkin) {
    pumpkin.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}
