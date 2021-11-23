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
    #strokeStyle
    #angle
    #flipped
    #inverted
    #turned

    static #strokeStyles = ['solid', 'dash', 'none']

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
            const x = (name[1] == 'l' ? -1 : name[1] == 'r' ? 1 : 0)
            const y = (name[0] == 't' ? -1 : name[0] == 'b' ? 1 : 0)


            const rotator = (size) => {
                const rx = Math.round(size * 0.75) * x
                const ry = Math.round(size * 0.75) * y
                const ix = Math.round(size * 0.52509)
                const iy = Math.round(size * 0.17151)
                const ox = Math.round(size * 0.92151)
                const oy = Math.round(size * 0.22491)

                return $(svgElement('g'))
                    .addClass('rotator')
                    .attr('fill', 'none')
                    .append(
                        $(svgElement('circle')) //TODO: remove this
                            .attr('cx', 0)
                            .attr('cy', 0)
                            .attr('r', 1),
                        $(svgElement('rect'))
                            .attr('x', size * x)
                            .attr('y', size * y)
                            .attr('width', size)
                            .attr('height', size),
                        $(svgElement('path'))
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2)
                            .attr('d', [
                                'M', rx, 0, 'A', rx, ry, 0, 0, Math.abs(x + y) / 2, 0, ry,
                                'M', ix * x, iy * y, rx, 0, ox * x, oy * y,
                                'M', iy * x, ix * y, 0, ry, oy * x, ox * y
                            ].join(' '))
                    )
            }
            
            const handle = (size) => {
                return $(svgElement('rect'))
                    .addClass('handle')
                    .attr('fill', '#3c6ab5')
                    .attr('x', -size / 2)
                    .attr('y', -size / 2)
                    .attr('rx', 2)
                    .attr('width', size)
                    .attr('height', size)
            }

            return $(svgElement('g'))
                .addClass('corner')
                .addClass(name + '-corner')
                .append(rotator(20), handle(10))
        }

        const guiCorners = $(svgElement('g'))
            .addClass('corners')
            .append(
                $(svgElement('rect'))
                    .addClass('selected-outline')
                    .attr('stroke', 'blue')
                    .attr('strokeWidth', 2)
                    .attr('fill', 'none'),
                createCorner('tl'),
                createCorner('tr'),
                createCorner('br'),
                createCorner('bl')
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