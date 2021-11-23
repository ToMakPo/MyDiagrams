/** Abstract Item class
 * @class Item
 */
class Item {
    #type
    #id
    #elementId
    #optionsId

    /**
     * @param {string} id If undefined, then one will be generated.
     */
    constructor (id) {
        const name = this.constructor.name
        this.#type = name[0].toLowerCase() + name.slice(1)
        this.#id = id || Diagram.generateUniqueId()
        this.#elementId = `#${this.type}-${this.id}`
        this.#optionsId = `#${this.type}-options` 
        Diagram.addItem(this)
    }

    /** Get this item's type.
     * @returns {string}
     */
    get type() {
        return this.#type
    }

    /** Get this item's id.
     * @returns {number}
     */
    get id() {
        return this.#id
    }

    /** Get this item's DOM element.
     * @returns {number}
     */
    get element() {
        return $(this.elementId)
    }

    /** Get this item's element id.
     * @returns {string}
     */
    get elementId() {
        return this.#elementId
    }

    /** Get this item's menu options.
     * @returns {string}
     */
    get menuOptions() {
        return $(this.#optionsId)
    }
    /** Show this item's menu options.
     */
    showMenuOptions() {
        $('.menu-options').hide()
        this.menuOptions.show()
    }
    /** Hide this item's menu options.
     */
    hideMenuOptions() {
        $('.menu-options').hide()
        this.menuOptions.hide()
    }

    /** Remove this item from the diagram.
     * @returns {Item} This item.
     */
    remove() {
        return Diagram.removeItem(this)
    }

    /** Create the initial element for this item.
     * @returns {any} The element.
     */
    initialize() {
        const element = $(svgElement('g'))
            .attr('id', this.elementId)
            .addClass('item')
            .addClass(this.type)
        return element
    }

    /** Draw this item to the draw area.
     */
    draw() {
        throw 'The `Draw` method cannot be called from the abstract Item class.'
    }

    /** Convert this item to a JSON object.
     * @returns {object}
     */
    toJSON() {
        const data = {
            type: this.#type,
            id: this.#id
        }

        return data
    }
    /** Convert this item to a JSON string.
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this.toJSON())
    }
}