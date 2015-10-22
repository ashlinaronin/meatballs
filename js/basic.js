// if (!Detector.webgl) Detector.addGetWebGLMessage();

var viewport, stats;

var scene, camera, renderer, loader, mesh, material, cube;
var group;
var cubes;
var loader;

init();
animate();

scene.traverse (function (object)
{
    if (object instanceof THREE.Mesh)
    {
        console.log(object.name);

    }
});

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  // camera.aspect = window.innerWidth / window.innerHeight;

  // Move back a little bit so the cube isn't in our face!!
  camera.position.z = 15;
  scene.add(camera);


  cubes = new THREE.Group();
  scene.add(cubes);

  controls = new THREE.OrbitControls(camera);
  // controls.addEventListener('change', render);
  loader = new THREE.TextureLoader();

  // Directional light
  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
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
  var spotLight = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
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

  // Create 13 texture cubes from jpgs in textures folder and put them in a row
  var numTextures = 1;
  var min = 0;
  var max = 27;
  for (var i = 0; i < numTextures; i++) {
    var xval = getRandomInt(min, max);
    var yval = getRandomInt(min, max);
    var zval = getRandomInt(min, max);
    // createTextureCube('textures/' + i + '.jpg', 9, xval, yval, zval);
    createTextureCube('textures/' + i + '.jpg', 9, 0, 0, 0);
  }
}

/*
** Returns a random integer between min (inclusive) and max (inclusive).
** Thanks to MDN.
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Create a cube with the given size, texture url and position.
// Add it to the cubes group.
function createTextureCube(textureUrl, size, xpos, ypos, zpos) {
  loader.load(
    textureUrl,
    function(texture) {
      var newGeometry = new THREE.BoxGeometry(size, size, size);
      var newMaterial = new THREE.MeshPhongMaterial({ map: texture });
      var newCube = new THREE.Mesh(newGeometry, newMaterial);
      cubes.add(newCube);
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


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// Can do something with keydown here
function onKeyDown (event) {
	switch ( event.keyCode ) {
		case 72: // h
		  // hemiLight.visible = !hemiLight.visible;
      console.log("h pressed");
  		break;

		case 68: // d
		  // dirLight.visible = !dirLight.visible;
      console.log("d pressed");
  		break;
	}
}




function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}


function render() {
  // cubes.rotation.y += 0.01;

  // Don't run it the first time to avoid an error
  if (cubes.children[0]) {
    cubes.children[0].rotation.y += 0.01;
  }

  if (cubes.children[1]) {
    cubes.children[1].rotation.y += 0.02;
  }

  if (cubes.children[2]) {
    cubes.children[2].rotation.y += 0.05;
  }

  renderer.render(scene, camera);
}
