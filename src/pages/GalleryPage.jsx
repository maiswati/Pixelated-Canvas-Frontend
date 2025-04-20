import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const VirtualGallery = () => {
    const [userID, setUserID] = useState(null);
    const infoCardRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('Id');
        setUserID(userID);

        // Setup for Three.js scene, camera, renderer, and painting logic here
        const api = 'https://pixelated-canvas.onrender.com';

        // Placeholder for scene setup and render loop
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Placeholder function to update the painting info
        const updatePaintingInfo = () => {
            let paintingToShow = null;
            const threshold = 30;

            // Placeholder code to check proximity of camera and painting objects
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
                    <button class="buyBtn" data-painting-id="${_id}">Buy Now</button>
                `;
                infoCardRef.current.style.display = 'block';
            } else if (infoCardRef.current) {
                infoCardRef.current.innerHTML = '';
                infoCardRef.current.style.display = 'none';
            }
        };

        // Set up the Three.js scene rendering logic (camera, rendering, etc.)
        // You will need to set up the renderer, camera, and other Three.js objects here

        // Event delegation for handling button clicks
        const handleBuyNow = (event) => {
            const button = event.target;
            if (button && button.classList.contains('buyBtn')) {
                const paintingId = button.dataset.paintingId;
                if (paintingId && userID) {
                    navigate(`/paintings/paintingpost/${paintingId}?buyerId=${userID}`);
                }
            }
        };

        // Add event listener for button clicks
        document.addEventListener('click', handleBuyNow);

        // Cleanup event listener when component is unmounted
        return () => {
            document.removeEventListener('click', handleBuyNow);
        };

    }, [navigate, userID]);

    return (
        <div style={{ height: '100vh', backgroundColor: 'black' }}>
            <div ref={infoCardRef} style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                backgroundColor: 'white', padding: '20px', borderRadius: '10px', display: 'none'
            }}></div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default VirtualGallery;
