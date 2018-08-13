/*jshint esversion: 6 */

const pixelmatch = require('pixelmatch');
const IS_EQUAL_THRESHOLD = 0.1; // 0.1 means 10% of the pixels can differ and the images are still equal

/**
 * Compares 2 images by counting the no of differing pixels
 * @param {*} img1 
 * @param {*} img2 
 */
const isEqual = (img1, img2) => {
    // Images with different sizes are not equal
    if (img1.height != img2.height) return false;
    if (img1.width != img2.width) return false;

    const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
        threshold: 0.1 // That's the default threshold
    });
    const totalPixels = img1.width * img1.height;
    const maxDiffPixels = totalPixels * IS_EQUAL_THRESHOLD;
    return (diffPixels < maxDiffPixels);
};

const imageArrayIncludesImage = (imageArray, img) => {
    for (i = 0; i < imageArray.length; i++) {
        if (isEqual(img, imageArray[i])) return true;
    }
    return false;
};

exports = {
    isEqual: isEqual,
    imageArrayIncludesImage: imageArrayIncludesImage
};