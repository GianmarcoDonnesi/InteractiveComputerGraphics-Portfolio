# Rendering 3D Triangular Meshes with WebGL

In this project I have implemented a WebGL-based application that renders a 3D triangular mesh with textures, making use of vertex and fragment shaders for graphical representation. This readme serves as a comprehensive guide to understanding the key functionalities and steps involved in the process.

## Overview

The core objective was to render textured 3D objects efficiently on the GPU using WebGL. The project involved working with 3D transformations, mesh loading, and texture mapping. The workflow was divided into three main steps:

1. **Transformation Matrix Computation:**
   - Implemented a JavaScript function named `GetModelViewProjection` to compute a 4x4 transformation matrix incorporating perspective projection, translations, and rotations.
   - The perspective projection matrix was given as input, alongside translation and rotation parameters. The challenge was to apply these transformations in a specific order to achieve a movement that mimics the [demonstration video](https://www.youtube.com/watch?v=GpvuIMx2ggw&t=1s).

2. **Triangular Mesh Rendering:**
   - Developed the `MeshDrawer` class for rendering the triangular mesh loaded from OBJ files. This class handles WebGL initializations, vertex and texture coordinate setting, axis swapping, and drawing.
   - Utilized a fragment shader code snippet to dynamically adjust fragment colors based on depth, enhancing the visual depth perception.

3. **Texture Displaying:**
   - Enhanced the `MeshDrawer` class to support texture mapping. This included methods for setting the texture image and toggling texture display on the mesh, allowing for visually detailed rendering of objects.

## Key Components and Implementation

### Step 1: Transformation Matrix Computation

- `GetModelViewProjection` function integrates the perspective projection with model transformations. The correct application order of translation and rotation transformations was crucial for achieving realistic object movement and positioning in the 3D space.

### Step 2: Mesh Rendering

- **`setMesh` Method:** Configures the mesh data (vertex positions and texture coordinates). It's designed to adapt to different OBJ files loaded through the UI.
- **`swapYZ` Method:** Provides the option to swap Y and Z axes, accommodating different coordinate system conventions used in OBJ files.
- **`draw` Method:** Executes the rendering process. The fragment shader modifies the green color channel based on the fragment's distance from the camera, creating a depth effect.

### Step 3: Texture Mapping

- **`setTexture` Method:** Assigns a texture image to the mesh, facilitating the rendering of detailed surfaces.
- **`showTexture` Method:** Controls whether the texture is displayed, allowing for easy switching between textured and untextured views.

## Resources and Files

- `project4.html`: Hosts the user interface and integrates various JavaScript/WebGL functionalities.
- `project4.js`: Contains the implementations of `GetModelViewProjection` and `MeshDrawer`, alongside other WebGL setup code.
- `obj.js`: An OBJ file parser that prepares the triangular mesh for rendering.
- `teapot.obj`, `bricks.png`, `nyra.obj`, `nyra.png`: sample models and textures, placed in the folders `/objects` and `/textures`, used to demonstrate the capabilities of the application.

