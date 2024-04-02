import { Prefab, Node } from 'cc';

import {getRandomInt} from './utils';

export class Fruit {
    prefab: Prefab;
    score: number = 0;
    fallSpeed: number = 0;
    name:string ;

    maxFruitScore:number = 500;
    minFruitScore:number = 100;
    maxFruitSpeed:number = 50;
    minFruitSpeed:number = 0;

    constructor(prefab:Prefab) {
        this.prefab = prefab;
        this.name = prefab.name;
        this.score = getRandomInt(this.minFruitScore, this.maxFruitScore);
        this.fallSpeed = getRandomInt(this.minFruitSpeed, this.maxFruitSpeed);
    }

    static removeFruit(fruitNode: Node) {
        if (fruitNode && fruitNode.isValid) fruitNode.destroy();
    }
}