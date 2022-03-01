<h1 align="center">
    <img src="https://raw.githubusercontent.com/mhollingshead/ncube/main/assets/ncube250.gif?token=GHSAT0AAAAAABK56AHTIEFBKQSG6J4A52JGYQ5XOHQ" width="150" height="150" /><br/>
    NCube.js
</h1>

A light-weight JavaScript library that dynamically generates [n-dimensional hypercube](https://en.wikipedia.org/wiki/Hypercube) <i>(or n-cube)</i> geometries.

## Getting Started
###  Browser:
```html
<script src="ncube.min.js"></script>
<script>
	const nCube = new NCube(4);
</script>
```

### Node.js Modules
```javascript
import NCube from './ncube.js';

const nCube = new NCube(4);
```

## API
### NCube
A class to represent an n-cube *(n-dimensional hypercube)*
#### Parameters
* `n` ([Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)) The dimension of the n-cube. **Optional**, `0` by default.
* `boundingCoordinates` ([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>) The two bounding coordinates of the n-cube. **Optional**, `[-1, 1]` by default *(centered about the origin)*.
* `attr` ([Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)) Any additional methods or attributes to be added to the n-cube. **Optional**, `{}` by default.
#### Examples
```javascript
const nCube = new NCube(3);
// NCube {
//   verticies: [
//     Vertex(3) [-1, -1, -1],
//     Vertex(3) [-1, -1, 1],
//     ...
//     Vertex(3) [1, 1, 1]
//   ],
//   ...
// }
```
```javascript
const nCube = new NCube(6, [0, 2], {myAttr: "Foo"});
// NCube {
//   verticies: [
//     Vertex(6) [0, 0, 0, 0, 0, 0],
//     Vertex(6) [0, 0, 0, 0, 0, 2],
//     ...
//     Vertex(6) [2, 2, 2, 2, 2, 2]
//   ],
//   ...
//   myAttr: "Foo",
// }
```
Returns an [NCube](#ncube) object

### [NCube](#ncube).dimension
The dimension of the n-cube.
#### Examples
```javascript
const nCube = new NCube();
console.log(nCube.dimension) // 0
```
```javascript
const nCube = new NCube(4);
console.log(nCube.dimension) // 4
```
```javascript
const nCube = new NCube(7.5);
console.log(nCube.dimension); // 8 (n rounds to the nearest integer)
```

A [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

### [NCube](#ncube).bits
The binary representation of the n-cube's vertices. Used as keys in the NCube's [bitmap](ncubebitmap).
#### Examples
```javascript
const nCube = new NCube();
console.log(nCube.bits);
// ['']
```
```javascript
const nCube = new NCube(1);
console.log(nCube.bits);
// ['0', '1']
```
```javascript
const nCube = new NCube(2);
console.log(nCube.bits);
// ['00', '01', '10', '11']
```
```javascript
const nCube = new NCube(12);
console.log(nCube.bits);
// [
//   '000000000000',
//   '000000000001',
//   ...
//   '111111111111'
// ]
```
An [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### [NCube](#ncube).bitmap
A mapping between the binary representation and the [Vertex](#vertex) representation of an n-cube's vertices. All m-face lists *(i.e. vertex-lists, edge-lists, face-lists, etc.)* return references to these vertices.

Because the bitmap is generated and accessed using [NCube.bit](ncubebits) strings, the vertices are always ordered.

#### Examples
```javascript
const nCube = new NCube(3, [2, 4]);
console.log(nCube.bitmap);
// {
//   '000': Vertex(3) [2, 2, 2],
//   '001': Vertex(3) [2, 2, 4],
//   ...
//   '111': Vertex(3) [4, 4, 4]
// }

console.log(nCube.bitmap[nCube.bits[4]]);
// Vertex(3) [4, 2, 2]
```
An [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

### [NCube](#ncube).vertices
A list of vertices *(or 0-faces)* of an n-cube. Unlike other m-face lists, which are Arrays of 2^m-length Arrays of [Vertex](#vertex) objects, the list of vertices is flattened since 0-faces are always length 1.
#### Example
```javascript
const nCube = new NCube(4, [0, 1]);
console.log(nCube.vertices);
// [
//   Vertex (4) [0, 0, 0, 0],
//   Vertex (4) [0, 0, 0, 1],
//   ...
//   Vertex (4) [1, 1, 1, 1]
// ]
```
An [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Vertex](#vertex)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>

### [NCube](#ncube).edges
A list of edges *(or 1-faces)* of an n-cube, represented by an Array of length-2 Arrays of [Vertex](#vertex) objects.
#### Example
```javascript
const nCube = new NCube(4, [0, 1]);
console.log(nCube.edges);
// [
//   [ Vertex (4) [0, 0, 0, 0], Vertex(4) [0, 0, 0, 1] ],
//   [ Vertex (4) [0, 0, 1, 0], Vertex(4) [0, 0, 1, 1] ],
//   ...
//   [ Vertex (4) [0, 1, 1, 1], Vertex(4) [1, 1, 1, 1] ]
// ]
```
An [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Vertex](#vertex)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>

### [NCube](#ncube).faces
A list of faces *(or 2-faces)* of an n-cube, represented by an Array of length-4 Arrays of [Vertex](#vertex) objects.
#### Example
```javascript
const nCube = new NCube(4, [0, 1]);
console.log(nCube.faces);
// [
//   [
//     Vertex(4) [0, 0, 0, 0],
//     Vertex(4) [0, 0, 0, 1],
//     Vertex(4) [0, 0, 1, 0],
//     Vertex(4) [0, 0, 1, 1]
//   ],
//   [
//     Vertex(4) [0, 1, 0, 0],
//     Vertex(4) [0, 1, 0, 1],
//     Vertex(4) [0, 1, 1, 0],
//     Vertex(4) [0, 1, 1, 1]
//   ],
//   ...
//   [
//     Vertex(4) [0, 0, 1, 1],
//     Vertex(4) [0, 1, 1, 1],
//     Vertex(4) [1, 0, 1, 1],
//     Vertex(4) [1, 1, 1, 1]
//   ]
// ]
```
An [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Vertex](#vertex)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>

### [NCube](#ncube).getFaces()
Gets the m-faces of an n-cube, represented by an Array of length-2^n Arrays of [Vertex](#vertex) objects. 

In order to avoid confusing nested arrays, m-faces are only represented by the vertices that make them up, not the m-1 faces that make them up *(i.e. the cells of a 4-dimensional cube are represented by 8 vertices rather than 6 faces)*.

#### Parameters
* `m` ([Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)) The dimension of the faces to be retrieved.

#### Examples
```javascript
const nCube = new NCube(4, [0, 1]);
console.log(NCube.getFaces(3));
// [
//   [
//     Vertex(4) [0, 0, 0, 0],
//     Vertex(4) [0, 0, 0, 1],
//     Vertex(4) [0, 0, 1, 0],
//     Vertex(4) [0, 0, 1, 1],
//     Vertex(4) [0, 1, 0, 0],
//     Vertex(4) [0, 1, 0, 1],
//     Vertex(4) [0, 1, 1, 0],
//     Vertex(4) [0, 1, 1, 1]
//   ],
//   ...
// ]
```

Returns an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Vertex](#vertex)<[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>>>