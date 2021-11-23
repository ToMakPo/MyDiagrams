const editIconPath  = 'M 2 22 L 2 17 L 7 12 L 7 12 L 12 7 L 12 7 L 17 2 L 22 7 L 17 12 L 17 12 L 12 17 L 12 17 L 7 22 L 2 22 Z'
const closeIconPath = 'M 2 17 L 2 17 L 7 12 L 2  7 L  7 2 L 12 7 L 17 2 L 22 7 L 17 12 L 22 17 L 17 22 L 12 17 L 7 22 L 7 22 Z'

/** Diagram class
 * @class Diagram
 */
class Diagram {
    static #gridTypes = {
        LINES: 'lines',
        DOTS: 'dots'
    }

    static #width = 800
    static #height = 800
    static #borderRadius = 5
    static #showGrid = true
    static #gridSpacing = 10
    static #gridMajor = 5
    static #gridType = Diagram.gridTypes.LINES
    static #snapToGrid = true
    static #items = {}
    static #itemsByType = {}
    static #edit = true
    static #selectedItem = null
    static #snapToAngle = true
    static #snapAngle = 5

    static #mouseX = 0
    static #mouseY = 0

    static #canCreateComponent = false
    static #duration = 100

    /** Get the width for the diagram.
     * @returns {number}
     */
    static get width() {
        return Diagram.gridSnap(Diagram.#width)
    }
    /** Set the width for the diagram.
     * @param {number}
     */
    static set width(value) {
        Diagram.#width = clamp(value, 10000, 100)
        Diagram.draw()
    }

    /** Get the height for the diagram.
     * @returns {number}
     */
    static get height() {
        return Diagram.gridSnap(Diagram.#height)
    }
    /** Set the height for the diagram.
     * @param {number}
     */
    static set height(value) {
        Diagram.#height = clamp(value, 10000, 100)
        Diagram.draw()
    }
    /** Get the border radius for the diagram.
     * @returns {number}
     */
    static get borderRadius() {
        return clamp(Diagram.#borderRadius, Diagram.maxBorderRadius)
    }
    /** Set the height for the diagram.
     * @param {number}
     */
    static set borderRadius(value) {
        Diagram.#borderRadius = clamp(value, 10000)
        Diagram.draw()
    }
    /** Get the maximum border radius for the diagram.
     * @returns {number}
     */
    static get maxBorderRadius() {
        return Math.min(Diagram.width, Diagram.width) / 2
    }

    /** Get the show grid option for the diagram.
     * @returns {boolean}
     */
    static get showGrid() {
        return Diagram.#showGrid
    }
    /** Set the show grid option for the diagram.
     * @param {boolean} value
     */
    static set showGrid(value) {
        Diagram.#showGrid = value

        if (value) {
            $('#draw-area #grid').show(Diagram.#duration)
        } else {
            $('#draw-area #grid').hide(Diagram.#duration)
        }
    }
    /** Toggle the show grid option for the diagram.
     */
    static toggleGrid() {
        Diagram.showGrid = !Diagram.showGrid
    }

    /** Get the grid spacing option for the diagram.
     * @returns {number}
     */
    static get gridSpacing() {
        return Diagram.#gridSpacing
    }
    /** Set the grid spacing option for the diagram.
     * @param {number} value The number of pixels between each line.
     */
    static set gridSpacing(value) {
        Diagram.#gridSpacing = clamp(value, 99999, 5)
        Diagram.draw()
    }

    /** Get the grid major option for the diagram.
     * @returns {number}
     */
    static get gridMajor() {
        return Diagram.#gridMajor
    }
    /** Set the grid major option for the diagram.
     * @param {number} value The count of the bold lines of the grid. If 0, then no major grid will be drawn.
     */
    static set gridMajor(value) {
        Diagram.#gridMajor = value <= 0 ? 0 : clamp(value, 99999, 1)
        Diagram.draw()
    }

    /** Get the grid type option for the diagram.
     * @returns {string}
     */
    static get gridType() {
        return Diagram.#gridType
    }
    /** Set the grid type option for the diagram.
     * @param {string} value
     */
    static set gridType(value) {
        if (Object.values(Diagram.gridTypes).includes(value)) {
            Diagram.#gridType = value
        } else {
            Diagram.#gridType = Diagram.gridTypes.LINES
        }
        Diagram.draw()
    }
    /** Get the grid types for the diagram.
     * @returns {string}
     */
    static get gridTypes() {
        return Object.assign({}, Diagram.#gridTypes)
    }

    /**  Get the snap to grid option for the diagram.
     * @returns {boolean}
     */
    static get snapToGrid() {
        return Diagram.#snapToGrid
    }
    /** Set the snap to grid option for the diagram.
     * @param {boolean} value
     */
    static set snapToGrid(value) {
        Diagram.#snapToGrid = value
        Diagram.draw()
    }
    /** Snap a value to the grid.
     * @param {number} value 
     * @returns The new number.
     */
    static gridSnap(value) {
        if (Diagram.snapToGrid) {
            const spacing = Diagram.gridSpacing
            return spacing <= 0 ? 0 : Math.round(value / spacing) * spacing
        } else {
            return value
        }
    }

    /**  Get the snap to angle option for the diagram.
     * @returns {boolean}
     */
    static get snapToAngle() {
        return Diagram.#snapToAngle
    }
    /** Set the snap to grid option for the diagram.
     * @param {boolean} value
     */
    static set snapToAngle(value) {
        Diagram.#snapToAngle = value
        Diagram.drawItems()
    }
    /**  Get the snap angle option for the diagram.
     * @returns {number}
     */
    static get snapAngle() {
        return Diagram.#snapAngle
    }
    /** Set the snap grid option for the diagram.
     * @param {number} value
     */
    static set snapAngle(value) {
        Diagram.#snapAngle = clamp(value, 90, 5)
        Diagram.drawItems()
    }
    /** Snap a value to the grid.
     * @param {number} value 
     * @returns The new number.
     */
    static angleSnap(value) {
        if (Diagram.snapToAngle) {
            const angle = Diagram.#snapAngle
            return angle = Math.round(value / angle) * angle
        } else {
            return value
        }
    }

    /** Get the selected item for the diagram.
     * @returns {Item}
     */
    static get selectedItem() {
        return Diagram.#selectedItem
    }
    /** Set the selected item for the diagram.
     * @param {Item} item 
     */
    static set selectedItem(item) {
        if (item != null) {
            Diagram.#selectedItem = item
            item.showMenuOptions()
        } else {
            $('.menu-options').hide()
        }
    }

    /** Get the mouse x and y coordinates for the diagram. 
     * @returns {{x:number, y:number}}
     */
    static get mouse() {
        return {
            x: Diagram.#mouseX,
            y: Diagram.#mouseY
        }
    }

    /**  Get the edit option for the diagram.
     * @returns {boolean}
     */
    static get edit() {
        return Diagram.#edit
    }
    /** Set the edit option for the diagram.
     * @param {boolean} value
     */
    static set edit(value) {
        Diagram.#edit = value

        if (value) {
            $('#options').show(Diagram.#duration)
        } else {
            $('#options').hide(Diagram.#duration)
        }

        const timeline = anime.timeline({
            duration: 1000
        })

        timeline.add({
            targets: '#edit-options-icon-button path',
            d: [{value: value ? closeIconPath : editIconPath}]
        })
    }

    /** Add an item to the diagram.
     * @param {Item} item The item to be added.
     * @returns {Item} The item that was added in.
     */
    static addItem(item) {
        Diagram.#items[item.id] = item

        if (!Diagram.#itemsByType.hasOwnProperty(type)) {
            Diagram.#itemsByType[item.type] = {}
        }
        Diagram.#itemsByType[item.type][item.id] = item

        return item
    }
    /** Remove an item from the diagram.
     * @param {Item} item The item to be removed.
     * @returns {Item} The item that was just removed.
     */
    static removeItem(item) {
        delete Diagram.#items[item.id]
        delete Diagram.#itemsByType[item.type][item.id]

        return item
    }

    /** Get an item by it's id.
     * @param {string} id The id to be looked up
     * @returns {Item} The item that was found.
     */
    static getItem(id) {
        return Diagram.#items[id]
    }
    /** Get a list of all items.
     * @returns {Item[]}
     */
    static getAllItems() {
        return Object.values(Diagram.#items)
    }
    /**  Get a list of all items of a certian type.
     * @param {string} type
     * @returns {Item[]}
     */
    static getAllItemsByType(type) {
        return Object.values(Diagram.#itemsByType[type])
    }

    /**Generate a unique id.
     * @returns {string} The generated id.
     */
    static generateUniqueId() {
        let id = null
        do {
            id = Math.floor(Math.random() * 36**9).toString(36).toUpperCase().padStart(9, '0')
        } while (Diagram.#items.hasOwnProperty(id))
        return id
    }

    /** Create the initial elements for this diagram.
     */
    static initialize() {
        $(document).click(Diagram.#documnet_Click)
    
        const diagram = $('#diagram').empty()
        const options = $('<aside>')
            .attr('id', 'options')
            .addClass('c3')
        if (!Diagram.edit) options.hide()
        const drawArea = $(svgElement('svg'))
            .attr('id', 'draw-area')
            .mousemove(Diagram.#drawArea_MouseMove)
            .click(Diagram.#drawArea_Click)
        diagram.append(options, drawArea)

        const diagramOptions = $('<div>')
            .attr('id', 'diagram-options')
            .addClass('options')
            .addClass('col')
            .addClass('close')
            .append($('<h3>').text('Diagram Options'))
        const globalOptions = $('<div>')
            .attr('id', 'global-options')
            .addClass('options')
            .addClass('col')
            .append($('<h3>').text('Global Options'))
        const componentOptions = $('<div>')
            .attr('id', 'component-options')
            .addClass('options')
            .addClass('menu-options')
            .addClass('col')
            .append($('<h3>').text('Component Options'))
            .hide()
        const connectionOptions = $('<div>')
            .attr('id', 'connection-options')
            .addClass('options')
            .addClass('menu-options')
            .addClass('col')
            .append($('<h3>').text('Connection Options'))
            .hide()
        const optionSpacer = $('<div>')
            .addClass('spacer')
        const fileOptions = $('<div>')
            .attr('id', 'file-options')
            .addClass('options')
            .addClass('col')
            .append($('<h3>').text('File Options'))
        options.append(diagramOptions, globalOptions, componentOptions, connectionOptions, optionSpacer, fileOptions)

        $('.options').append(
            $('<span>')
                .addClass('open')
                .click(Diagram.#diagramOpen_click)
        )

        const diagram_sizeRow = $('<div>')
            .addClass('row')
            .append(
                $('<span>')
                    .addClass('col')
                    .addClass('c6')
                    .addClass('no-gap')
                    .append(
                        $('<label>')
                            .attr('for', 'diagram-width-input')
                            .text('Width'),
                        $('<input>')
                            .attr('id', 'diagram-width-input')
                            .attr('type', 'number')
                            .attr('min', 100)
                            .attr('max', 4000)
                            .on('change', Diagram.#diagramWidthInput_change)
                    ),
                $('<span>')
                    .addClass('col')
                    .addClass('c6')
                    .addClass('no-gap')
                    .append(
                        $('<label>')
                            .attr('for', 'diagram-height-input')
                            .text('Height'),
                        $('<input>')
                            .attr('id', 'diagram-height-input')
                            .attr('type', 'number')
                            .attr('min', 100)
                            .attr('max', 4000)
                            .on('change', Diagram.#diagramHeightInput_change)
                    )
            )
        const diagram_borderRadius = $('<div>')
            .addClass('row')
            .append(
                $('<label>')
                    .attr('for', 'diagram-border-radius-input')
                    .text('Border Radius'),
                $('<input>')
                    .attr('id', 'diagram-border-radius-input')
                    .attr('type', 'number')
                    .attr('min', 0)
                    .attr('max', 99999)
                    .on('change', Diagram.#diagramBorderRadiusInput_change)
            )
        const diagram_gridOptions = $('<div>')
            .attr('id', 'grid-options')
            .addClass('col')
            .css('borderTop', '1px solid black')
            .css('paddingTop', '5px')
            .append(
                $('<div>')
                    .addClass('row')
                    .append(
                        $('<input>')
                            .attr('id', 'diagram-snap-to-grid-check-box')
                            .attr('type', 'checkbox')
                            .attr('checked', Diagram.snapToGrid)
                            .on('change', Diagram.#diagramSnapToGridCheckBox_change),
                        $('<label>')
                            .attr('for', 'diagram-snap-to-grid-check-box')
                            .text('Snap to Grid')
                    ),
                $('<div>')
                        .addClass('row')
                        .append(
                            $('<input>')
                                .attr('id', 'diagram-show-grid-check-box')
                                .attr('type', 'checkbox')
                                .attr('checked', Diagram.showGrid)
                                .on('change', Diagram.#diagramShowGridCheckBox_change),
                            $('<label>')
                                .attr('for', 'diagram-show-grid-check-box')
                                .text('Show Grid')
                        ),
                $('<div>')
                    .addClass('row')
                    .append(
                        $('<label>')
                            .attr('for', 'diagram-grid-type-drop-down')
                            .text('Grid Type'),
                        $('<select>')
                            .attr('id', 'diagram-grid-type-drop-down')
                            .on('change', Diagram.#diagramGridTypeDropDown_change)
                            .append(Object.values(Diagram.gridTypes).map(type => {
                                return $('<option>')
                                    .val(type)
                                    .text(type)
                            }))
                    ),
                $('<div>')
                    .addClass('row')
                    .append(
                        $('<span>')
                            .addClass('col')
                            .addClass('c6')
                            .addClass('no-gap')
                            .append(
                                $('<label>')
                                    .attr('for', 'diagram-grid-spacing-input')
                                    .text('Grid Spacing'),
                                $('<input>')
                                    .attr('id', 'diagram-grid-spacing-input')
                                    .attr('type', 'number')
                                    .attr('min', 5)
                                    .attr('max', 99999)
                                    .on('change', Diagram.#diagramGridSpacingInput_change)
                            ),
                        $('<span>')
                            .addClass('col')
                            .addClass('c6')
                            .addClass('no-gap')
                            .append(
                                $('<label>')
                                    .attr('for', 'diagram-grid-major-input')
                                    .text('Major'),
                                $('<input>')
                                    .attr('id', 'diagram-grid-major-input')
                                    .attr('type', 'number')
                                    .attr('min', 0)
                                    .attr('max', 99999)
                                    .val(Diagram.gridMajor)
                                    .on('change', Diagram.#diagramGridMajorInput_change)
                            )
                    )
            )
        const diagram_angleOptions = $('<div>')
            .attr('id', 'angle-options')
            .addClass('col')
            .css('borderTop', '1px solid black')
            .css('paddingTop', '5px')
            .append(
                $('<div>')
                    .addClass('row')
                    .append(
                        $('<input>')
                            .attr('id', 'diagram-snap-to-angle-check-box')
                            .attr('type', 'checkbox')
                            .attr('checked', Diagram.snapToAngle)
                            .on('change', Diagram.#diagramSnapToAngleCheckBox_change),
                        $('<label>')
                            .attr('for', 'diagram-snap-to-angle-check-box')
                            .text('Snap to Angle')
                    ),
                $('<div>')
                    .addClass('row')
                    .append(
                        $('<label>')
                            .attr('for', 'diagram-snap-angle-input')
                            .text('Snap Angle'),
                        $('<input>')
                            .attr('id', 'diagram-snap-angle-input')
                            .attr('type', 'number')
                            .attr('min', 5)
                            .attr('max', 90)
                            .attr('step', 5)
                            .on('change', Diagram.#diagramSnapAngleInput_change)
                    )
            )

        diagramOptions.append(
            diagram_sizeRow, 
            diagram_borderRadius,
            diagram_gridOptions,
            diagram_angleOptions
        )

        const newComponentButton = $('<button>')
            .attr('id', 'new-component-button')
            .text('Add Component')
            .addClass('c12')
            .click(Diagram.#newComponentButton_Click)
        globalOptions.append(newComponentButton)

        const gridGroup = $(svgElement('g'))
            .attr('id', 'grid')
        const connectionsGroup = $(svgElement('g'))
            .attr('id', 'connections')
        const componentsGroup = $(svgElement('g'))
            .attr('id', 'components')
        const guiGroup = $(svgElement('g'))
            .attr('id', 'gui')
            .append(
                $(svgElement('g'))
                    .attr('id', 'edit-options-icon-button')
                    .addClass('icon-button')
                    .css('transform', `translate(${5}px, ${5}px)`)
                    .click(Diagram.#editOptionsIconButton_click)
                    .append(
                        $(svgElement('rect'))
                            .attr('width', 24)
                            .attr('height', 24)
                            .attr('fill', 'transparent'),
                        $(svgElement('path'))
                            .attr('d', Diagram.edit ? closeIconPath : editIconPath)
                    )
            )
        drawArea.append(gridGroup, connectionsGroup, componentsGroup, guiGroup)

        for (const item of Diagram.getAllItems()) {
            item.initialize()
        }

        guiGroup.append(
            $(svgElement('path'))
                .css('transform', 'translate(200px, 200px)')
                .css('fill', 'red')
                .attr('d', 'M 0 -10 v -5 l 2 2 z')
        )

        Diagram.draw()
    }

    /** Draw the draw area for this diagram.
     */
    static draw() {
        $('#diagram-width-input').val(Diagram.width)
        $('#diagram-height-input').val(Diagram.height)
        $('#diagram-border-radius-input').val(Diagram.borderRadius)
        $('#diagram-grid-type-drop-down').val(Diagram.gridType)
        $('#diagram-grid-spacing-input').val(Diagram.gridSpacing)
        $('#diagram-grid-major-input').val(Diagram.gridMajor)
        $('#diagram-snap-angle-input').val(Diagram.#snapAngle)

        $('.options:not(.close)').children('*:not(h3):not(.open)').show()
        $('.options.close').children('*:not(h3):not(.open)').hide()

        $('#draw-area')
            .attr('width', Diagram.width)
            .attr('height', Diagram.height)
            .css('borderRadius', Diagram.borderRadius)
        
        $('.options')
            .css('borderRadius', clamp(Diagram.borderRadius, 5))
        
        $('#diagram-width-input').attr('step', Diagram.snapToGrid ? 1 : Diagram.gridSpacing)

        Diagram.drawGrid()
    }
    /** Draw the grid for this diagram.
     */
    static drawGrid() {
        const gridGroup = $('#grid')
            .empty()

        if (Diagram.showGrid) {
            if (Diagram.gridType == Diagram.gridTypes.LINES) {
                for (let x = Diagram.gridSpacing, m = 1; x < Diagram.width; x+=Diagram.gridSpacing, m++) {
                    const line = $(svgElement('line'))
                        .addClass('grid-line')
                        .addClass(m % Diagram.gridMajor == 0 ? 'bold' : 'light')
                        .attr('x1', x)
                        .attr('y1', 0)
                        .attr('x2', x)
                        .attr('y2', Diagram.height)
                    gridGroup.append(line)
                }
                for (let y = Diagram.gridSpacing, c = 1; y < Diagram.height; y+=Diagram.gridSpacing, c++) {
                    const line = $(svgElement('line'))
                        .addClass('grid-line')
                        .addClass(c % Diagram.gridMajor == 0 ? 'bold' : 'light')
                        .attr('x1', 0)
                        .attr('y1', y)
                        .attr('x2', Diagram.width)
                        .attr('y2', y)
                    gridGroup.append(line)
                }
            } else
            if (Diagram.gridType == Diagram.gridTypes.DOTS) {
                for (let x = Diagram.gridSpacing, mx = 1; x < Diagram.width; x+=Diagram.gridSpacing, mx++)
                for (let y = Diagram.gridSpacing, my = 1; y < Diagram.height; y+=Diagram.gridSpacing, my++) {
                    const style = (mx % Diagram.gridMajor == 0 && my % Diagram.gridMajor == 0) ? 'bold' : 'light'
                    
                    const dot = $(svgElement('circle'))
                        .addClass('grid-dot')
                        .addClass(style)
                        .attr('cx', x)
                        .attr('cy', y)
                        .attr('r', 1)
                    gridGroup.append(dot)
                }
            }
        }
    }

    /** Toggle the inputs for all menu options.
     * @param {object} options 
     */
    static toggleOptions(options) {
        const isClosed = options.hasClass('close')

        if (isClosed) {
            options.removeClass('close')
            options.children('*:not(h3):not(.open)').show(Diagram.#duration)
        } else {
            options.addClass('close')
            options.children('*:not(h3):not(.open)').hide(Diagram.#duration)
        }
    }

    /** Convert the diagram to a JSON object.
     * @returns {object}
     */
    static toJSON() {
        const data = {
            properties: {
                width: Diagram.#width,
                height: Diagram.#height,
                borderRadius: Diagram.#borderRadius,
                showGrid: Diagram.#showGrid,
                gridSpacing: Diagram.#gridSpacing,
                gridMajor: Diagram.#gridMajor,
                gridType: Diagram.#gridType,
                snapToGrid: Diagram.#snapToGrid,
                snapToAngle: Diagram.#snapToAngle,
                snapAngle: Diagram.#snapAngle
            },
            items: Diagram.getAllItems().map(item => item.toJSON())
        }
        return data
    }
    /** Convert the diagram to a JSON string.
     * @returns {string}
     */
    static toString() {
        return JSON.stringify(Diagram.toJSON())
    }

    static #documnet_Click(event) {
        const targetId = $(event.target).attr('id')

        if (targetId != 'new-component-button' && Diagram.#canCreateComponent) {
            Diagram.#canCreateComponent = false
        }
    }

    static #diagramOpen_click(event) {
        Diagram.toggleOptions($(event.target).parent())
    }
    static #editOptionsIconButton_click() {
        Diagram.edit = !Diagram.edit
    }

    static #diagramWidthInput_change() {
        Diagram.width = $('#diagram-width-input').val()
    }
    static #diagramHeightInput_change() {
        Diagram.height = $('#diagram-height-input').val()
    }
    static #diagramBorderRadiusInput_change() {
        Diagram.borderRadius = $('#diagram-border-radius-input').val()
    }

    static #diagramShowGridCheckBox_change() {
        Diagram.showGrid = $('#diagram-show-grid-check-box').is(':checked')
    }
    static #diagramSnapToGridCheckBox_change() {
        Diagram.snapToGrid = $('#diagram-snap-to-grid-check-box').is(':checked')
    }
    static #diagramGridSpacingInput_change() {
        Diagram.gridSpacing = $('#diagram-grid-spacing-input').val()
    }
    static #diagramGridTypeDropDown_change() {
        Diagram.gridType = $('#diagram-grid-type-drop-down').val()
    }
    static #diagramGridMajorInput_change() {
        Diagram.gridMajor = $('#diagram-grid-major-input').val()
    }

    static #diagramSnapToAngleCheckBox_change() {
        Diagram.#snapToAngle = $('#diagram-snap-to-angle-check-box').is(':checked')
    }
    static #diagramSnapAngleInput_change() {
        Diagram.#snapAngle = $('#diagram-snap-angle-input').val()
    }

    static #drawArea_MouseMove(event) {
        Diagram.#mouseX = event.offsetX
        Diagram.#mouseY = event.offsetY
    }
    static #drawArea_Click(event) {
        event.stopPropagation();
        if (Diagram.#canCreateComponent) {
            Diagram.#canCreateComponent = false
        }
    }
    static #newComponentButton_Click(event) {
        Diagram.#canCreateComponent = true
    }
    static #createComponent() {}
}

$(window).on('load', _ => Diagram.initialize())