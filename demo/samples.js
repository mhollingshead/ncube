
const intervalManager = {};
const ncubeManager = {};
const updateManager = {};

const [width, height] = [300, 300];
const svg = SVG().addTo(document.querySelectorAll('.ncube')[0]).size(width, height);

const to2d = v => [150 + v[0] + v[2] / 2 + v[3] / 2, 150 + v[1] - v[2] / 2 + v[3] / 2];

ncubeManager[0] = new NCube(4, [-50, 50], {
    draw: function () {
        this.edges.forEach(edge => {
            svg.line(...edge.map(to2d).flat())
                .opacity(0.5)
                .stroke({ color: '#4287f5' });
        });
        this.faces.forEach(face => {
            svg.polygon(face.map(v => to2d(v).join(',')).join(' '))
                .opacity(0.075)
                .fill('#4287f5')
        });
    }
});

ncubeManager[0].draw();

updateManager[0] = e => {
    svg.clear();
    ncubeManager[0].reset().rotate(e.target.value * Math.PI / 180, [[0, 1], [2, 3], [3]]).draw();
}

document.querySelectorAll('.angle')[0].addEventListener('input', updateManager[0]);

document.querySelectorAll('.play')[0].addEventListener('click', e => {
    if (e.target.innerHTML === '<i class="fa fa-play"></i>') {
        e.target.innerHTML = '<i class="fa fa-pause"></i>';
        intervalManager[0] = setInterval(() => {
            const angle = document.querySelectorAll('.angle')[0];
            angle.value = angle.value > 359 ? 0 : parseInt(angle.value) + 1;
            updateManager[0]({ target: angle });
        }, 25);
    } else {
        e.target.innerHTML = '<i class="fa fa-play"></i>';
        clearInterval(intervalManager[0]);
    }
});

// Set up our Three.js environment and create our line material
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
const material = new THREE.LineBasicMaterial({ color: "#4287f5" });
const renderer = new THREE.WebGLRenderer({ alpha: true });
scene.rotateX(-Math.PI / 2), camera.position.z = 1;
renderer.setClearColor(0x000000, 0), renderer.setSize(300, 300);
document.querySelectorAll('.ncube')[1].appendChild(renderer.domElement);

// Create a 4-dimensional hypercube
ncubeManager[1] = new NCube(4, [-1, 1], {
    lines: [],
    renderEdges: function () {
        this.edges.forEach((edge, i) => {
            const geometry = new THREE.BufferGeometry().setFromPoints(
                edge.map(vertex => new THREE.Vector3(...vertex.project(3, 4)))
            );
            if (this.lines[i]) {
                this.lines[i].geometry.dispose();
                this.lines[i].geometry = geometry;
            } else {
                const line = new THREE.Line(geometry, material);
                this.lines.push(line);
                scene.add(line);
            }
        });
    }
});

ncubeManager[1].renderEdges();
renderer.render(scene, camera);

updateManager[1] = e => {
    ncubeManager[1].reset().rotate(e.target.value * Math.PI / 180, [[0, 1], [2, 3]]).renderEdges();
    renderer.render(scene, camera);
}

document.querySelectorAll('.angle')[1].addEventListener('input', updateManager[1]);

document.querySelectorAll('.play')[1].addEventListener('click', e => {
    if (e.target.innerHTML === '<i class="fa fa-play"></i>') {
        e.target.innerHTML = '<i class="fa fa-pause"></i>';
        intervalManager[1] = setInterval(() => {
            const angle = document.querySelectorAll('.angle')[1];
            angle.value = angle.value > 359 ? 0 : parseInt(angle.value) + 1;
            updateManager[1]({ target: angle });
        }, 25);
    } else {
        e.target.innerHTML = '<i class="fa fa-play"></i>';
        clearInterval(intervalManager[1]);
    }
});
