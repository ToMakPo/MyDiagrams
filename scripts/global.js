/** Make sure number is within a given range.
 * @param {number} number The number to be checked 
 * @param {number} min Then lower end of the range
 * @param {number} max The upper end of the range
 * @returns {number}
 */
function clamp(number, min, max) {
    max = max || 0
    if (min > max) {
        var temp = min
        min = max
        max = temp
    }

    number = parseFloat(number)

    if (isNaN(number)) return NaN
    if (number <= min) return min
    if (number >= max) return max
    document
    return number
}

/** Get an svg name space element.
 * @param {string} name The tag name of the svg element.
 * @returns {object}
 */
function svgElement(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name)
}

/** Get the height of an equilateral triangle.
 * @param {number} lengthOfSide
 * @returns {number}
 */
function getHeightOfEquilateralTriangle(lengthOfSide) {
    return Math.sqrt(3) / 2 * lengthOfSide
}