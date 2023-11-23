let ramp, stairs;
let camera, renderer, scene;
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
let velocity = new THREE.Vector3();
let rotationSpeed = 1; // velocidade da rotação
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

    // Terreno com grama
    const grassTexture = new THREE.TextureLoader().load('texturas/grama.jpg');
    const grassMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });
    const grassGeometry = new THREE.PlaneGeometry(500, 500);
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.5;
    scene.add(grass);

    // Céu
    const skyTexture = new THREE.TextureLoader().load('texturas/ceu.jpg');
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
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

    createTexturedBuilding(-30, 0, -50, 12, 20, 30, 'texturas/parede1.jpeg');
    createTexturedBuilding(0, 0, -100, 15, 30, 40, 'texturas/parede2.jpeg');
    createTexturedBuilding(30, 0, -50, 10, 20, 25, 'texturas/parede3.jpeg');

    // Posicao da camera de um cadeirante
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0); // Altura da câmera simula a altura de uma pessoa sentada

    // Event listeners para teclado
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Animação (loop de renderização)
    animate();
}

const textureLoader = new THREE.TextureLoader();

// Função para criar um prédio com textura
function createTexturedBuilding(x, y, z, width, depth, height, texturePath) {
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);

    // Carrega a textura
    const buildingTexture = textureLoader.load(texturePath);
    const buildingMaterial = new THREE.MeshLambertMaterial({ map: buildingTexture });

    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + (height / 2), z);
    scene.add(building);
}

// Variáveis para armazenar se a câmera está em contato com a rampa ou degraus
let onRamp = false;
let onStairs = false;

function checkCollision() {
    // Suponha que a rampa e os degraus têm posições fixas no mundo
    // Você precisará substituir estas coordenadas com as posições reais da rampa e degraus no seu jogo
    const rampPosition = { x: -5, zStart: -5, zEnd: 5 };
    const stairsPosition = { x: 5, zStart: -5, zEnd: 5 };

    // Verifica se a câmera está na posição da rampa
    if (camera.position.x > rampPosition.x - 2.5 && camera.position.x < rampPosition.x + 2.5 &&
        camera.position.z > rampPosition.zStart && camera.position.z < rampPosition.zEnd) {
        onRamp = true;
    } else {
        onRamp = false;
    }

    // Verifica se a câmera está na posição dos degraus
    if (camera.position.x > stairsPosition.x - 2.5 && camera.position.x < stairsPosition.x + 2.5 &&
        camera.position.z > stairsPosition.zStart && camera.position.z < stairsPosition.zEnd) {
        onStairs = true;
    } else {
        onStairs = false;
    }
}

function moveCamera(deltaTime) {
    velocity.z -= velocity.z * 10.0 * deltaTime;

    if (moveForward && !onStairs) velocity.z -= 50.0 * deltaTime;
    if (moveBackward) velocity.z += 50.0 * deltaTime;

    camera.translateZ(velocity.z * deltaTime);

    if (rotateLeft) camera.rotation.y += rotationSpeed * deltaTime;
    if (rotateRight) camera.rotation.y -= rotationSpeed * deltaTime;
}

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const deltaTime = (time - prevTime) / 1000;

    checkCollision();
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
