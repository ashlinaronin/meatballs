// if (!Detector.webgl) Detector.addGetWebGLMessage();

var viewport, stats;

var scene, camera, renderer, loader, mesh, material, cube;
var group;

init();
render();


function init() {

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  // camera.aspect = window.innerWidth / window.innerHeight;

  // Move back a little bit so the cube isn't in our face!!
  camera.position.z = 25;

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  scene = new THREE.Scene();

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


  var geometry = new THREE.BoxGeometry(3, 3, 3);
  var loader = new THREE.TextureLoader();

  loader.load(
    'img/tex.jpg',
    function(texture) {
      material = new THREE.MeshPhongMaterial({ map: texture });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(xhr) {
      console.log('An error happened');
    }
  );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render() {
  requestAnimationFrame(render);
  // cube.rotation.y += 0.05;
  // cube.rotation.x += 0.01;
  renderer.render(scene, camera);
  stats.update();
}
