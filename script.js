let scene, camera, renderer, ramp, stairs;

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
    const grassTexture = new THREE.TextureLoader().load('texturas/grama.jpg'); // Substitua pelo caminho da sua textura
    const grassMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
    const grassGeometry = new THREE.PlaneGeometry(100, 100); // Aumente o tamanho conforme necessário
    grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2; // Rotação para deixar o plano horizontal
    grass.position.y = -0.5; // Ajuste a posição y conforme necessário
    scene.add(grass);

    // Adicione luz para melhorar a visualização das texturas
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // Adicionar esfera para o céu
    const skyTexture = new THREE.TextureLoader().load('texturas/ceu.jpg'); // Substitua pelo caminho da sua textura
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

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

    //Adicionando contorno nos objetos
    addOutlineToObject(ramp, 0x000000, 0.05); // Adiciona um contorno preto com uma espessura de 5%
    addOutlineToObject(stairs, 0x000000, 0.05); // Adiciona um contorno preto com uma espessura de 5%


    // Animação (loop de renderização)
    animate();
}

function addOutlineToObject(object, color, thickness) {
    const outlineMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        side: THREE.BackSide 
    });
    const outline = new THREE.Mesh(object.geometry, outlineMaterial);
    outline.position.copy(object.position);
    outline.rotation.copy(object.rotation);
    outline.scale.multiplyScalar(1 + thickness);
    scene.add(outline);
}



function animate() {
    requestAnimationFrame(animate);

    // Aqui você pode adicionar lógica para mover o cadeirante

    renderer.render(scene, camera);
}

// Iniciar a cena
init();
