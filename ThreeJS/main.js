import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import axios from 'axios';

const urlParams = new URLSearchParams(window.location.search);
const api = urlParams.get('api');

console.log("✅ Script Loaded");
const userID = urlParams.get("Id");
console.log(`Buyer ID Special butter marke: ${userID}`);

// Global Variables
const FRONT_WALL = -79.6;
const GAP_BETWEEN_PAINTINGS = 30;
const PAINTING_LEVEL = 12;
const MIN_WALL_X = -59;
const MAX_WALL_X = 59;
let currentSideWallLimit = 120;
const SIDE_WALL_EXTENSION_SIZE = 180;

let galleryPaintings = [];

// 🎨 Fetch Artwork Data from Backend
const fetchGalleryPaintings = async () => {
    try {
        console.log("📡 Fetching paintings...");
        const response = await axios.get(`${api}/forgallery/allpaintings`);
        galleryPaintings = response.data.fetchedPaintings;

        if (!galleryPaintings || galleryPaintings.length === 0) {
            console.warn("⚠ No paintings found!");
            return;
        }

        console.log("✅ Paintings fetched:", galleryPaintings);
        mountAllPaintings();
    } catch (error) {
        console.error("❌ Error fetching paintings:", error);
    }
};

// 🎭 Scene Setup
console.log("🎭 Setting up scene...");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const canvasContainer = document.getElementById("container");
if (!canvasContainer) {
    console.error("❌ Canvas container not found!");
}

const renderer = new THREE.WebGLRenderer({ canvas: canvasContainer, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 1);

console.log("✅ Scene initialized");

// Camera Position
camera.position.set(0, 2, 15);

// 🎮 Pointer Lock Controls
const controls1 = new PointerLockControls(camera, document.body);

document.addEventListener("click", () => {
    if (!controls1.isLocked) {
        controls1.lock();
    }
});
controls1.addEventListener("lock", () => {
    console.log("🔒 Pointer Lock activated");
});
controls1.addEventListener("unlock", () => {
    console.log("🔓 Pointer Lock deactivated");
});

document.addEventListener("keydown", onKeyDown, false);
function onKeyDown(event) {
    const keycode = event.which;

    if (keycode === 39 || keycode === 68) {
        controls1.moveRight(0.75);
    } else if (keycode === 37 || keycode === 65) {
        controls1.moveRight(-0.75);
    } else if (keycode === 38 || keycode === 87) {
        controls1.moveForward(0.75);
    } else if (keycode === 40 || keycode === 83) {
        controls1.moveForward(-0.75);
    }
}

// 🕹 Controls
console.log("🎮 Initializing controls...");
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enableZoom = true;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;
console.log("✅ Controls initialized");

// 🚪 Gallery Walls & Ceiling
console.log("🧱 Loading textures...");
const textureLoader = new THREE.TextureLoader();

// FLOOR
let floorTexture;
try {
    floorTexture = textureLoader.load("./img/floor.png");
    console.log("✅ Floor texture loaded");
} catch (error) {
    console.error("❌ Error loading floor texture:", error);
}

const floorGeometry = new THREE.PlaneGeometry(120, 180);
const floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
});

const createFloor = (z) => {
    const floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.y = -0.1;
    floorPlane.position.z = z;
    scene.add(floorPlane);
};

createFloor(0);
console.log("✅ Floor added");

// WALL
const wallGroup = new THREE.Group();
let wallTexture;
try {
    wallTexture = textureLoader.load("./img/painted Wall.avif");
    console.log("✅ Wall texture loaded");
} catch (error) {
    console.error("❌ Error loading wall texture:", error);
}

const createWall = (width, height, x, y, z, rotationY) => {
    const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.DoubleSide })
    );
    wall.position.set(x, y, z);
    wall.rotation.y = rotationY;
    wallGroup.add(wall);
};

createWall(120, 40, 0, 9, -80, 0);
createWall(180, 40, -60, 9, 0, Math.PI / 2);
createWall(180, 40, 60, 9, 0, -Math.PI / 2);
scene.add(wallGroup);
console.log("✅ Walls added");

// CEILING
const ceilingTexture = textureLoader.load("./img/ceilingFinal2.jpg");
const ceilingGeometry = new THREE.PlaneGeometry(120, 180);
const ceilingMaterial = new THREE.MeshBasicMaterial({
    map: ceilingTexture,
    side: THREE.DoubleSide,
});

const createCeiling = (z) => {
    const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingPlane.rotation.x = Math.PI / 2;
    ceilingPlane.position.y = 29;
    ceilingPlane.position.z = z;
    scene.add(ceilingPlane);
};

createCeiling(0);
console.log("✅ Ceiling added");

// 🔦 Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 100, 0);
scene.add(light);
console.log("✅ Lighting added");

