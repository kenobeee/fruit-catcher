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
    private screenSize: { width: number, height: number };
    private canvas;

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.timer = new Timer(this.timerLabel);
        this.score = new Score(this.scoreLabel);
        this.timer.startTimer();
        this.screenSize = screen.windowSize;
        this.canvas = director.getScene().getChildByName('Canvas');
        this.fruitsList = this.fruitPrefabs.map((prefab) => new Fruit(prefab));

        const collider = this.bucket.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.contactHandler, this);
        this.schedule(() =>
            this.fallFruits(),
            this.fruitsMakingInterval
        );
    }

    onMouseMove(event: EventMouse) {
        const newBucketXPosition = event.getLocation().x - this.screenSize.width / 2;
        const newBucketYPosition = this.bucket.getPosition().y;

        this.bucket.setPosition(newBucketXPosition, newBucketYPosition);
    }

    private fallFruits() {
        const fruit = instantiate(this.fruitsList[getRandomInt(0, this.fruitsList.length - 1)].prefab);

        const xSpawn = getRandomInt(-(this.screenSize.width / 2), this.screenSize.width / 2);
        const ySpawn = this.screenSize.height / 2;

        fruit.setParent(this.canvas);
        fruit.setPosition(xSpawn, ySpawn);

        this.scheduleOnce(() => {
            Fruit.removeFruit(fruit);
        }, this.fruitsRemovingInterval);
    }

    private contactHandler(_, {node: contactedNode}: Collider2D) {
        const caughtFruit = this.fruitsList.find((fruit) =>
            fruit.name === contactedNode.name);

        if (caughtFruit) {
            this.score.increaseScore(caughtFruit.score);
            Fruit.removeFruit(contactedNode);
        }
    }
}
