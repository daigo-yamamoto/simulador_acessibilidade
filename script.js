let ramp, stairs;
let camera, renderer, scene;
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
let velocity = new THREE.Vector3();
let rotationSpeed = 1; // velocidade da rotação
let prevTime = performance.now();

// Dimensões da rua e calçadas
const streetWidth = 20;
const streetLength = 500;
const sidewalkWidth = 3;
const sidewalkHeight = 0.2;

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

    // Criar a rua com calçadas
    createStreetAndSidewalks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight);

    // Criar prédios com textura
    const buildingWidth = 10; // Largura do prédio
    const buildingDepth = 15; // Profundidade do prédio
    const buildingHeight = 40; // Altura do prédio
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 0, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, -20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio3.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, -40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');

    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 0, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio3.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, -20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');    
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, -40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio4.jpeg');

    // Posicao da camera de um cadeirante
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0); // Altura da câmera simula a altura de uma pessoa sentada

    // Event listeners para teclado
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Animação (loop de renderização)
    animate();
} // Fim do init

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();

// Função para criar a rua e calçadas
function createStreetAndSidewalks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight) {
    // Rua
    const streetGeometry = new THREE.PlaneGeometry(streetWidth, streetLength);
    const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, 0);
    scene.add(street);

    // Calçadas
    const sidewalkGeometry = new THREE.BoxGeometry(sidewalkWidth, sidewalkHeight, streetLength);
    const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
    const sidewalkLeft = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    const sidewalkRight = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);

    sidewalkLeft.position.set(-(streetWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, 0);
    sidewalkRight.position.set(streetWidth / 2 + sidewalkWidth / 2, sidewalkHeight / 2, 0);

    scene.add(sidewalkLeft);
    scene.add(sidewalkRight);

    // Rampas de acesso
    // Material para as rampas
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 }); // Vermelho para visibilidade

    // Definindo a geometria da rampa (mais larga para visibilidade)
    const rampGeometry = new THREE.PlaneGeometry(sidewalkWidth, sidewalkHeight);
    
    // Definindo posições das rampas
    const rampPositions = [-100, 0, 100]; // Posições ao longo da calçada onde as rampas serão colocadas

    for (let i = 0; i < rampPositions.length; i++) {
        const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
        ramp.rotation.x = -Math.PI / 4; // Inclinação da rampa
        ramp.position.set(-(streetWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, rampPositions[i]);

        const ramp2 = new THREE.Mesh(rampGeometry, rampMaterial);
        ramp2.rotation.x = -Math.PI / 4; // Inclinação da rampa
        ramp2.position.set(streetWidth / 2 + sidewalkWidth / 2, sidewalkHeight / 2, rampPositions[i]);

        scene.add(ramp);
        scene.add(ramp2);

        console.log("Rampa adicionada em: ", ramp.position);
    }
}

// Função para criar prédios com textura
function createTexturedBuilding(x, z, width, depth, height, texturePath) {
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingTexture = textureLoader.load(texturePath);
    buildingTexture.wrapS = THREE.RepeatWrapping;
    buildingTexture.wrapT = THREE.RepeatWrapping;
    buildingTexture.repeat.set(1, height / 10); // Repetir textura verticalmente
    const buildingMaterial = new THREE.MeshLambertMaterial({ map: buildingTexture });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

    // Ajustar a posição y para que a base do prédio fique alinhada com a calçada
    building.position.set(x, height / 2 + 0.1, z); // Eleva-se ligeiramente acima da calçada
    scene.add(building);
}

// Variáveis para armazenar se a câmera está em contato com a calçada ou rampa
let onSidewalk = false;
let onRamp = false;

// Posições das rampas
const rampPositions = [-100, 0, 100];
const rampWidth = sidewalkWidth; // Supondo que a largura da rampa seja igual à largura da calçada

function checkCollision() {
    onSidewalk = false;
    onRamp = false;

    // Verifica se a câmera está na posição da calçada
    if ((camera.position.x < -(streetWidth / 2) && camera.position.x > -(streetWidth / 2 + sidewalkWidth)) || 
        (camera.position.x > (streetWidth / 2) && camera.position.x < (streetWidth / 2 + sidewalkWidth))) {
        onSidewalk = true;
    }

    // Verifica se a câmera está na posição da rampa
    for (let i = 0; i < rampPositions.length; i++) {
        if (camera.position.z > rampPositions[i] - rampWidth / 2 && 
            camera.position.z < rampPositions[i] + rampWidth / 2 &&
            camera.position.x >= -(streetWidth / 2) && 
            camera.position.x <= (streetWidth / 2)) {
            onRamp = true;
            break; // Sai do loop se a câmera estiver em qualquer uma das rampas
        }
    }
}

function moveCamera(deltaTime) {
    // Calcula a nova posição baseada no movimento
    let newZ = velocity.z - velocity.z * 10.0 * deltaTime;
    if (moveForward) newZ -= 200.0 * deltaTime;
    if (moveBackward) newZ += 200.0 * deltaTime;

    // Move a câmera para a nova posição
    camera.translateZ(newZ * deltaTime);

    // Aplica rotação
    if (rotateLeft) camera.rotation.y += rotationSpeed * deltaTime;
    if (rotateRight) camera.rotation.y -= rotationSpeed * deltaTime;

    // Verifica a colisão com a calçada e rampa
    checkCollision();

    // Restringe o movimento vertical se estiver na calçada e não na rampa
    if (onSidewalk && !onRamp) {
        // Impede que a câmera suba na calçada
        camera.position.y = Math.max(camera.position.y, sidewalkHeight);
    }
}

// As funções onKeyDown e onKeyUp permanecem as mesmas


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
