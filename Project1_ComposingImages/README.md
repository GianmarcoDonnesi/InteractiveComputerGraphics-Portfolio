In this project, I've developed an alpha compositing function specifically for raster images using JavaScript. This function is a key component of a web-based image compositing application, which is showcased in a video available at the following link: https://youtu.be/QpwfzYpseeo.

The heart of my contribution is the JavaScript function **composite**, which composites a foreground image onto a background image using alpha blending. The function signature is as follows:

```javascript
function composite(bgImg, fgImg, fgOpac, fgPos)
```

This function accepts four parameters:

- `bgImg`: the background image to be modified.
- `fgImg`: the foreground image that is to be composited onto the background image.
- `fgOpac`: the opacity of the foreground image, with its alpha values scaled accordingly.
- `fgPos`: the position of the foreground image on the background image, containing x and y coordinates in pixels. Coordinates `x=0` and `y=0` means that the top-left pixels of both foreground and background images are aligned. The coordinates can also be negative.

The function directly modifies the background image, incorporating the foreground image based on the specified opacity and position. It accommodates different sizes of foreground images and manages cases where the foreground image's position extends beyond the background image's boundaries.

To support this project, I was provided with several files:

- `project1.html`: Contains the full interface implementation, except for the `composite` function.
- `project1.js`: Contains the placeholder for the `composite` function and is included within the `project1.html` file. These files were placed in the same directory for seamless integration.

Additionally, I used various test images located in the `\img` folder, such as `background.png`, `teapot.png`, `u.png`, and `star.png`, to ensure the accurate functionality of the compositing feature.

A helpful development tip is pressing the F4 key to reload the `project1.js` file without needing to refresh the entire page, allowing for rapid testing of the implementation.
