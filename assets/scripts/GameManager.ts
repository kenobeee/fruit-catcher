import { _decorator, Component, Node, Label, Collider2D, Contact2DType, Vec3, Prefab, Tween, RigidBody2D, instantiate, director, input, Input, EventMouse, UITransform, game } from 'cc';
const { ccclass, property } = _decorator;

import { Fruit } from './Fruit';
import { Timer } from './Timer';
import { Score } from './Score';
import { getRandomInt } from './utils';

const FRUITS_GENERATE_INTERVAL: number = 1;
const FRUITS_REMOVE_INTERVAL: number = 4;

enum CursorTypes {
    default = 'default',
    none = 'none'
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    bucket: Node;
    @property(Node)
    bucketSensor: Node;
    @property(Node)
    finishModal: Node;

    @property({ type: [Prefab] })
    fruitPrefabs: Prefab[];

    @property(Label)
    timerLabel: Label;
    @property(Label)
    scoreLabel: Label;

    private timer: Timer;
    private score: Score;
    private canvas: Node;
    private canvasSize: UITransform['contentSize'];
    private fruitsList: Fruit[];
    private lastContactedFruitUUID: string;

    start() {
        game.canvas.style.cursor = CursorTypes.none;
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.timer = new Timer(this.timerLabel);
        this.score = new Score(this.scoreLabel);
        this.fruitsList = this.fruitPrefabs.map(prefab => new Fruit(prefab));

        this.canvas = director.getScene().getChildByName('Canvas');
        this.canvasSize = this.canvas.getComponent(UITransform).contentSize;
        this.timer.startTimer();
        this.schedule(this.generateRandomFruit, FRUITS_GENERATE_INTERVAL);
        this.bucketSensor.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.contactHandler, this);
    }
    stopGame() {
        game.canvas.style.cursor = CursorTypes.default;
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.finishModal.active = true;
        this.unschedule(this.generateRandomFruit);
    }
    restartGame() {
        this.finishModal.active = false;
        this.bucket.setPosition(0, -280);
        this.score.resetScore();
        this.timer.resetTimer();

        this.start();
    }

    onMouseMove(event: EventMouse) {
        this.bucket.setPosition(
            event.getLocation().x - this.canvasSize.width / 2,
            this.bucket.position.y
        );
    }

    private generateRandomFruit() {
        const randomFruit = this.fruitsList[getRandomInt(0, this.fruitsList.length - 1)];
        const instantiatedFruit = instantiate(randomFruit.prefab);
        const xSpawn = getRandomInt(-(this.canvasSize.width / 2), this.canvasSize.width / 2);
        const ySpawn = this.canvasSize.height / 2 + instantiatedFruit.getComponent(UITransform).contentSize.height;

        instantiatedFruit.setParent(this.canvas);
        instantiatedFruit.setPosition(xSpawn, ySpawn);
        instantiatedFruit.setSiblingIndex(3);
        instantiatedFruit.getComponent(RigidBody2D).gravityScale = randomFruit.fallSpeed;

        this.scheduleOnce(() => instantiatedFruit.destroy(), FRUITS_REMOVE_INTERVAL);
    }
    private contactHandler(_, { node: contactedNode }: Collider2D) {
        const caughtFruit = this.fruitsList.find(fruit => fruit.name === contactedNode.name);

        if (caughtFruit) {
            const contactedNodeUUID = contactedNode.uuid;

            if (contactedNodeUUID !== this.lastContactedFruitUUID) {
                this.score.increaseScore(caughtFruit.score);
                this.lastContactedFruitUUID = contactedNode.uuid

                const tween = new Tween(contactedNode);
                tween.to(0.2, { scale: new Vec3(0, 0, 0) });
                tween.start();
            }
        }
    }
}
