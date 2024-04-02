import { _decorator, Component, Node, Label, Collider2D, Contact2DType, Prefab, instantiate, director, screen, input, Input, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

import { Fruit } from './Fruit';
import {Timer} from './Timer';
import {Score} from './Score';
import { getRandomInt } from './utils';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    bucket: Node | null = null;
    @property({ type: [Prefab] })
    fruitPrefabs: Prefab[] = [];
    @property(Label)
    timerLabel: Label | null = null;
    @property(Label)
    scoreLabel: Label | null = null;

    private timer: Timer | null;
    private score: Score | null;
    private fruitsList: Fruit[] = [];
    private fruitsMakingInterval: number = 3;
    private fruitsRemovingInterval: number = 5;

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.timer = new Timer(this.timerLabel);
        this.score = new Score(this.scoreLabel);

        this.timer.startTimer();

        this.fruitsList = this.fruitPrefabs.map((prefab) => new Fruit(prefab));

        if (this.bucket) {
            const collider = this.bucket.getComponent(Collider2D);
            if (collider) {
                collider.on(Contact2DType.BEGIN_CONTACT, this.catchingFruits, this);
            }
        }

        this.schedule(this.fallFruits.bind(this), this.fruitsMakingInterval);
    }

    onMouseMove(event: EventMouse) {
        const mousePositionX = event.getLocation().x;
        const canvasWidth = screen.windowSize.width;

        if (this.bucket) {
            this.bucket.setPosition(mousePositionX - canvasWidth / 2, this.bucket.getPosition().y);
        }
    }

    private fallFruits() {
        const { width: canvasWidth, height: canvasHeight } = screen.windowSize;

        const canvas = director.getScene().getChildByName('Canvas');
        const randomIndex = Math.floor(Math.random() * this.fruitsList.length);
        const fruit = instantiate(this.fruitsList[randomIndex].prefab);

        const horizontalSpawn = getRandomInt(-(canvasWidth / 2), canvasWidth / 2);
        const verticalSpawn = canvasHeight / 2;

        fruit.setParent(canvas);
        fruit.setPosition(horizontalSpawn, verticalSpawn);

        this.scheduleOnce(() => {
            Fruit.removeFruit(fruit);
        }, this.fruitsRemovingInterval);
    }

    private catchingFruits(self: Collider2D, other: Collider2D) {
        const caughtFruit = this.fruitsList.find((fruit) => fruit.name === other.node?.name);

        if (caughtFruit) {
            this.score.increaseScore(caughtFruit.score);

            Fruit.removeFruit(other.node);
        }
    }
}
