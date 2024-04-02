import {Prefab, Node, UITransform, instantiate, RigidBody2D} from 'cc';

import {Fruit} from './Fruit';
import {getRandomInt} from './utils';

const FRUITS_GENERATE_INTERVAL: number = 1000; // ms
const FRUITS_REMOVE_INTERVAL: number = 4000; // ms

export class FruitManager {
    patterns: Fruit[];
    private fruitIntervalId: number | null;
    private readonly parentCanvas: Node;
    private canvasSize: UITransform['contentSize'];

    constructor(prefabs: Prefab[], canvas: Node, canvasSize: UITransform['contentSize']) {
        this.patterns = prefabs.map(prefab => new Fruit(prefab));
        this.parentCanvas = canvas;
        this.canvasSize = canvasSize;
    }

    generateRandomFruitOnTheCanvas() {
        const randomFruit = this.patterns[getRandomInt(0, this.patterns.length - 1)];
        const instantiatedFruit = instantiate(randomFruit.prefab);

        const xSpawn = getRandomInt(-(this.canvasSize.width / 2), this.canvasSize.width / 2);
        const ySpawn = this.canvasSize.height / 2 + instantiatedFruit.getComponent(UITransform).contentSize.height;

        instantiatedFruit.setParent(this.parentCanvas);
        instantiatedFruit.setPosition(xSpawn, ySpawn);
        instantiatedFruit.setSiblingIndex(3);
        instantiatedFruit.getComponent(RigidBody2D).gravityScale = randomFruit.fallSpeed;

        setTimeout(() => {
            instantiatedFruit.destroy();
        }, FRUITS_REMOVE_INTERVAL);
    }

    findFruitByNodeName(name: Node['name']): Fruit | undefined {
        return this.patterns.find(fruit => fruit.name === name);
    }

    startFruitsFalling() {
        this.fruitIntervalId = setInterval(() => {
            this.generateRandomFruitOnTheCanvas();
        }, FRUITS_GENERATE_INTERVAL);
    }

    stopFruitsFalling() {
        if (this.fruitIntervalId) {
            clearInterval(this.fruitIntervalId);
            this.fruitIntervalId = null;
        }
    }
}