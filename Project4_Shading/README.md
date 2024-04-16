# Shading

## Overview
In this project, I have enhanced the WebGL-based triangular mesh renderer implemented in the previous project by incorporating shading techniques. This extension focuses on adding realistic lighting effects using the Blinn-Phong shading model to the 3D models rendered on the screen. The renderer now handles vertex normals and includes improved matrix manipulations for better shading effects in the camera space.

## Features
- **Vertex Normals**: The updated `setMesh` method now accepts vertex normals, which are critical for accurate light calculations in the vertex shader. These normals are sent to the vertex shader as another attribute, allowing for dynamic lighting and shading effects based on the light direction and viewer position.
  
- **Matrix Transformations**: The `draw` method has been extended to accept three matrices:
  - **Model-View-Projection Matrix (MVP)**: Transforms vertex positions to the clip space.
  - **Model-View Matrix (MV)**: Used to transform object-space vertex positions to the camera space.
  - **Normal Transformation Matrix**: A 3x3 matrix derived from the model-view matrix to transform normals to the camera space, ensuring that lighting calculations remain consistent despite transformations.
  
- **Dynamic Lighting**: The `setLightDir` method enables dynamic adjustment of the light direction in camera space. This is crucial for maintaining consistent lighting effects as the camera or objects move within the scene.

- **Material Properties**: The `setShininess` method allows for real-time adjustment of the shininess parameter of the Blinn material model, affecting how specular highlights appear on the surface of the objects.

- **Shading in Fragment Shader**: The fragment shader implements the Blinn material model using the provided vertex normals and light direction to calculate diffuse and specular components. The light intensity is assumed to be white `(1,1,1)`, and both the diffuse and specular color coefficients (Kd and Ks) are set to white. If a texture is applied, it replaces the diffuse coefficient (Kd).

## Implementation Details
- **Vertex Shader**: Receives vertex positions, normals, and texture coordinates. It computes the transformed positions and passes them along with the transformed normals to the fragment shader.
  
- **Fragment Shader**: Performs the actual Blinn-Phong lighting computation. It calculates the ambient, diffuse, and specular lighting based on the light direction, view direction, and the normal at each fragment. It adjusts the lighting based on the presence of a texture and the material's shininess.

- **Texture Handling**: If the `showTexture` flag is set and a texture has been applied using `setTexture`, the texture's values are used for the diffuse component of the lighting model.

## User Controls
- **Light Direction**: Users can adjust the light direction using a custom control interface, which directly affects how light interacts with the objects.
- **Light Color**: Users have the ability to specify the color of the light via a color picker. This allows for dynamic changes in the lighting effects based on the chosen color, influencing the overall ambiance and mood of the scene.
- **Highlight Color**: Users can also adjust the color of the highlights, or specular reflections, on the surfaces of objects. This feature is especially useful for simulating different materials which may reflect light in unique colors.
- **Shininess**: The shininess of the material can be adjusted through a slider, allowing users to control the spread and intensity of the specular highlight.
- **Texture Application**: Users can choose to apply a texture to the mesh, which replaces the diffuse color with the texture's color information.

## Testing
The implementation has been tested with various OBJ files and textures from the previous project. The renderer supports both simple and complex models, demonstrating the robustness of the implemented shading techniques under different lighting and viewing conditions.

This enhancement significantly improves the visual quality of the 3D models rendered in the WebGL context, providing more realistic and visually appealing results.