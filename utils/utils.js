// Utility function for multiplying two matrices
export const multiplyVectors = (m1, m2) => m1.map((r, i) => m2[0].map((_, j) => r.reduce((acc, _, n) => acc + m1[i][n] * m2[n][j], 0)));

// Utility function that converts a decimal number to a padded binary string
export const getBinaryStr = (n, padding = 0) => (new Array(padding).fill("0").join("") + (n >>> 0).toString(2)).slice(-padding);

// Utility function that inserts a character into index ind of string str
export const insertIntoStr = (char, str, ind) => `${str.slice(0, ind)}${char}${str.slice(ind)}`;

// Utility function to get the list of integers from 0 to n-1
export const getNList = n => Object.keys(new Array(n).fill(true)).map(key => parseInt(key));

// Utility function that generates a rotation matrix for some fixed axis, plane, hyperplane, etc.
export const getRotationMatrix = (n, a, fix) => new Array(n).fill(new Array(n).fill(0)).map((r, i) => 
    r.map((_, j) => 
        (j === fix && i === fix) ? Math.cos(a) : (j === fix + 1 && i === fix) ? -Math.sin(a) :
        (j === fix && i === fix + 1) ? Math.sin(a) : (j === fix + 1 && i === fix + 1) ? Math.cos(a) : 
        (i === j) ? 1 : 0
    )
);