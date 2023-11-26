let ramp, stairs;
let camera, renderer, scene;
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
let velocity = new THREE.Vector3();
let rotationSpeed = 1; // velocidade da rotação
let prevTime = performance.now();

let collisionObjects = []; // Blocos de colisao

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

    const rampWidth = 2; // Largura da rampa

    // Criar a rua com calçadas
    createStreetAndSidewalks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight, rampWidth);
    addRoadLines(streetWidth, streetLength, 2, 0.2, 5); //largura da rua, comprimento da rua, comprimento da linha, largura da linha, espaçamento entre as linhas
    addCrosswalk(streetWidth, 0, 5, 1.5, 3, 5); // Parâmetros: largura da rua, posição z, comprimento da linha, largura da linha, espaçamento entre as linhas, número de linha


    // Criar prédios com textura
    const buildingWidth = 10; 
    const buildingDepth = 15; 
    const buildingHeight = 40; 
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 0, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, -20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio3.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, -40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, 60, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio5.jpeg');
    createTexturedBuilding(-streetWidth / 2 - buildingWidth / 2 - sidewalkWidth, -60, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');

    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 0, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio3.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, -20, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');    
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio2.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, -40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio4.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, 40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio.jpeg');
    createTexturedBuilding(streetWidth / 2 + buildingWidth / 2 + sidewalkWidth, -40, buildingWidth, buildingDepth, buildingHeight, 'texturas/predio6.jpeg');

    // Posicao da camera de um cadeirante
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0);

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    animate();
} // Fim do init

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();

// Função para criar a rua e calçadas
function createStreetAndSidewalks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight, rampWidth) {
    // Rua
    const streetGeometry = new THREE.PlaneGeometry(streetWidth, streetLength);
    const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const street = new THREE.Mesh(streetGeometry, streetMaterial);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, 0);
    scene.add(street);

    // Calçadas
    // Calcular o comprimento de cada seção da calçada
    const sidewalkSectionLength = (streetLength - rampWidth) / 2;

    // Criar as seções da calçada
    createSidewalkSection(-(streetWidth / 2 + sidewalkWidth / 2), sidewalkSectionLength, sidewalkWidth, sidewalkHeight,  sidewalkSectionLength / 2 + 1);
    createSidewalkSection(-(streetWidth / 2 + sidewalkWidth / 2), sidewalkSectionLength, sidewalkWidth, sidewalkHeight, -sidewalkSectionLength / 2 - 1);
    createSidewalkSection(streetWidth / 2 + sidewalkWidth / 2, sidewalkSectionLength, sidewalkWidth, sidewalkHeight,  sidewalkSectionLength / 2 + 1);
    createSidewalkSection(streetWidth / 2 + sidewalkWidth / 2, sidewalkSectionLength, sidewalkWidth, sidewalkHeight, -sidewalkSectionLength / 2 - 1);

    // Criar espaços para rampas
    createRamp(-(streetWidth / 2 + sidewalkWidth / 2), sidewalkHeight, rampWidth, 0);
    createRamp(streetWidth / 2 + sidewalkWidth / 2, sidewalkHeight, rampWidth, 0);

    // Adicionar blocos de colisão nas bordas da calçada
    addCollisionBlocks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight, rampWidth);
}

// Criando a calçada
function createSidewalkSection(x, length, width, height, zPosition) {
    const sidewalkGeometry = new THREE.BoxGeometry(width, height, length);
    const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
    const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);

    sidewalk.position.set(x, height / 2, zPosition);
    scene.add(sidewalk);
}

