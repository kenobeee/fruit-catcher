import { Prefab, Node, UITransform, instantiate, RigidBody2D } from 'cc';
import { Fruit } from './Fruit';
import { getRandomInt } from './utils';

const FRUITS_GENERATE_INTERVAL: number = 1000; // ms
const FRUITS_REMOVE_INTERVAL: number = 4000; // ms

/** manages the generation and removal of fruits on the canvas */
export class FruitManager {
    /** list of fruit patterns available for generation */
    patterns: Fruit[];
    /** ID of the fruit generation interval timer */
    private fruitIntervalId: number | null;
    /** parent canvas node where fruits will be generated */
    private readonly parentCanvas: Node;
    private readonly canvasWidth: UITransform['contentSize']['width'];
    private readonly canvasHeight: UITransform['contentSize']['height'];

    /**
     * a new instance of the FruitManager class
     * @param prefabs - list of prefabs for fruit patterns
     * @param canvas - canvas node where fruits will be generated
     * @param canvasSize - size of the canvas
     */
    constructor(prefabs: Prefab[], canvas: Node, canvasSize: UITransform['contentSize']) {
        this.patterns = prefabs.map(prefab => new Fruit(prefab));
        this.parentCanvas = canvas;
        this.canvasWidth = canvasSize.width;
        this.canvasHeight = canvasSize.height;
    }

    /** generates a random fruit on the canvas and then deletes */
    generateRandomFruitOnTheCanvas() {
        const randomFruit = this.patterns[getRandomInt(0, this.patterns.length - 1)];
        const instantiatedFruit = instantiate(randomFruit.prefab);

        const xSpawn = getRandomInt(-(this.canvasWidth / 2), this.canvasWidth / 2);
        const ySpawn = this.canvasHeight / 2 + instantiatedFruit.getComponent(UITransform).contentSize.height;

        instantiatedFruit.setParent(this.parentCanvas);
        instantiatedFruit.setPosition(xSpawn, ySpawn);
        instantiatedFruit.setSiblingIndex(3);
        instantiatedFruit.getComponent(RigidBody2D).gravityScale = randomFruit.fallSpeed;

        setTimeout(() => {
            instantiatedFruit.destroy();
        }, FRUITS_REMOVE_INTERVAL);
    }

    /**
     * finds a fruit pattern by its node name.
     * @param name - name of the fruit node.
     * @returns fruit pattern if found, otherwise undefined.
     */
    findFruitByNodeName(name: Node['name']): Fruit | undefined {
        return this.patterns.find(fruit => fruit.name === name);
    }

    /** starts the interval for generating fruits falling on the canvas */
    startFruitsFalling() {
        this.fruitIntervalId = setInterval(() => {
            this.generateRandomFruitOnTheCanvas();
        }, FRUITS_GENERATE_INTERVAL);
    }

    /** stops the interval for generating fruits falling on the canvas */
    stopFruitsFalling() {
        if (this.fruitIntervalId) {
            clearInterval(this.fruitIntervalId);
            this.fruitIntervalId = null;
        }
    }
}
