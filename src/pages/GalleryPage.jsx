import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import axios from 'axios';

const VirtualGallery = () => {
    const canvasRef = useRef(null);
    const infoCardRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const api = 'https://pixelated-canvas.onrender.com';
        const userID = urlParams.get('Id');

        console.log("API:", api);
        console.log("Buyer ID:", userID);

        const FRONT_WALL = -79.6;
        const GAP_BETWEEN_PAINTINGS = 30;
        const PAINTING_LEVEL = 12;
        const MIN_WALL_X = -59;
        const MAX_WALL_X = 59;
        let currentSideWallLimit = 120;
        const SIDE_WALL_EXTENSION_SIZE = 180;
        let galleryPaintings = [];
        let back = 50;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffffff, 1);
        camera.position.set(0, 2, 15);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const controls1 = new PointerLockControls(camera, document.body);
        document.addEventListener("click", () => {
            if (!controls1.isLocked) controls1.lock();
        });

        document.addEventListener("keydown", (event) => {
            const keycode = event.which;
            if (keycode === 39 || keycode === 68) controls1.moveRight(0.75);
            else if (keycode === 37 || keycode === 65) controls1.moveRight(-0.75);
            else if (keycode === 38 || keycode === 87) controls1.moveForward(0.75);
            else if (keycode === 40 || keycode === 83) controls1.moveForward(-0.75);
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const textureLoader = new THREE.TextureLoader();
        const floorTexture = textureLoader.load("./images/floor.png");
        const wallTexture = textureLoader.load("./images/painted Wall.avif");
        const ceilingTexture = textureLoader.load("./images/ceilingFinal2.jpg");

        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
        const floorGeometry = new THREE.PlaneGeometry(120, 180);

        const createFloor = (z) => {
            const mesh = new THREE.Mesh(floorGeometry, floorMaterial);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.y = -0.1;
            mesh.position.z = z;
            scene.add(mesh);
        };
        createFloor(0);

        const wallGroup = new THREE.Group();
        const createWall = (w, h, x, y, z, rotY) => {
            const wall = new THREE.Mesh(
                new THREE.PlaneGeometry(w, h),
                new THREE.MeshBasicMaterial({ map: wallTexture, side: THREE.DoubleSide })
            );
            wall.position.set(x, y, z);
            wall.rotation.y = rotY;
            wallGroup.add(wall);
        };

        createWall(120, 40, 0, 9, -80, 0);
        createWall(180, 40, -60, 9, 0, Math.PI / 2);
        createWall(180, 40, 60, 9, 0, -Math.PI / 2);
        scene.add(wallGroup);

        const createCeiling = (z) => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(120, 180),
                new THREE.MeshBasicMaterial({ map: ceilingTexture, side: THREE.DoubleSide })
            );
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = 29;
            mesh.position.z = z;
            scene.add(mesh);
        };
        createCeiling(0);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 100, 0);
        scene.add(light);

        const bounds = { left: -59, right: 59, top: 10, bottom: 4, front: -79 };

        const mountAllPaintings = () => {
            let pX = -55, pZl = -55, pZr = -55, isLeft = false;

            galleryPaintings.forEach((painting) => {
                const width = painting?.dimensions?.width * 3 || 10;
                const height = painting?.dimensions?.height * 3 || 10;
                const paintingTexture = new THREE.TextureLoader().load(painting.file);
                const paintingMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, height),
                    new THREE.MeshBasicMaterial({ map: paintingTexture })
                );

                if (pX + GAP_BETWEEN_PAINTINGS + width < MAX_WALL_X) {
                    pX += GAP_BETWEEN_PAINTINGS;
                    paintingMesh.position.set(pX, PAINTING_LEVEL, FRONT_WALL);
                    pX += GAP_BETWEEN_PAINTINGS + width;
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

        const updatePaintingInfo = () => {
            let paintingToShow = null;
            const threshold = 30;

            scene.children.forEach((obj) => {
                if (obj.userData && obj.userData.position) {
                    const dist = camera.position.distanceTo(obj.userData.position);
                    if (dist < threshold) paintingToShow = obj;
                }
            });

            if (paintingToShow && infoCardRef.current) {
                const { title, description, category, _id } = paintingToShow.userData;
                infoCardRef.current.innerHTML = `
                    <h1>${title}</h1>
                    <h2>${category}</h2>
                    <p>${description}</p>
                    <button id="buyBtn" class="buyBtn">Buy Now</button>
                `;
                infoCardRef.current.dataset.paintingId = _id;
                infoCardRef.current.style.display = 'block';
                // Add click listener after DOM update
                setTimeout(() => {
                  const buyBtn = document.getElementById("buyBtn");
                  if (buyBtn) {
                      buyBtn.onclick = () => {
                          const paintingId = infoCardRef.current.dataset.paintingId;
                          if (paintingId && api && userID) {
                              window.location.href = `/paintings/paintingpost/${paintingId}?buyerId=${userID}`;
                          }
                      };
                  }
              }, 0);
            } else if (infoCardRef.current) {
                infoCardRef.current.innerHTML = '';
                infoCardRef.current.dataset.paintingId = '';
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.left, bounds.right);
            camera.position.y = THREE.MathUtils.clamp(camera.position.y, bounds.bottom, bounds.top);
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.front, back);
            updatePaintingInfo();
            renderer.render(scene, camera);
        };

        const fetchGalleryPaintings = async () => {
            try {
                const res = await axios.get(`${api}/forgallery/allpaintings`);
                galleryPaintings = res.data.fetchedPaintings;
                mountAllPaintings();
            } catch (err) {
                console.error("❌ Fetch error:", err);
            }
        };

        fetchGalleryPaintings();
        animate();
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} />
            <div
                ref={infoCardRef}
                id="info-card"
                style={{
                  display: 'none',
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  padding: '10px',
                  minHeight: '100px',
                  minWidth: '300px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  borderRadius: '5px',
                  fontFamily: 'Arial, sans-serif',
                  zIndex: 100
                }}
            ></div>
        </div>
    );
};

export default VirtualGallery;
