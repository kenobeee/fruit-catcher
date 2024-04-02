import { _decorator, Component, Node, Label, Collider2D, Contact2DType, Vec2, Vec3, Prefab, Tween, RigidBody2D, instantiate, director, screen, input, Input, EventMouse, UITransform, game } from 'cc';
const { ccclass, property } = _decorator;

import {Fruit} from './Fruit';
import {Timer} from './Timer';
import {Score} from './Score';
import { getRandomInt } from './utils';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    bucket: Node | null = null;
    @property(Node)
    bucketSensor: Node | null = null;
    @property({ type: [Prefab] })
    fruitPrefabs: Prefab[] = [];
    @property(Label)
    timerLabel: Label | null = null;
    @property(Label)
    scoreLabel: Label | null = null;

    private timer: Timer | null = null;
    private score: Score | null = null;
    private canvas: Node | null = null;
    private canvasSize: UITransform['contentSize'] | null = null;
    private fruitsList: Fruit[] = [];
    private fruitsMakingInterval: number = 1;
    private fruitsRemovingInterval: number = 4;
    private lastContactedFruitUUID:string | null;

    onLoad() {
        game.canvas.style.cursor = 'none';
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.timer = new Timer(this.timerLabel);
        this.score = new Score(this.scoreLabel);

        this.canvas = director.getScene().getChildByName('Canvas');
        this.canvasSize = this.canvas.getComponent(UITransform).contentSize;

        this.fruitsList = this.fruitPrefabs.map((prefab) => new Fruit(prefab));
    }

    start() {
        this.timer.startTimer();
        this.schedule(this.generateRandomFruit.bind(this), this.fruitsMakingInterval);
        this.bucketSensor.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.contactHandler, this);
    }

    onMouseMove(event: EventMouse) {
        const newBucketXPosition = event.getLocation().x - screen.windowSize.width / 2;
        const newBucketYPosition = this.bucket.getPosition().y;

        this.bucket.setPosition(newBucketXPosition, newBucketYPosition);
    }

    private generateRandomFruit() {
        const randomFruit = this.fruitsList[getRandomInt(0, this.fruitsList.length - 1)];
        const instantiatedFruit = instantiate(randomFruit.prefab);
        const xSpawn = getRandomInt(-(this.canvasSize.width / 2), this.canvasSize.width / 2);
        const ySpawn = this.canvasSize.height / 2 + instantiatedFruit.getComponent(UITransform).contentSize.height;

        instantiatedFruit.setParent(this.canvas);
        instantiatedFruit.setPosition(xSpawn, ySpawn);
        instantiatedFruit.setSiblingIndex(3);
        instantiatedFruit.getComponent(RigidBody2D).linearVelocity = new Vec2(0, -randomFruit.fallSpeed);

        this.scheduleOnce(() => {
            instantiatedFruit.destroy();
        }, this.fruitsRemovingInterval);
    }

    private contactHandler(_, {node: contactedNode}: Collider2D) {
        const caughtFruit = this.fruitsList.find((fruit) =>
            fruit.name === contactedNode.name);

        // caught
        if (caughtFruit) {
            const contactedNodeUUID = contactedNode.uuid;

            if (!(contactedNodeUUID === this.lastContactedFruitUUID)) {
                this.score.increaseScore(caughtFruit.score);
                this.lastContactedFruitUUID = contactedNode.uuid

                const tween = new Tween(contactedNode);
                tween.to(0.1, { scale: new Vec3(0, 0, 0) });
                tween.start();
            }
        }
    }
}
