import { Prefab } from 'cc';
import { getRandomInt } from './utils';

const MAX_FALLING_SPEED: number = 5;
const MIN_FALLING_SPEED: number = 1;
const SCORE_SPEED_RATIO: number = 100;
const NEGATIVE_FRUITS: string[] = ['mushroom'];

export class Fruit {
    prefab: Prefab | null = null;
    score: number | null;
    fallSpeed: number;
    name: string;
    isNegative: boolean;

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
