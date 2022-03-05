// Utility function for multiplying two matrices
const multiplyVectors = (m1, m2) => m1.map((r, i) => m2[0].map((_, j) => r.reduce((acc, _, n) => acc + m1[i][n] * m2[n][j], 0)));

// Utility function that converts a decimal number to a padded binary string
const getBinaryStr = (n, padding = 0) => (new Array(padding).fill("0").join("") + (n >>> 0).toString(2)).slice(-padding);

// Utility function that inserts a character into index ind of string str
const insertIntoStr = (char, str, ind) => `${str.slice(0, ind)}${char}${str.slice(ind)}`;

// Utility function to get the list of integers from 0 to n-1
const getNList = n => Object.keys(new Array(n).fill(true)).map(key => parseInt(key));

// Utility function that generates a rotation matrix for some fixed axis, plane, hyperplane, etc.
const getRotationMatrix = (n, a, free) => {
    const matrix = new Array(n).fill().map((_, i) => {
        const row = new Array(n).fill(0);
        row[i] = 1;
        return row;
    });
    if (free[0] < n) matrix[free[0]][free[0]] = Math.cos(a);
    if (free[1] && free[1] < n) matrix[free[1]][free[1]] = Math.cos(a);
    if (free[1] && free[0] < n && free[1] < n) {
        matrix[free[0]][free[1]] = -Math.sin(a);
        matrix[free[1]][free[0]] = Math.sin(a);
    }
    return matrix;
}

// Utility function to swap two array indices
const swapInd = (arr, i, j) => {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    return arr;
}

/**
 * Generates all n-length combinations of elements in arr.
 * @param {Number} n The length of the combinations
 * @param {Array<Number>} arr The bits from which the combinations will be generated
 * @param {boolean} ordered Indicates whether or not the combinations should be ordered
 * @returns {Array<Array<Number>>} All n-length combinations of elements in arr
 */
const getCombinations = (n, arr, ordered = false) => n === 0 ? [[]] : !ordered 
    ? new Array(n).fill(arr).reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []))
    : (arr.length === n) ? [arr] : [...getCombinations(n-1, arr.slice(1), true).map(c => [arr[0], ...c]), ...getCombinations(n, arr.slice(1), true)];

/**
 * Generates the binary representations of vertices in an n-cube
 * @param {Number} n The dimension of the n-cube
 * @param {Array<String>} bits The digits that will be used to encode the vertices' binary representations
 * @returns {Array<String>} An array of binary representations of vertices in an n-cube
 */
const generateBits = (n, bits = ['0', '1']) => {
    if (n === 0) {
        // The 0-dimensional hypercube (or point) is represented by a singular point with no coordinate value.
        return [''];
    } else if (n === 1) {
        // The 1-dimensional hypercube (or edge) is represented by the two bounding coordinates.
        return bits;
    } else {
        // All other dimensions can be represented by all n-length combinations of the bounding coordinates.
        return getCombinations(n, bits)
            .map(v => v.join(''))
            .sort();
    }
}

/**
 * Generates the bitmap by associating each vertex's binary representation with its coordinate values, dictated by two bounding coordinates.
 * @param {Array<String>} bits An array of binary representations of vertices in an n-cube
 * @param {Array<Number>} boundingCoordinates An array of 2 numbers that are used to assign its vertices coordinate values
 * @returns {Object} A dictionary mapping a vertex's binary representation to its coordinate values
 */
const generateBitmap = (bits, boundingCoordinates) => {
    const bitmap = {};
    if (bits.length === 2) {
        bitmap['0'] = new Vertex(1);
        bitmap['0'].push(boundingCoordinates[0]);
        bitmap['1'] = new Vertex(1);
        bitmap['1'].push(boundingCoordinates[1]);
    } else {
        bits.forEach(b => bitmap[b] = new Vertex(...b.split('').map(d => boundingCoordinates[parseInt(d)])));
    }
    return bitmap;
}

/**
 * Generates a list of m-faces of an n-cube
 * @param {Number} m The dimension of the m-faces to generate
 * @param {Number} n The dimension of the n-cube
 * @param {Object} bitmap The dictionary that maps a vertex's binary representation to its coordinate values
 * @returns {Array<Array<Vertex>>} A list of m-faces of an n-cube
 */
const generateMFaces = (m, n, bitmap) => {
    if (m > n) return [];
    // An m-face has m free bits and n - m fixed bits
    const free = m;
    const fixed = n - m;
    // Generate all combinations of n - m fixed bit indexes
    const fixedIndices = getCombinations(fixed, getNList(n), true);

    const orientations = [];
    // Select the indexes to fix
    for (let i = 0; i < fixedIndices.length; i++) {
        // Count in binary over the fixed bits
        for (let j = 0; j < 2**(n - m); j++) {
            const fixedBits = getBinaryStr(j, fixed);
            const orientation = [];
            // Count in binary over the free bits
            for (let k = 0; k < 2**m; k++) {
                let bitCode = getBinaryStr(k, free);
                // Insert fixed bits into their propper indexes
                for (let h = 0; h < fixed; h++) {
                    bitCode = insertIntoStr(fixedBits[h], bitCode, parseInt(fixedIndices[i][h]));
                }
                orientation.push(bitmap[bitCode]);
            }
            orientations.push(swapInd(orientation, 2**m - 1, 2**m - 2));
        }
    }
    return orientations;
}

/**
 * A class to represent a Vertex. Extends the built-in Array class with additional Vertex methods.
 * @returns A new Vertex object
 */
