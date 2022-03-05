const [demoWidth, demoHeight] = [600, 600];
const gridSVG = SVG().addTo(document.querySelector('#gridSVG')).size(demoWidth, demoHeight);
const cubeSVG = SVG().addTo(document.querySelector('#cubeSVG')).size(demoWidth, demoHeight);
const colors = ['red', 'blue', 'gold', 'green', 'hotpink', 'orange', 'purple', 'darkcyan'];
const keys = { 2: "xy", 3: "xyz", 4: "xyzw", 5: "xyzwv", 6: "abcdef", 7: "abcdefg", 8: "abcdefgh" };
const mono = '#d0d0d0';
const lightg = '#eaeaea';
const step = 20;
const demoTo2d = v => [
    demoWidth / 2 + v[0]
    + (v[2] ? v[2] / 2 : 0)
    - (v[3] ? v[3] / 2 : 0)
    + (v[4] ? v[4] / 4 : 0)
    - (v[5] ? v[5] / 2 : 0)
    - (v[6] ? v[6] / 4 : 0)
    + (v[7] ? v[7] / 2 : 0),
    demoHeight / 2 - v[1]
    - (v[2] ? v[2] / 2 : 0)
    - (v[3] ? v[3] / 2 : 0)
    - (v[4] ? v[4] / 2 : 0)
    - (v[5] ? v[5] / 4 : 0)
    - (v[6] ? v[6] / 2 : 0)
    - (v[7] ? v[7] / 4 : 0)
];
const metadata = {
    faces: {
        2: ['4', '4', '1', '', '', '', '', '', ''],
        3: ['8', '12', '6', '1', '', '', '', '', ''],
        4: ['16', '32', '24', '8', '1', '', '', '', ''],
        5: ['32', '80', '80', '40', '10', '1', '', '', ''],
        6: ['64', '192', '240', '160', '60', '12', '1', '', ''],
        7: ['128', '448', '672', '560', '280', '84', '14', '1', ''],
        8: ['256', '1024', '1792', '1792', '1120', '448', '112', '16', '1'],
    }
}
const options = {
    dimension: {
        value: 4,
        input: document.querySelector('#dimension')
    },
    bounds: {
        0: {
            value: -6,
            input: document.querySelector('#bound1')
        },
        1: {
            value: 6,
            input: document.querySelector('#bound2')
        },
    },
    vertices: {
        visible: {
            value: true,
            input: document.querySelector('#vertices-visible')
        },
        opacity: {
            value: 1,
            input: document.querySelector('#vertices-opacity')
        }
    },
    edges: {
        visible: {
            value: true,
            input: document.querySelector('#edges-visible')
        },
        opacity: {
            value: 0.5,
            input: document.querySelector('#edges-opacity')
        }
    },
    faces: {
        visible: {
            value: true,
            input: document.querySelector('#faces-visible')
        },
        opacity: {
            value: 0.1,
            input: document.querySelector('#faces-opacity')
        }
    },
    rotations: {
        selectAll: {
            input: document.querySelector('#select-all-rotations')
        },
        deselectAll: {
            input: document.querySelector('#deselect-all-rotations')
        }
    },
    axes: {
        visible: {
            value: true,
            input: document.querySelector('#axes-visible')
        },
        color: {
            value: false,
            input: document.querySelector('#axes-color')
        },
        labels: {
            value: true,
            input: document.querySelector('#axes-labels')
        }
    },
    gridlines: {
        visible: {
            value: true,
            input: document.querySelector('#gridlines-visible')
        },
        color: {
            value: false,
            input: document.querySelector('#gridlines-color')
        }
    },
    angle: {
        slider: document.querySelector('#angle-slider'),
        input: document.querySelector('#angle-input')
    },
    animation: {
        play: {
            value: null,
            input: document.querySelector('#play-rotation')
        },
        fps: {
            value: 25,
            input: document.querySelector('#animation-fps')
        },
        degrees: {
            value: 1,
            input: document.querySelector('#animation-degrees')
        }
    }
}

