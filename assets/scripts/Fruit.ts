import { Prefab } from 'cc';
import { getRandomInt } from './utils';

const MAX_FALLING_SPEED: number = 5;
const MIN_FALLING_SPEED: number = 1;
const SCORE_SPEED_RATIO: number = 100;

export class Fruit {
    prefab: Prefab | null = null;
    score: number;
    fallSpeed: number;
    name: string;

    constructor(prefab: Prefab | null) {
        if (prefab) {
            const randomSpeed = getRandomInt(MIN_FALLING_SPEED, MAX_FALLING_SPEED);

            this.prefab = prefab;
            this.name = prefab.name;
            this.fallSpeed = randomSpeed;
            this.score = randomSpeed * SCORE_SPEED_RATIO;
        }
    }
}