class Vertex extends Array {
    /**
     * Projects a vertex into dimension n
     * @param {number} n The dimension to project the vertex into
     * @param {number} e A number *epsilon* used to scale vertices for perspecive projections.
     * @returns {Vertex} The vertex projected into dimension n
     */
    project(n = 2, e) {
        if (e) {
            return new Vertex(...[...this].slice(0, n).map(c => c * (1 / (e - this[this.length - 1]))));
        } else {
            return new Vertex(...[...this].slice(0, n).map(c => e ? c * (1 / (e - d)) : c));
        }
    }

    /**
     * Converts the vertex to its matrix representation
     * @returns The matrix representation of the vertex
     */
    toMatrix() {
        if (this[0].length === 1) return;
        return [...this].map(coordinate => [coordinate]);
    }
}

/**
 * A class to represent an n-cube (n-dimensional hypercube)
 * @param {number} n The dimension of the n-cube
 * @param {Array<Number>} boundingCoordinates The bounding coordinates of the n-cube. [-1, 1] by default (centered about the origin)
 * @param {Object} attr Any additional methods or attributes to be added to the n-cube
 * @returns A new n-cube object
*/
class NCube {
    constructor(n = 0, boundingCoordinates = [-1, 1], attr = {}) {
        this.dimension = Math.round(n);
        // The binary representations of the n-dimensional hypercube's vertices
        this.bits = generateBits(this.dimension);
        // The bounds of the hypercube
        this.boundingCoordinates = boundingCoordinates;
        // The mapping between the hypercube's vertices and their binary representation
        this.bitmap = generateBitmap(this.bits, boundingCoordinates);
        // A backup bitmap used for resetting to default values
        this.backup = generateBitmap(this.bits, boundingCoordinates);
        // The vertices of the hypercube
        this.vertices = this.bits.map(key => this.bitmap[key]);
        // The edges (1-faces) of the hypercube
        this.edges = generateMFaces(1, this.dimension, this.bitmap);
        // The faces (2-faces) of the hypercube
        this.faces = generateMFaces(2, this.dimension, this.bitmap);
        // A dictionary that stores m-face lists in order to avoid having to regenerate
        this.facets = {
            '1': this.edges,
            '2': this.faces
        }
        Object.keys(attr).forEach(key => this[key] = attr[key]);
    }

    /**
     * Retrieves the list of all m-faces (or m-dimensional facets) in the n-cube.
     * @param {number} m The dimension of the faces to be retrieved.
     * @returns {Array<Array<Vertex>>} An array of length-2^m arrays of Vertex objects.
     */
    getFacets(m = 0) {
        // m must be a positive integer for all m-faces.
        if (m < 0) return console.error('IllegalArgumentError: m must be a positive integer');
        if (m % 1 !== 0) return console.error('IllegalArgumentError: m must be an integer');
        // Check to see if the m-face list has been generated before, if so, no need to regenerate
        if (this.facets[m]) return this.facets[m];
        // Otherwise, generate the m-faces, save them to the dictionary, and return
        this.facets[m] = generateMFaces(m, this.dimension, this.bitmap);
        return this.facets[m];
    }

    /**
     * Retrieves the list of all m-faces (or m-dimensional facets) in the n-cube.
     * @param {number} m The dimension of the faces to be retrieved.
     * @returns {Array<Array<Vertex>>} An array of length-2^m arrays of Vertex objects.
     */
    getFaces(m) {
        return this.getFacets(m);
    }

    /**
     * Retrieves the list of all m-faces (or m-dimensional facets) in the n-cube.
     * @param {number} m The dimension of the faces to be retrieved.
     * @returns {Array<Array<Vertex>>} An array of length-2^m arrays of Vertex objects.
     */
    getMFaces(m) {
        return this.getFacets(m);
    }

    /**
     * Resets the n-cube to its initial conditions
     * @returns Self
     */
    reset() {
        // Loop through each vertex, resetting each coordinate to the corresponding backup coordinate
        this.bits.forEach(key => this.bitmap[key].forEach((_, i) => this.bitmap[key][i] = this.backup[key][i]));
        // Returns itself in order to chain operations
        return this;
    }

    /**
     * Scales the n-cube's vertex coordinates by scalar s
     * @param {number} s The scalar to scale the n-cubes coordinates by
     * @returns Self
     */
    scale(s) {
        // Loop through each vertex, multiplying each coordinate by scalar s
        this.bits.forEach(key => this.bitmap[key].forEach((_, i) => this.bitmap[key][i] *= s));
        // Returns itself in order to chain operations
        return this;
    }

    /**
     * Rotates the n-cubes vertex coordinates on the axes provided by angle a
     * @param {number} a The angle in radians by which to rotate the n-cube
     * @param {Array<Array<number>>} rotations An Array of Array(2)s of Numbers representing a series of rotations. The numbers in each Array represent an index of some axis of freedom used to generate a rotation matrix. For example, in dimension 4, [0, 1] represents a rotation about the ZW plane as the X axis (index 0) and Y axis (index 1) are free while the Z and W axes are fixed.
     * @returns Self
     */
    rotate(a = 0, rotations = getCombinations(2, getNList(this.dimension), true)) {
        // Loop through each vertex
        if (typeof rotations[0] === 'number') rotations = rotations.map(axis => [axis, axis + 1]);
        this.bits.forEach(key => {
            // Rotate over all axes provided by reducing the array of axes
            const rotated = rotations.reduce((acc, axes) => 
                // Multiply the current vertex by the current axis's rotation matrix
                new Vertex(
                    ...multiplyVectors(
                        getRotationMatrix(this.dimension, a, axes), 
                        acc.toMatrix()
                    ).flat()
                ), this.bitmap[key]
            );
            // Update the n-cube's vertices to the rotated vertices
            this.bitmap[key].forEach((_, i) => this.bitmap[key][i] = rotated[i]);
        });
        // Returns itself in order to chain operations
        return this;
    }
}