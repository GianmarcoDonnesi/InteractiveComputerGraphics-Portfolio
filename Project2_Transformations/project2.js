// Class to represent 3x3 matrices, useful for transformation operations in 2D space.
class Matrix3{
    constructor(a00 = 1, a01 = 0, a02 = 0, 
                a10 = 0, a11 = 1, a12 = 0, 
                a20 = 0, a21 = 0, a22 = 1){
        // Initialize the matrix with either the provided values or the identity matrix by default
        this.elements = [ [a00, a01, a02],
                       [a10, a11, a12],
                       [a20, a21, a22] ];
    }

    // Performs matrix multiplication with another Matrix3 object, returning the result as a new Matrix3
    matrixMultiplication(matrix3_02){
        let outputMatrix = new Matrix3(); // Start with an identity matrix for the result

        // Iterate through rows and columns to compute each element of the result matrix
        for(let row = 0; row < this.elements.length; row++){
            for(let col = 0; col < this.elements[0].length; col++){
                outputMatrix.elements[row][col] = this.elements[row][0] * matrix3_02.elements[0][col] +  
                                                this.elements[row][1] * matrix3_02.elements[1][col] +
                                                this.elements[row][2] * matrix3_02.elements[2][col];
            }
        }
        return outputMatrix;
    }

    // Returns the matrix as a 1D array in column-major order, suitable for WebGL and similar APIs
    getOutputArray(){
        return [this.elements[0][0], this.elements[1][0], this.elements[2][0], 
                this.elements[0][1], this.elements[1][1], this.elements[2][1], 
                this.elements[0][2], this.elements[1][2], this.elements[2][2]];
    }
}

// Generates a transformation matrix for a 2D object, applying scale, then rotation, and finally translation.
function GetTransform(positionX, positionY, rotation, scale){
    let outputMatrix = new Matrix3(); // Starts with an identity matrix

    const theta = rotation * (Math.PI / 180); // Convert rotation from degrees to radians

    // Create a rotation matrix
    let rotateMatrix = new Matrix3(Math.cos(theta), -Math.sin(theta), 0, 
                                   Math.sin(theta), Math.cos(theta), 0, 
                                   0, 0, 1);

    // Create a scaling matrix
    let scaleMatrix = new Matrix3(scale, 0, 0,
                                  0, scale, 0,
                                  0, 0, 1);

    // Create a translation matrix
    let translateMatrix = new Matrix3(1, 0, positionX, 
                                      0, 1, positionY,
                                      0, 0, 1);

    // Combine the transformations: first scale, then rotate, then translate
    outputMatrix = translateMatrix.matrixMultiplication(rotateMatrix.matrixMultiplication(scaleMatrix));

    return outputMatrix.getOutputArray(); // Convert the matrix to column-major order and return
}

// Combines two transformation matrices, applying the first transformation followed by the second.
function ApplyTransform(trans1, trans2){
    // Convert the 1D arrays into Matrix3 objects
    let trans1Matrix = new Matrix3(trans1[0], trans1[3], trans1[6],
                                   trans1[1], trans1[4], trans1[7],
                                   trans1[2], trans1[5], trans1[8]); 
    let trans2Matrix = new Matrix3(trans2[0], trans2[3], trans2[6],
                                   trans2[1], trans2[4], trans2[7],
                                   trans2[2], trans2[5], trans2[8]);  

    // Multiply the matrices, applying trans1 followed by trans2
    let outputMatrix = trans2Matrix.matrixMultiplication(trans1Matrix);  

    return outputMatrix.getOutputArray(); // Convert the result to column-major order and return
}
