# Ray Tracing

## Overview
In this project, I have implemented a software ray tracer that operates on the GPU using GLSL. The ray tracer integrates with a WebGL framework provided in an HTML interface, where users can interact with various rendering modes including *full ray tracing* and *hybrid* approaches combining rasterization and ray tracing.

## Project Description
The ray tracer was developed to render scenes consisting of multiple spheres and point light sources. The primary feature of this project is the implementation of the ray tracing algorithm, which is executed within a fragment shader for each pixel of the screen. This approach simulates realistic lighting, including shadows and reflections.

## Rendering Modes
- **Rasterization:** This mode uses WebGL's rasterization capabilities to draw spheres as triangular meshes. It is implemented but lacks detailed shadowing and inter-sphere reflections.
- **Ray Tracing:** This mode renders scenes entirely through ray tracing, starting with drawing a screen-covering quad. The heavy lifting is done in the fragment shader, where the `RayTracer` function, written in GLSL, computes the color of each pixel based on light interactions.
- **Rasterization + Ray Tracing:** Combines rasterization for basic rendering and ray tracing for enhanced effects like reflections and shadows. The fragment shader for this mode calls both the `RayTracer` and `Shade` functions.

## Implementation
The GLSL code, which forms the core of the ray tracing logic, is integrated into the `project6.js` file. This script includes essential functions such as `RayTracer`, `IntersectRay`, and `Shade`, which were outlined in the provided shader script:

### IntersectRay
Determines if and where a ray intersects with any sphere in the scene. It updates the `HitInfo` structure with details of the intersection.

### Shade
Calculates the color at a point based on the material properties and the lighting conditions, including shadows and light contributions from multiple sources.

### RayTracer
Acts as the main entry point for ray tracing within the fragment shader. It uses recursive ray tracing to handle reflections and manages interactions with the environment map for rays that do not hit any object.

## Tools and Tips
- **F4 Key:** Pressing F4 reloads the `project6.js` file and recompiles the shaders without needing to refresh the entire page, allowing for rapid testing and development iterations.

## Files
- **project6.html:** Contains the UI implementation and the WebGL setup.
- **project6.js:** Includes the JavaScript representation of the GLSL shader code necessary for ray tracing.

This implementation significantly enhances the visual realism of the rendered scenes by accurately simulating the effects of light such as shadows and reflections. The use of GLSL for GPU-accelerated computations ensures the rendering performance is optimal even with complex scenes.