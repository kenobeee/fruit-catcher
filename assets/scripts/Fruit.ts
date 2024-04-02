import { Prefab } from 'cc';
import { getRandomInt } from './utils';

const MAX_FALLING_SPEED: number = 5;
const MIN_FALLING_SPEED: number = 1;
const SCORE_SPEED_RATIO: number = 100;
const NEGATIVE_FRUITS: string[] = ['mushroom'];

export class Fruit {
    /** prefab of the fruit el */
    prefab: Prefab | null = null;
    /** score obtained when catching the fruit */
    score: number | null;
    /** falling speed of the fruit (gravityScale) */
    fallSpeed: number;
    /** name of the fruit prefab */
    name: string;
    /** flag whether the fruit has negative effects (remove 1 life of the Player) */
    isNegative: boolean;

    /**
     * creates a new instance of the Fruit class
     * @param prefab - prefab of the fruit
     */
    constructor(prefab: Prefab | null) {
        if (prefab) {
            const randomSpeed = getRandomInt(MIN_FALLING_SPEED, MAX_FALLING_SPEED);
            const isNegativeFruit = !(NEGATIVE_FRUITS.indexOf(prefab.name) === -1);

            this.prefab = prefab;
            this.name = prefab.name;
            this.fallSpeed = randomSpeed;
            this.score = isNegativeFruit ? null : randomSpeed * SCORE_SPEED_RATIO;
            this.isNegative = isNegativeFruit;
        }
    }
}
