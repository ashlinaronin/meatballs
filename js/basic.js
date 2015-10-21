var scene, camera, renderer, loader, mesh, material, cube;
var group;

init();
render();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

  // Move back a little bit so the cube isn't in our face!!
  camera.position.z = 5;

  // Set background to have transparency- alpha: true
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("viewport").appendChild(renderer.domElement);

  //directional lighting
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  //ambient lighting
  var ambientLight = new THREE.AmbientLight(0xbbbbbb);
  scene.add(ambientLight);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var loader = new THREE.TextureLoader();

  loader.load(
    'img/tex.jpg',
    function(texture) {
      material = new THREE.MeshBasicMaterial({ map: texture });
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


function render() {
  requestAnimationFrame(render);
  cube.rotation.y += 0.05;
  renderer.render(scene, camera);
}
