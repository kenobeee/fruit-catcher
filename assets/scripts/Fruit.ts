import { Prefab } from 'cc';

import {getRandomInt} from './utils';

export class Fruit {
    prefab: Prefab;
    score: number = 0;
    fallSpeed: number = 0;
    name:string;

    private maxFallingSpeed:number = 10;
    private minFallingSpeed:number = 1;
    private scoreSpeedRatio:number = 100;

    constructor(prefab:Prefab) {
        const randomSpeed = getRandomInt(this.minFallingSpeed, this.maxFallingSpeed);

        this.prefab = prefab;
        this.name = prefab.name;
        this.fallSpeed = randomSpeed;
        this.score = randomSpeed * this.scoreSpeedRatio;
    }
}