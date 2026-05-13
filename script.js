// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Three.js setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background-container').appendChild(renderer.domElement);

    // Create random wireframe shapes
    const shapes = [];
    const shapeTypes = [
        () => new THREE.BoxGeometry(1, 1, 1),
        () => new THREE.TetrahedronGeometry(1),
        () => new THREE.OctahedronGeometry(1),
        () => new THREE.IcosahedronGeometry(1),
        () => new THREE.DodecahedronGeometry(1)
    ];

    for (let i = 0; i < 20; i++) {
        const geometry = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]();
        // Scale randomly between 0.5 and 2
        const scale = 0.5 + Math.random() * 1.5;
        geometry.scale(scale, scale, scale);

        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        // Random position
        mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        // Random rotation and drift speed
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            driftSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            }
        };

        scene.add(mesh);
        shapes.push(mesh);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        shapes.forEach(shape => {
            // Rotate
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Slow drift
            shape.position.x += shape.userData.driftSpeed.x;
            shape.position.y += shape.userData.driftSpeed.y;
            shape.position.z += shape.userData.driftSpeed.z;

            // Wrap around if goes too far
            if (Math.abs(shape.position.x) > 15) shape.position.x = (Math.random() - 0.5) * 20;
            if (Math.abs(shape.position.y) > 15) shape.position.y = (Math.random() - 0.5) * 20;
            if (Math.abs(shape.position.z) > 15) shape.position.z = (Math.random() - 0.5) * 20;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});