// Adicionando colisao 
function addCollisionBlocks(streetWidth, streetLength, sidewalkWidth, sidewalkHeight, rampWidth) {
    const blockDepth = (streetLength - rampWidth) / 2; 
    const blockHeight = 2; 
    const blockWidth = sidewalkWidth/4;

    const blockGeometry = new THREE.BoxGeometry(blockWidth, blockHeight, blockDepth);
    const blockMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Material invisível

    const blockLeft1 = new THREE.Mesh(blockGeometry, blockMaterial);
    blockLeft1.position.set(-(streetWidth / 2 + blockWidth / 2), sidewalkHeight + blockHeight / 2, blockDepth / 2 + 1);

    const blockLeft2 = new THREE.Mesh(blockGeometry, blockMaterial);
    blockLeft2.position.set(-(streetWidth / 2 + blockWidth / 2), sidewalkHeight + blockHeight / 2, -blockDepth / 2 - 1);

    const blockRight1 = new THREE.Mesh(blockGeometry, blockMaterial);
    blockRight1.position.set(streetWidth / 2 + blockWidth / 2, sidewalkHeight + blockHeight / 2, blockDepth / 2 + 1);

    const blockRight2 = new THREE.Mesh(blockGeometry, blockMaterial);
    blockRight2.position.set(streetWidth / 2 + blockWidth / 2, sidewalkHeight + blockHeight / 2, -blockDepth / 2 - 1);

    scene.add(blockLeft1);
    scene.add(blockLeft2);
    scene.add(blockRight1);
    scene.add(blockRight2);

    collisionObjects.push(blockLeft1);
    collisionObjects.push(blockLeft2);
    collisionObjects.push(blockRight1);
    collisionObjects.push(blockRight2);
}

// Função para criar rampas
function createRamp(xPosition, sidewalkHeight, rampWidth, streetLength) {
    const rampHeight = sidewalkHeight;
    const rampLength = rampWidth; 
    const rampGeometry = new THREE.BoxGeometry(rampWidth, rampHeight, rampLength);
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF});
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);

    ramp.position.set(xPosition, rampHeight / 2, streetLength / 4); 
    scene.add(ramp);
}

// Adicionando faixa de pedestre
function addCrosswalk(streetWidth, zPosition, lineLength, lineWidth, lineSpacing, lineCount) {
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }); 

    for (let i = 0; i < lineCount; i++) {
        const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength);
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.rotation.x = -Math.PI / 2; 

        // Posiciona cada linha da faixa de pedestre
        const xPosition = -streetWidth / 2 + lineWidth / 2 + i * (lineWidth + lineSpacing);
        line.position.set(xPosition, 0.01, zPosition); 

        scene.add(line);
    }
}


// Função para criar prédios com textura
function createTexturedBuilding(x, z, width, depth, height, texturePath) {
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingTexture = textureLoader.load(texturePath);
    buildingTexture.wrapS = THREE.RepeatWrapping;
    buildingTexture.wrapT = THREE.RepeatWrapping;
    buildingTexture.repeat.set(1, height / 10); 
    const buildingMaterial = new THREE.MeshLambertMaterial({ map: buildingTexture });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

    // Ajustar a posição y para que a base do prédio fique alinhada com a calçada
    building.position.set(x, height / 2 + 0.1, z); 
    scene.add(building);
}

function moveCamera(deltaTime) {
    let newZ = velocity.z - velocity.z * 10.0 * deltaTime;
    if (moveForward) newZ -= 200.0 * deltaTime;
    if (moveBackward) newZ += 200.0 * deltaTime;

    camera.translateZ(newZ * deltaTime);

    // Verificar colisão
    if (checkCollision()) {
        camera.translateZ(-newZ * deltaTime);
    }

    // Aplica rotação
    if (rotateLeft) camera.rotation.y += rotationSpeed * deltaTime;
    if (rotateRight) camera.rotation.y -= rotationSpeed * deltaTime;
}

function checkCollision() {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    for (let i = 0; i < collisionObjects.length; i++) {
        const object = collisionObjects[i];
        const boundingBox = new THREE.Box3().setFromObject(object);

        if (boundingBox.containsPoint(cameraPosition)) {
            return true; 
        }
    }
    return false; 
}

// Criando linhas unicas
function createRoadLine(x, z, lineLength, lineWidth, color = 0xffffff) {
    const lineGeometry = new THREE.PlaneGeometry(lineWidth, lineLength);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: color });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.rotation.x = -Math.PI / 2; 
    line.position.set(x, 0.01, z); 
    scene.add(line);
}

// Adicionando as linhas na rua
function addRoadLines(streetWidth, streetLength, lineLength, lineWidth, lineSpacing) {
    const numberOfLines = streetLength / (lineLength + lineSpacing);
    const startPositionZ = -streetLength / 2 + lineLength / 2;

    for (let i = 0; i < numberOfLines; i++) {
        const zPosition = startPositionZ + i * (lineLength + lineSpacing);
        createRoadLine(0, zPosition, lineLength, lineWidth); 
    }
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
