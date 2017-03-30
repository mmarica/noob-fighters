import Cemetery from './Playground/Cemetery'
import Forest from './Playground/Forest'

export default class {
    /**
     * Constructor
     *
     * @param game Game object
     */
    constructor(game) {
        this.game = game
    }

    /**
     * Get a {type: name} list of all playgrounds
     */
    getList() {
        return {
            cemetery: "Cemetery",
            forest: "Forest",
        }
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
        }
    }
}
