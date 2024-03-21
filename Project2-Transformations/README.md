## UAV Simulation Project: Implementing Transformations with JavaScript

### Introduction
The goal of this project is to explore and implement basic transformations using JavaScript, focusing on manipulating graphical objects within a web-based simulation environment. By implementing this project, I gained hands-on experience with transformation matrices and their application in the animation of a UAV and its components.

### Project Description
This project revolves around completing a partially implemented UAV simulation. The core of the simulation has been set up, and the tash was to implement the missing pieces that handle the transformations of the UAV and its propellers. Specifically there are two JavaScript functions that manage these transformations, ensuring that the UAV moves correctly along with its shadow.

### Implementation Tasks
1. **`GetTransform` Function**
   - This function is designed to return a 3x3 transformation matrix based on given parameters that include position (X and Y coordinates for translation), rotation (in degrees), and scale. The matrix applies the transformations in the following order: scale, then rotation, and finally translation. The matrix is returned as a 1D matrix in the larger column format to allow easy manipulation and application in simulation.

2. **`ApplyTransform` Function**
   - The purpose of this function is to combine two 3x3 transformation matrices, representing sequential transformations of a graphical object. This functionality is crucial for integrating local transformations (e.g., of the UAV's propellers) with global transformations (e.g., of the UAV body itself). The resulting combined matrix is returned in the same column-major format.

### Project Files and Structure
- **HTML File (`project2.html`)**: Contains the simulation's HTML structure and references the JavaScript file. It also includes the necessary CSS for basic styling.
- **JavaScript File (`project2.js`)**: This is where there is the implementation of the `GetTransform` and `ApplyTransform` functions. It must be kept in the same directory as the HTML file for the simulation to work correctly.
- **Image Files**: Includes `uav.png` (the UAV), `propeller.png` (the propellers), `shadow.png` (the shadow of the UAV), and `ground.jpg` (background image).

### Testing
- You can test your JavaScript implementation in real-time by pressing the F4 key, which reloads the `project2.js` file without needing to reload the entire webpage.

### Additional Source
- For a demonstration of the expected outcome of the project, please refer to the following link: [UAV Simulation Demo](https://graphics.cs.utah.edu/courses/cs4600/fall2023/?prj=2).

