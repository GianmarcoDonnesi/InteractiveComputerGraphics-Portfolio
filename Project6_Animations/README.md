# Mass-Spring System Simulation

In this project, I have implemented a physically-based simulation using a mass-spring system.

## Project Overview

The primary task for this project was to implement the simulation time stepping function `SimTimeStep` in JavaScript. This function is responsible for advancing the simulation by updating the positions and velocities of particles in the system based on the forces acting on them.

## Function Implementation

### SimTimeStep

The `SimTimeStep` function takes the following parameters:
- `dt`: The time step size.
- `positions`: An array of 3D vector objects representing the positions of the mass particles.
- `velocities`: An array of 3D vector objects representing the velocities of the mass particles.
- `springs`: An array of objects representing the springs, each containing the indices of the two particles it connects and the rest length.
- `stiffness`: The spring stiffness coefficient.
- `damping`: The damping coefficient.
- `particleMass`: The mass of each particle.
- `gravity`: The gravitational acceleration vector.
- `restitution`: The restitution coefficient for collisions with the box walls.

#### Steps Implemented:

1. **Force Calculation**:
    - **Spring Forces**: Calculated based on Hooke's Law, applied in the direction of the spring's extension.
    - **Damping Forces**: Applied to simulate energy loss, proportional to the relative velocity of the particles.
    - **Gravitational Forces**: Added to each particle.

2. **Velocity Update**:
    - Accelerations are calculated from the net forces and used to update the velocities.

3. **Position Update**:
    - New positions are calculated based on the updated velocities.

4. **Collision Handling**:
    - Ensures particles remain inside a cube extending from -1 to 1 in all three dimensions, adjusting velocities and positions to handle collisions with the box walls.

### Other Files Provided

- `project7.html`: contains the implementation of the user interface and various JavaScript/WebGL functionalities.
- `project7.js`: contains the implementation for the `SimTimeStep` function and other necessary classes and functions.
- `obj.js`: implements the OBJ parser and includes additional functionalities required for this project.
- `teapot-low.obj`: a low-resolution Utah Teapot model, suitable for real-time mass-spring simulation.
- `bricks.png`: a brick texture, suitable for enhancing the visual realism of the mass-spring simulation.

### Display and Shading

In addition to the `SimTimeStep` function, the code from the previous project, "Project4_Shading", was used to handle the display and shading functionalities. This ensures the correct rendering of the simulated object in the WebGL context.

## Demo

A demo showing what the finished project should look like can be found [here](https://www.youtube.com/watch?time_continue=187&v=Kpep7eWHQBM&embeds_referring_euri=https%3A%2F%2Fgraphics.cs.utah.edu%2F&source_ve_path=MzY4NDIsMzY4NDIsMzY4NDIsMjg2NjY&feature=emb_logo) (*CS 4600 - Project 7 Demo*).