// Bounds
const bounds = {
    left: -59,
    right: 59,
    top: 10,
    bottom: 4,
    front: -79,
};
let back = 50;

// 🎥 Animation Loop
function animate() {
    requestAnimationFrame(animate);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.left, bounds.right);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, bounds.bottom, bounds.top);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.front, back);
    updatePaintingInfo();
    renderer.render(scene, camera);
}

console.log("🎬 Starting animation loop...");
animate();

const mountAllPaintings = () => {
    let pX = -55;
    let pZl = -55;
    let pZr = -55;
    let isLeft = false;
    console.log("🖼 Mounting paintings...", galleryPaintings);

    if (!galleryPaintings || galleryPaintings.length === 0) {
        console.warn("⚠ No paintings to mount!");
        return;
    }

    galleryPaintings.forEach((painting, index) => {
        console.log(`🖼 Processing painting #${index + 1}:`, painting);

        const width = painting?.dimensions?.width * 3 || 10;
        const height = painting?.dimensions?.height * 3 || 10;

        // const encodedFileName = encodeURIComponent(painting.file);
        const imageUrl = `${painting.file}`;
        const paintingTexture = new THREE.TextureLoader().load(imageUrl);
        const paintingGeometry = new THREE.PlaneGeometry(width, height);
        const paintingMaterial = new THREE.MeshBasicMaterial({
            map: paintingTexture
        });
        const paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);

        if (pX + GAP_BETWEEN_PAINTINGS + width < MAX_WALL_X) {
            pX += GAP_BETWEEN_PAINTINGS;
            paintingMesh.position.set(pX, PAINTING_LEVEL, FRONT_WALL);
            pX += GAP_BETWEEN_PAINTINGS + width;
            console.log("✅ Paintings added to scene");
        } else {
            isLeft = !isLeft;
            if (isLeft) {
                pZl += GAP_BETWEEN_PAINTINGS;
                paintingMesh.position.set(MIN_WALL_X, PAINTING_LEVEL, pZl);
                paintingMesh.rotateY(Math.PI / 2);
                pZl += width;
            } else {
                pZr += GAP_BETWEEN_PAINTINGS;
                paintingMesh.position.set(MAX_WALL_X, PAINTING_LEVEL, pZr);
                paintingMesh.rotateY(-Math.PI / 2);
                pZr += width;

                if (pZr >= currentSideWallLimit) {
                    console.log("🚧 Wall is being extended...");
                    createWall(180, 40, -60, 9, currentSideWallLimit + 60, Math.PI / 2);
                    createWall(180, 40, 60, 9, currentSideWallLimit + 60, -Math.PI / 2);
                    scene.add(wallGroup);
                    createCeiling(currentSideWallLimit + 60);
                    createFloor(currentSideWallLimit + 60);
                    currentSideWallLimit += SIDE_WALL_EXTENSION_SIZE;
                    back = (SIDE_WALL_EXTENSION_SIZE + 70);
                }
            }
        }

        const { title, description, category, _id } = painting;
        paintingMesh.userData = { title, description, category, _id, position: paintingMesh.position.clone() };
        scene.add(paintingMesh);
    });
};

const threshold = 30;
function updatePaintingInfo() {
    let paintingToShow = null;

    scene.children.forEach((artwork) => {
        if (artwork.userData && artwork.userData.position) {
            const distanceToPainting = camera.position.distanceTo(artwork.userData.position);
            if (distanceToPainting < threshold) {
                paintingToShow = artwork;
            }
        }
    });

    const infoEl = document.getElementById("info-card");

    if (paintingToShow) {
        if (!infoEl.dataset.paintingId || infoEl.dataset.paintingId !== paintingToShow.userData._id) {
            infoEl.innerHTML = `
                <h1>${paintingToShow.userData.title}</h1>
                <h2>${paintingToShow.userData.category}</h2>
                <p>${paintingToShow.userData.description}</p>
                <button id="buyBtn" class="buyBtn">Buy Now</button>
            `;
            infoEl.dataset.paintingId = paintingToShow.userData._id;
        }

        infoEl.style.display = "block";

        const buyBtn = document.getElementById("buyBtn");

        if (buyBtn) {
            buyBtn.onclick = function () {
                console.log("✅ Buy button clicked for:", paintingToShow.userData);

                if (!paintingToShow?.userData?._id) {
                    console.error("❌ Painting ID is undefined!");
                    return;
                }

                localStorage.setItem("paintingData", JSON.stringify(paintingToShow));
                window.location.href = `http://localhost:5000/paintings/paintingpost/${paintingToShow.userData._id}?buyerId=${userID}`;
            };
        } else {
            console.error("❌ Buy button not found in the DOM");
        }
    } else {
        infoEl.style.display = "none";
    }
}

// Fetch paintings on page load
window.addEventListener("DOMContentLoaded", fetchGalleryPaintings);