import Cemetery from './Playground/Cemetery'
import Forest from './Playground/Forest'
import Moon from './Playground/Moon'

export default class {
    /**
     * Constructor
     *
     * @param game Game object
     */
    constructor(game) {
        this.game = game

        this.list = {
            cemetery: "Cemetery",
            forest: "Forest",
            moon: "Moon",
        }

        this.types = []
        for (let type in this.list)
            this.types.push(type)
    }

    /**
     * Get a {type: name} list of all playgrounds
     */
    getList() {
        return this.list
    }

    /**
     * Get a list of all playgrounds types
     */
    getTypes() {
        return this.types
    }

    /**
     * Instantiate playground object of specified type
     *
     * @param type Playground type
     */
    create(type) {
        switch (type) {
            case "cemetery":
                return new Cemetery(this.game)

            case "forest":
                return new Forest(this.game)

            case "moon":
                return new Moon(this.game)
        }
    }
}
