let ramp, stairs;
let camera, renderer, scene;
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
let velocity = new THREE.Vector3();
let rotationSpeed = 0.02; // velocidade da rotação
let prevTime = performance.now();

function init() {
    // Criar cena
    scene = new THREE.Scene();
    
    // Criar e posicionar a câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Criar renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Adicionar plano para grama
    const grassTexture = new THREE.TextureLoader().load('texturas/grama.jpg'); 
    const grassMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
    const grassGeometry = new THREE.PlaneGeometry(500, 500); // Aumente o tamanho conforme necessário
    grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2; // Rotação para deixar o plano horizontal
    grass.position.y = -0.5; // Ajuste a posição y conforme necessário
    scene.add(grass);

    // Adicionar esfera para o céu
    const skyTexture = new THREE.TextureLoader().load('texturas/ceu.jpg'); 
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Adicione luz para melhorar a visualização das texturas
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);


    // Adicionar rampa
    const rampGeometry = new THREE.BoxGeometry(5, 1, 10);
    const rampMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.rotation.x = -0.5; // Inclinação da rampa
    ramp.position.set(-5, 0, 0);
    scene.add(ramp);

    // Adicionar escadas
    const stairsGeometry = new THREE.BoxGeometry(5, 1, 10);
    const stairsMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    stairs = new THREE.Mesh(stairsGeometry, stairsMaterial);
    stairs.position.set(5, 0, 0);
    scene.add(stairs);

    // Posicao da camera de um cadeirante
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0); // Altura da câmera simula a altura de uma pessoa sentada

    // Event listeners para teclado
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Animação (loop de renderização)
    animate();
}

// Função para atualizar a posição da câmera
function moveCamera(deltaTime) {
    velocity.z -= velocity.z * 10.0 * deltaTime;

    if (moveForward) velocity.z -= 50.0 * deltaTime;
    if (moveBackward) velocity.z += 50.0 * deltaTime;

    camera.translateZ(velocity.z * deltaTime);

    if (rotateLeft) camera.rotation.y += rotationSpeed;
    if (rotateRight) camera.rotation.y -= rotationSpeed;
}

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const deltaTime = (time - prevTime) / 1000;

    moveCamera(deltaTime);

    renderer.render(scene, camera);

    prevTime = time;
}

// Eventos de teclado
function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            rotateLeft = true; 
            break;
        case 'ArrowRight':
        case 'KeyD':
            rotateRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            rotateLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            rotateRight = false;
            break;
    }
}

// Iniciar a cena
init();
