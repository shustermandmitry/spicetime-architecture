import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Initialize 3D axes
const axesHelper = new THREE.AxesHelper(10); // X (red), Y (green), Z (blue)
scene.add(axesHelper);

// Create a sample node for Monorepo$LTS.Github$Alpha.2
const nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
node.position.set(1, 2, 2); // X=1, Y=2, Z=2
scene.add(node);

// Create links (dependencies)
const dependencyMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const dependencyGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(1, 2, 2), // Source (current package)
  new THREE.Vector3(1, 2, 1), // Target (previous patch version)
]);
const dependencyLine = new THREE.Line(dependencyGeometry, dependencyMaterial);
scene.add(dependencyLine);

// Add a camera and renderer for interaction (simplified)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();