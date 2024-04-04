// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.

function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// Define the rotation matrix for rotation around the X-axis
    let rotateX = [
        1, 0, 0, 0,
        0, Math.cos(rotationX), Math.sin(rotationX), 0,
        0, -Math.sin(rotationX), Math.cos(rotationX), 0,
        0, 0, 0, 1,
    ];

    // Define the rotation matrix for rotation around the Y-axis
    let rotateY = [
        Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
        0, 1, 0, 0,
        Math.sin(rotationY), 0, Math.cos(rotationY), 0,
        0, 0, 0, 1,
    ];

	// Define the translation matrix
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	// Combine the rotation matrices (First apply rotation on Y-axis, then X-axis)
	var rotationMatrix = MatrixMult(rotateY, rotateX);

	// Apply the combined rotation to the translation to form the model matrix
	var modelMatrix = MatrixMult(trans, rotationMatrix);

	// Finally, apply the projection matrix to get the ModelViewProjection matrix
	var mvp = MatrixMult(projectionMatrix, modelMatrix);

	return mvp;
}



class MeshDrawer
{
	constructor()
	{
		// Initializations
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp'); 
		this.yzSwapLoc = gl.getUniformLocation(this.prog, 'yzSwap');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');

		this.vertbuffer = gl.createBuffer(); 
		this.texbuffer = gl.createBuffer();

		this.numTriangles = 0;
		
		this.yz = [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1];
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.

	setMesh( vertPos, texCoords )
	{
		// Update the contents of the vertex buffer objects.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer); 
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		// Update texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer); 
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.

	swapYZ( swap )
	{
		// If true, calculate a new matrix for 'this.yz' by multiplying two matrices
		if(swap){
			this.yz = MatrixMult(
				// The first matrix is an identity matrix modified to invert the Y-axis
				[
					1,0,0,0,
					0,-1,0,0,
					0,0,1,0,
					0,0,0,1
				],
				// The second matrix represents a rotation by 90 degrees around the X-axis 
				[
					1,0,0,0,
					0,Math.cos(Math.PI/2),Math.sin(Math.PI/2),0,
					0,-Math.sin(Math.PI/2),Math.cos(Math.PI/2),0,
					0,0,0,1,
				]
			);
		}else{
			 // If 'swap' is false, reset 'this.yz' to the identity matrix, indicating no transformation
			this.yz = [
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1];
		}
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	
	draw( trans )
	{
		// WebGL initializations before drawing
		gl.useProgram(this.prog); 

		gl.uniformMatrix4fv(this.mvpLoc, false, trans);
		gl.uniformMatrix4fv(this.yzSwapLoc,false, this.yz); 
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer); 
		gl.enableVertexAttribArray( this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0); 

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer); 
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.

	setTexture( img )
	{
		// Bind the texture
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );

		// Set texture parameters 
		gl.generateMipmap(gl.TEXTURE_2D);		

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

		// Set some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.useProgram(this.prog); 
		gl.activeTexture(gl.TEXTURE0); 
		gl.bindTexture(gl.TEXTURE_2D, texture); 
		const sampler = gl.getUniformLocation(this.prog, 'tex');
		gl.uniform1i(sampler,0);

	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	
	showTexture( show )
	{
		// Set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show); 
	}
	
}

const meshVS = `
    		attribute vec3 pos;
    		attribute vec2 texCoord;

    		uniform mat4 mvp;
			uniform mat4 yzSwap;

			varying vec2 v_texCoord;

			void main()
			{
				v_texCoord = texCoord;

				gl_Position = mvp * yzSwap * vec4(pos, 1.0);
			}`;

	
const meshFS = `
			precision mediump float;

			uniform bool showTex;
			uniform sampler2D tex;

			varying vec2 v_texCoord;

			void main()
			{
				if (showTex){
					gl_FragColor = texture2D(tex, v_texCoord);
				}else{
					// If not showing texture, default to a white color
					gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
				}
			}`;
