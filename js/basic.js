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

  //directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff, .5);
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = 0.5;
  scene.add(directionalLight);

  var spotLigh = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
  spotLigh.position.set(0,100,0);
  scene.add(spotLigh);
  scene.add(new THREE.PointLightHelper(spotLigh, 1));


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
  var numTextures = 13;
  for (var i = 0; i < numTextures; i++) {
    createTextureCube('textures/' + i + '.jpg', 3, i*6, 0, 0);
  }
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

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();

}



function render() {
  cubes.rotation.y += 0.01;


  // cube.rotation.y += 0.05;
  // cube.rotation.x += 0.01;
  renderer.render(scene, camera);
  // stats.update();
}
