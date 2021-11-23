/** Abstract Component class
 * @class Component
 * @extends Item
 */
class Component extends Item {
    #width
    #height
    #x
    #y
    #shape = 'rectangle'
    #color
    #angle
    #flipped
    #inverted
    #turned

    static #shapes = {
        rectangle: { // ▭
            name: 'rectangle',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 200,
            defaultHeight: 60,
            defaultColor: '#a670db',
            canFlip: false,
            canInvert: false,
            canTurn: false
        },
        ellipse: { // ◯
            name: 'ellipse',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 60,
            defaultHeight: 60,
            defaultColor: '#dbdb70',
            canFlip: false,
            canInvert: false,
            canTurn: false
        },
        triangle: { // △
            name: 'triangle',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 60,
            defaultHeight: 60,
            defaultColor: '#db70db',
            canFlip: false,
            canInvert: true,  // ▽
            canTurn: true // ▷
        },
        pill: { // 💊
            name: 'pill',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 200,
            defaultHeight: 60,
            defaultColor: '#db7070',
            canFlip: false,
            canInvert: false,
            canTurn: true
        },
        rhombus: { // ◇
            name: 'rhombus',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 200,
            defaultHeight: 60,
            defaultColor: '#8bdb70',
            canFlip: false,
            canInvert: false,
            canTurn: false
        },
        parallelogram: { // ▱
            name: 'parallelogram',
            minWidth: 50,
            minHeight: 20,
            defaultWidth: 200,
            defaultHeight: 60,
            defaultColor: '#dba670',
            canFlip: true,
            canInvert: false,
            canTurn: true
        }
    }

    /**
     * @param {string} id If undefined, then one will be generated.
     * @param {number} width
     * @param {number} height
     * @param {string} shape
     * @param {number} angle
     * @param {boolean} flipped
     * @param {inverted} flipped
     * @param {turned} flipped
     */
    constructor(id, width, height, shape, angle, flipped, inverted, turned) {
        super(id)

        this.width = width || 50
        this.height = height || 50
        this.shape = shape || this.shapes.rectangle
        this.angle = angle || 0
        this.flipped = flipped || false
        this.inverted = inverted || false
        this.turned = turned || false
    }

    /** Get this component's width.
     * @returns {number}
     */
    get width() {
        return Diagram.gridSnap(this.#width)
    }
    /** Set this component's width.
     * @param {number} value
     */
    set width(value) {
        this.#width = clamp(value, Diagram.width, this.minWidth)
    }
    /** Get this component's min width.
     * @returns {number}
     */
    get minWidth() {
        return Component.shapes[this.shape].minWidth
    }

    /** Get this component's height.
     * @returns {number}
     */
    get height() {
        return Diagram.gridSnap(this.#height)
    }
    /** Set this component's height.
     * @param {number} value
     */
    set height(value) {
        this.#height = clamp(value, Diagram.height, this.minHeight)
    }
    /** Get this component's min height.
     * @returns {number}
     */
    get minHeight() {
        return Component.shapes[this.shape].minHeight
    }

    /** Get this component's left most x coordinate.
     * @returns {number}
     */
    get x() {
        return Diagram.gridSnap(this.#x)
    }
    /** Set this component's left most x coordinate.
     * @param {number} value
     */
    set x(value) {
        this.#x = clamp(value, Diagram.width - this.width)
    }

    /** Get this component's upper most y coordinate.
     * @returns {number}
     */
    get y() {
        return Diagram.gridSnap(this.#y)
    }
    /** Set this component's upper most y coordinate.
     * @param {number} value
     */
    set y(value) {
        this.#y = clamp(value, Diagram.height - this.height)
    }

    /** Get this component's shape.
     * @returns {string}
     */
    get shape() {
        return this.#shape
    }
    /** Set this component's shape.
     * @param {string} value
     */
    set shape(value) {
        if (Object.keys(Component.#shapes).includes(value)) {
            this.#shape = value
            this.draw()
        }
    }

    /** Get this component's rotation angle.
     * @returns {number}
     */
    get angle() {
        return Diagram.angleSnap(this.#angle)
    }
    /** Set this component's rotation angle.
     * @param {number} value
     */
    set angle(value) {
        // while (value > 180) value -= 360
        // while (value <= -180) value += 360
        this.#angle = value
        this.draw()
    }
    /** Rotate the component by a given value.
     * @param {number} by 
     * @returns 
     */
    rotate(by) {
        this.angle += by
        return this.angle
    }

    /** Get this component's flipped option.
     * 
     * See also `canInvert` and `canTurn`
     * @returns {boolean} If true, then the shape is flipped in the horizontal direction.
     */
    get flipped() {
        return this.canFlip ? this.#flipped : false
    }
    /** Set this component's flipped option.
     * 
     * See also `inverted` and `turned`
     * @param {boolean} value If true, then the shape will be flipped in the horizontal direction.
     */
    set flipped(value) {
        if (this.canFlip) {
            this.#flipped = value
            this.draw()
        }
    }
    /** Get this component's can flip option.
     * 
     * See also `inverted` and `turned`
     * @returns {boolean} If true, then the shape can be flipped in the horizontal direction.
     */
    get canFlip() {
        return Component.shapes[this.shape].canFlip
    }

    /** Get this component's inverted option.
     * 
     * See also `flipped` and `turned`
     * @returns {boolean} If true, then the shape is inverted in the virtical direction.
     */
    get inverted() {
        return this.canInvert ? this.#inverted : false
    }
    /** Set this component's inverted option.
     * 
     * See also `flipped` and `turned`
     * @param {boolean} value If true, then the shape will be inverted in the virtical direction.
     */
    set inverted(value) {
        if (this.canInvert) {
            this.#inverted = value
            this.draw()
        }
    }
    /** Get this component's can invert option.
     * 
     * See also `canFlip` and `canTurn`
     * @returns {boolean} If true, then the shape can be inverted in the virtical direction.
     */
    get canInvert() {
        return Component.shapes[this.shape].canInvert
    }

    /** Get this component's turned option.
     * 
     * See also `inverted` and `flipped`
     * @returns {boolean} If true, then the shape is turned 90 degreeds around it's center point.
     */
    get turned() {
        return this.canTurn ? this.#turned : false
    }
    /** Set this component's turned option.
     * 
     * See also `inverted` and `flipped`
     * @param {boolean} value If true, then the shape will be turned 90 degreeds around it's center point.
     */
    set turned(value) {
        if (this.canTurn) {
            this.#turned = value
            this.draw()
        }
    }
    /** Get this component's can turn option.
     * 
     * See also `canInvert` and `canFlip`
     * @returns {boolean} If true, then the shape can be turned 90 degreeds around it's center point.
     */
    get canTurn() {
        return Component.shapes[this.shape].canTurn
    }

    /** Create the initial elements for this component.
     * @returns {any} The element.
     */
    initialize() {
        const element = super.initialize()

        const main = $(svgElement('g'))
            .addClass('main')
        const gui = $(svgElement('g'))
            .addClass('gui')
        element.append(main, gui)

        const createCorner = name => {
            const rotatorSize = 20
            return $(svgElement('g'))
                .addClass('corner')
                .addClass(name + '-corner')
                .append(
                    $(svgElement('rect'))
                        .addClass('rotator')
                        .attr('x', -rotatorSize)
                        .attr('y', -rotatorSize)
                        .attr('width', rotatorSize)
                        .attr('width', rotatorSize)
                )
        }

        const guiCorners = $(svgElement('g'))
            .addClass('corners')
            .append(
                $(svgElement('rect'))
                    .addClass('')
            )

        this.draw()
    }
    
    /** Draw this component to the draw area.
     */
    draw() {
        
    }

    /** Convert this component to a JSON object.
     * @returns {object}
     */
    toJSON() {
        const data = super.toJSON()
        data.width = this.#width
        data.height = this.#height
        data.x = this.#x
        data.y = this.#y

        return data
    }
}