const makeGrid = () => {
    gridSVG.clear();
    if (options.gridlines.visible.value) {
        for (let i = step; i < demoHeight; i += step) gridSVG.line(0, i, demoWidth, i).stroke({ color: options.gridlines.color.value ? colors[0] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        for (let i = step; i < demoWidth; i += step) gridSVG.line(i, 0, i, demoHeight).stroke({ color: options.gridlines.color.value ? colors[1] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 2) for (let i = 0; i < demoWidth * 2; i += step) gridSVG.line(i, 0, i - demoHeight, demoHeight).stroke({ color: options.gridlines.color.value ? colors[2] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 3) for (let i = -demoHeight; i < demoWidth; i += step) gridSVG.line(i, 0, i + demoHeight, demoHeight).stroke({ color: options.gridlines.color.value ? colors[3] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 4) for (let i = -demoWidth; i < demoWidth * 2; i += step) gridSVG.line(i + demoHeight / 4, 0, i - demoHeight / 4, demoHeight).stroke({ color: options.gridlines.color.value ? colors[4] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 5) for (let i = -demoWidth * 2 - step; i < demoWidth * 2; i += step * 2) gridSVG.line(i, 0, i + demoHeight * 2, demoHeight).stroke({ color: options.gridlines.color.value ? colors[7] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 6) for (let i = -demoWidth; i < demoWidth * 2; i += step) gridSVG.line(i - demoHeight / 4, 0, i + demoHeight / 4, demoHeight).stroke({ color: options.gridlines.color.value ? colors[5] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
        if (options.dimension.value > 7) for (let i = -demoWidth * 2 - step; i < demoWidth * 2; i += step * 2) gridSVG.line(i, demoHeight, i + demoHeight * 2, 0).stroke({ color: options.gridlines.color.value ? colors[6] : lightg, width: 0.5 }).opacity(options.gridlines.color.value ? 0.2 : 1);
    }
    if (options.axes.visible.value) {
        gridSVG.line(0, demoHeight / 2, demoWidth, demoHeight / 2).stroke({ color: options.axes.color.value ? colors[0] : mono });
        if (options.axes.labels.value) {
            gridSVG.text('+' + keys[options.dimension.value][0]).move(demoWidth - 20, demoHeight / 2 + 5).font({ fill: options.axes.color.value ? colors[0] : mono, family: 'sans-serif', size: 12 });
            gridSVG.text('-' + keys[options.dimension.value][0]).move(5, demoHeight / 2 + 5).font({ fill: options.axes.color.value ? colors[0] : mono, family: 'sans-serif', size: 12 });
        }
        gridSVG.line(demoWidth / 2, 0, demoWidth / 2, demoHeight).stroke({ color: options.axes.color.value ? colors[1] : mono });
        if (options.axes.labels.value) {
            gridSVG.text('+' + keys[options.dimension.value][1]).move(demoWidth / 2 - 25, 5).font({ fill: options.axes.color.value ? colors[1] : mono, family: 'sans-serif', size: 12 });
            gridSVG.text('-' + keys[options.dimension.value][1]).move(demoWidth / 2 - 25, demoHeight - 20).font({ fill: options.axes.color.value ? colors[1] : mono, family: 'sans-serif', size: 12 });
        }
        if (options.dimension.value > 2) {
            gridSVG.line(demoWidth / 2 + demoHeight / 2, 0, demoWidth / 2 - demoHeight / 2, demoHeight).stroke({ color: options.axes.color.value ? colors[2] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][2]).move(demoWidth / 2 - demoHeight / 2 + 20, demoHeight - 20).font({ fill: options.axes.color.value ? colors[2] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][2]).move(demoWidth / 2 + demoHeight / 2 - 20, 20).font({ fill: options.axes.color.value ? colors[2] : mono, family: 'sans-serif', size: 12 });
            }
        }
        if (options.dimension.value > 3) {
            gridSVG.line(demoWidth / 2 + demoHeight / 2, demoHeight, demoWidth / 2 - demoHeight / 2, 0).stroke({ color: options.axes.color.value ? colors[3] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][3]).move(demoWidth / 2 + demoHeight / 2 - 35, demoHeight - 20).font({ fill: options.axes.color.value ? colors[3] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][3]).move(demoWidth / 2 - demoHeight / 2 + 5, 20).font({ fill: options.axes.color.value ? colors[3] : mono, family: 'sans-serif', size: 12 });
            }
        }
        if (options.dimension.value > 4) {
            gridSVG.line(demoWidth / 2 - demoHeight / 4, demoHeight, demoWidth / 2 + demoHeight / 4, 0).stroke({ color: options.axes.color.value ? colors[4] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][4]).move(demoWidth / 2 - demoHeight / 4 + 10, demoHeight - 20).font({ fill: options.axes.color.value ? colors[4] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][4]).move(demoWidth / 2 + demoHeight / 4, 5).font({ fill: options.axes.color.value ? colors[4] : mono, family: 'sans-serif', size: 12 });
            }
        }
        if (options.dimension.value > 5) {
            gridSVG.line(0, demoHeight / 2 - demoWidth / 4, demoWidth, demoHeight / 2 + demoWidth / 4).stroke({ color: options.axes.color.value ? colors[5] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][5]).move(demoWidth - 20, demoHeight / 2 + demoWidth / 4 - 5).font({ fill: options.axes.color.value ? colors[5] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][5]).move(5, demoHeight / 2 - demoWidth / 4 + 10).font({ fill: options.axes.color.value ? colors[5] : mono, family: 'sans-serif', size: 12 });
            }
        }
        if (options.dimension.value > 6) {
            gridSVG.line(demoWidth / 2 + demoHeight / 4, demoHeight, demoWidth / 2 - demoHeight / 4, 0).stroke({ color: options.axes.color.value ? colors[6] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][6]).move(demoWidth / 2 + demoHeight / 4 - 35, demoHeight - 20).font({ fill: options.axes.color.value ? colors[6] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][6]).move(demoWidth / 2 - demoHeight / 4 - 20, 5).font({ fill: options.axes.color.value ? colors[6] : mono, family: 'sans-serif', size: 12 });
            }
        }
        if (options.dimension.value > 7) {
            gridSVG.line(0, demoHeight / 2 + demoWidth / 4, demoWidth, demoHeight / 2 - demoWidth / 4).stroke({ color: options.axes.color.value ? colors[7] : mono });
            if (options.axes.labels.value) {
                gridSVG.text('-' + keys[options.dimension.value][7]).move(5, demoHeight / 2 + demoWidth / 4 - 5).font({ fill: options.axes.color.value ? colors[7] : mono, family: 'sans-serif', size: 12 });
                gridSVG.text('+' + keys[options.dimension.value][7]).move(demoWidth - 20, demoHeight / 2 - demoWidth / 4 + 10).font({ fill: options.axes.color.value ? colors[7] : mono, family: 'sans-serif', size: 12 });
            }
        }
    }
}

const makeCube = () => {
    cubeSVG.clear();
    cube = new NCube(options.dimension.value, [options.bounds[0].value*10, options.bounds[1].value*10], {
        nodes: {
            vertices: [],
            edges: [],
            faces: []
        },
        drawEdges: function () {
            this.edges.forEach(edge => {
                const line = cubeSVG.line(...edge.map(demoTo2d).flat())
                    .opacity(options.edges.opacity.value)
                    .stroke({ color: '#4287f5' });
                this.nodes.edges.push(line);
            });
        },
        paintFaces: function () {
            this.faces.forEach(face => {
                const polygon = cubeSVG.polygon(face.map(v => demoTo2d(v).join(',')).join(' '))
                    .opacity(options.faces.opacity.value)
                    .fill('#4287f5');
                this.nodes.faces.push(polygon);
            });
        },
        drawVertices: function () {
            this.vertices.forEach(vertex => {
                const circle = cubeSVG.circle(6).move(...demoTo2d(vertex).map(c => c - 3))
                    .opacity(options.vertices.opacity.value)
                    .fill('#4287f5');
                const title = document.createElementNS("http://www.w3.org/2000/svg", "title")
                title.textContent = `[${vertex.map(c => (c/10).toFixed(2)).join(', ')}]`;
                circle.node.appendChild(title);
                circle.node.style.cursor = 'pointer';
                this.nodes.vertices.push(circle)
            })
        },
        render: function () {
            cubeSVG.clear();
            document.querySelector('#metadata-faces').innerHTML = metadata.faces[this.dimension].map(d => `<td>${d}</td>`).join('');
            document.querySelector('#volume').innerHTML = `${Math.abs(this.boundingCoordinates[0]/10-this.boundingCoordinates[1]/10)**this.dimension} u<sup>${this.dimension}</sup>`;
            document.querySelector('#surface').innerHTML = `${Math.abs(this.boundingCoordinates[0]/10-this.boundingCoordinates[1]/10)**(this.dimension-1)*2*this.dimension} u<sup>${this.dimension-1}</sup>`;
            this.nodes = { vertices: [], edges: [], faces: [] }
            if (options.faces.visible.value) this.paintFaces();
            if (options.edges.visible.value) this.drawEdges();
            if (options.vertices.visible.value) this.drawVertices();
        },
        updateEdges: function () {
            this.edges.forEach((edge, i) => {
                const [x1, y1, x2, y2] = [...edge.map(demoTo2d).flat()];
                this.nodes.edges[i].attr({ x1: x1, y1: y1, x2: x2, y2: y2 })
            });
        },
        updateFaces: function () {
            this.faces.forEach((face, i) => {
                this.nodes.faces[i].attr({ points: face.map(v => demoTo2d(v).join(',')).join(' ') });
            })
        },
        updateVertices: function () {
            this.vertices.forEach((vertex, i) => {
                const [cx, cy] = demoTo2d(vertex);
                this.nodes.vertices[i].attr({ cx: cx, cy: cy });
                this.nodes.vertices[i].node.childNodes[0].innerHTML = `[${vertex.map(c => c.toFixed(2)).join(', ')}]`;
            })
        },
        update: function () {
            if (options.faces.visible.value) this.updateFaces();
            if (options.edges.visible.value) this.updateEdges();
            if (options.vertices.visible.value) this.updateVertices();
        }
    });
    const rotationArea = document.getElementById('rotations');
    const possibleRotations = getCombinations(2, getNList(options.dimension.value), true);
    rotationArea.innerHTML = '';
    possibleRotations.forEach(r => rotationArea.innerHTML += `<div class="rotation" title="[${r.join(', ')}]"><input type="checkbox" checked class="possible-rotation" title="${r.join('')}" /> ${keys[options.dimension.value].split('').filter(key => !r.map(i => keys[options.dimension.value][i]).includes(key)).join('') || 'Origin'}</div>`);
    document.querySelector('#code-rotations').innerHTML = `[${possibleRotations.map(axes => `[${axes.map(axis => `<span class='pl-c1'>${axis}</span>`).join(', ')}]`).join(', ')}]`;
    cube.render();
}

document.querySelector('form').addEventListener('submit', e => e.preventDefault());

options.dimension.input.addEventListener('change', e => {
    options.dimension.value = parseInt(e.target.value);
    document.querySelector('#axes-label').innerHTML = e.target.value == 2 ? 'Points' : e.target.value == 3 ? 'Axes' : e.target.value == 4 ? 'Planes' : 'Hyperplanes';
    document.querySelector('#code-dimension').innerHTML = e.target.value;
    makeGrid();
    makeCube();
});
options.bounds[0].input.addEventListener('change', e => {
    options.bounds[0].value = parseFloat(e.target.value);
    document.querySelector('#code-bound1').innerHTML = e.target.value;
    makeCube();
});
options.bounds[1].input.addEventListener('change', e => {
    options.bounds[1].value = parseFloat(e.target.value);
    document.querySelector('#code-bound2').innerHTML = e.target.value;
    makeCube();
});
options.vertices.visible.input.addEventListener('change', e => {
    options.vertices.visible.value = e.target.checked;
    cube.render();
});
options.edges.visible.input.addEventListener('change', e => {
    options.edges.visible.value = e.target.checked;
    cube.render();
});
options.faces.visible.input.addEventListener('change', e => {
    options.faces.visible.value = e.target.checked;
    cube.render();
});
options.vertices.opacity.input.addEventListener('change', e => {
    options.vertices.opacity.value = e.target.value;
    cube.render();
});
options.edges.opacity.input.addEventListener('change', e => {
    options.edges.opacity.value = e.target.value;
    cube.render();
});
options.faces.opacity.input.addEventListener('change', e => {
    options.faces.opacity.value = e.target.value;
    cube.render();
});
options.axes.visible.input.addEventListener('input', e => {
    options.axes.visible.value = e.target.checked;
    makeGrid();
});
options.gridlines.visible.input.addEventListener('input', e => {
    options.gridlines.visible.value = e.target.checked;
    makeGrid();
});
options.axes.labels.input.addEventListener('input', e => {
    options.axes.labels.value = e.target.checked;
    makeGrid();
})
options.axes.color.input.addEventListener('input', e => {
    options.axes.color.value = e.target.checked;
    makeGrid();
});
options.gridlines.color.input.addEventListener('input', e => {
    options.gridlines.color.value = e.target.checked;
    makeGrid();
});
options.rotations.selectAll.input.addEventListener('click', () => {
    Array.from(document.querySelectorAll('.possible-rotation')).map(e => e.checked = true);
});
options.rotations.deselectAll.input.addEventListener('click', () => {
    Array.from(document.querySelectorAll('.possible-rotation')).map(e => e.checked = false);
});
options.angle.slider.addEventListener('input', e => {
    const axesOfRotation = Array.from(document.querySelectorAll('.possible-rotation')).filter(e => e.checked).map(e => e.title.split('').map(c => parseInt(c)));
    options.angle.input.value = e.target.value;
    document.querySelector('#code-angle').innerHTML = e.target.value;
    document.querySelector('#code-rotations').innerHTML = `[${axesOfRotation.map(axes => `[${axes.map(axis => `<span class='pl-c1'>${axis}</span>`).join(', ')}]`).join(', ')}]`;
    cube.reset().rotate(e.target.value * Math.PI / 180, axesOfRotation);
    cube.update();
});
options.angle.input.addEventListener('input', e => {
    if (e.target.value) {
        const axesOfRotation = Array.from(document.querySelectorAll('.possible-rotation')).filter(e => e.checked).map(e => e.title.split('').map(c => parseInt(c)));
        options.angle.slider.value = parseFloat(e.target.value);
        document.querySelector('#code-angle').innerHTML = e.target.value;
        document.querySelector('#code-rotations').innerHTML = `[${axesOfRotation.map(axes => `[${axes.map(axis => `<span class='pl-c1'>${axis}</span>`).join(', ')}]`).join(', ')}]`;
        cube.reset().rotate(parseFloat(e.target.value) * Math.PI / 180, axesOfRotation);
        cube.update();
    }
});
const animateFrame = () => {
    const angle = options.angle.slider.value >= 360 ? 0 : parseInt(options.angle.slider.value) + options.animation.degrees.value;
    const axesOfRotation = Array.from(document.querySelectorAll('.possible-rotation')).filter(e => e.checked).map(e => e.title.split('').map(c => parseInt(c)));
    options.angle.slider.value = angle;
    options.angle.input.value = angle;
    document.querySelector('#code-angle').innerHTML = angle;
    document.querySelector('#code-rotations').innerHTML = `[${axesOfRotation.map(axes => `[${axes.map(axis => `<span class='pl-c1'>${axis}</span>`).join(', ')}]`).join(', ')}]`;
    cube.reset().rotate(angle * Math.PI / 180, axesOfRotation);
    cube.update();
}
options.animation.fps.input.addEventListener('change', e => {
    options.animation.fps.value = parseFloat(e.target.value) > 100 ? 1000/100 : parseFloat(e.target.value) < 0.5 ? 1000/0.5 : 1000/parseFloat(e.target.value);
    if (options.animation.play.value) {
        clearInterval(options.animation.play.value);
        options.animation.play.value = setInterval(animateFrame, options.animation.fps.value);
    }
});
options.animation.degrees.input.addEventListener('change', e => {
    options.animation.degrees.value = parseInt(e.target.value) > 360 ? 360 : parseInt(e.target.value) < 1 ? 1 : parseInt(e.target.value);
    if (options.animation.play.value) {
        clearInterval(options.animation.play.value);
        options.animation.play.value = setInterval(animateFrame, options.animation.fps.value);
    }
});
options.animation.play.input.addEventListener('click', e => {
    if (options.animation.play.value) {
        clearInterval(options.animation.play.value);
        options.animation.play.value = null
        e.target.innerHTML = '<i class="fa fa-play"></i>';
    } else {
        options.animation.play.value = setInterval(animateFrame, options.animation.fps.value);
        e.target.innerHTML = '<i class="fa fa-pause"></i>';
    }
});

makeGrid();
makeCube();