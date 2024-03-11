/**
 * This following function performs alpha blending of a foreground image onto a background image.
 * It iterates over each pixel of the foreground image and applies alpha compositing based on the 
 * specified opacity (fgOpac) and the position (fgPos) of the foreground image.
 * Parameters:
 * - bgImg: ImageData of the background image which will be modified in-place.
 * - fgImg: ImageData of the foreground image which will be composited on top of the background.
 * - fgOpac: A float representing the opacity of the foreground image, from 0 (transparent) to 1 (opaque).
 * - fgPos: An object with 'x' and 'y' properties specifying the position of the top-left corner
 *          of the foreground image relative to the background image. Values can be negative.
 * This function first checks whether the foreground image data array has a length equal to width * height * 4,
 * which would mean it's an RGBA image. If not, it assumes it's RGB and applies fgOpac directly as the alpha value. 
 * If an alpha channel is present, it scales the alpha values by fgOpac. This allows the function to properly composite 
 * both RGB and RGBA images onto the background.
 * The function accounts for the possibility of the foreground image extending beyond the bounds 
 * of the background image, in which case, the out-of-bounds sections are not drawn. The result 
 * is a background image that has the foreground image composited onto it according to the alpha
 * values and opacity setting.
 */

function composite(bgImg, fgImg, fgOpac, fgPos) {
    // The dimensions of the foreground and background images
    const bgWidth = bgImg.width;
    const bgHeight = bgImg.height;
    const fgWidth = fgImg.width;
    const fgHeight = fgImg.height;

    // Check if the foreground image has an alpha channel
    const hasAlphaChannel = fgImg.data.length === fgWidth * fgHeight * 4;

    // Iterate over each pixel of the foreground image
    for (let y = 0; y < fgHeight; y++) {
        for (let x = 0; x < fgWidth; x++) {
            // Calculate the position on the background image
            const bgX = x + fgPos.x;
            const bgY = y + fgPos.y;

            // Skip pixels outside the background image
            if (bgX < 0 || bgY < 0 || bgX >= bgWidth || bgY >= bgHeight) continue;

            // Calculate the index in the image data array
            const fgIndex = (y * fgWidth + x) * 4;
            const bgIndex = (bgY * bgWidth + bgX) * 4;

            // Foreground pixel's RGBA values
            const fgR = fgImg.data[fgIndex];
            const fgG = fgImg.data[fgIndex + 1];
            const fgB = fgImg.data[fgIndex + 2];
            let fgA;

            // Determine alpha based on the presence of an alpha channel in foreground image
            if (hasAlphaChannel) {
                fgA = fgImg.data[fgIndex + 3] * fgOpac;
            } else {
                fgA = fgOpac * 255; // Use the uniform alpha value if there's no alpha channel
            }

            // Background pixel's RGBA values
            const bgR = bgImg.data[bgIndex];
            const bgG = bgImg.data[bgIndex + 1];
            const bgB = bgImg.data[bgIndex + 2];
            const bgA = bgImg.data[bgIndex + 3];

            // Normalized alpha values
            const fgAlpha = fgA / 255;
            const bgAlpha = bgA / 255;
            const combinedAlpha = fgAlpha + bgAlpha * (1 - fgAlpha);

            // Alpha blending
            bgImg.data[bgIndex]     = (fgR * fgAlpha + bgR * bgAlpha * (1 - fgAlpha)) / combinedAlpha;
            bgImg.data[bgIndex + 1] = (fgG * fgAlpha + bgG * bgAlpha * (1 - fgAlpha)) / combinedAlpha;
            bgImg.data[bgIndex + 2] = (fgB * fgAlpha + bgB * bgAlpha * (1 - fgAlpha)) / combinedAlpha;
            bgImg.data[bgIndex + 3] = combinedAlpha * 255;
        }
    }
}

