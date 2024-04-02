import { _decorator, Component, Node, Label, Collider2D, Contact2DType, Vec3, Prefab, Tween, director, input, Input, EventMouse, UITransform, game } from 'cc';
const { ccclass, property } = _decorator;

import { Timer } from './Timer';
import { Score } from './Score';
import { FruitManager } from './FruitManager';
import { Player } from './Player';

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
    @property(Prefab)
    heartPrefab: Prefab;

    @property(Label)
    timerLabel: Label;
    @property(Label)
    scoreLabel: Label;
    @property(Label)
    playerLifeLabel: Label;

    private timer: Timer;
    private score: Score;
    private player: Player;
    private canvas: Node;
    private fruitManager: FruitManager;
    private canvasSize: UITransform['contentSize'];
    private lastContactedFruitUUID: string;

    onLoad() {
        this.canvas = director.getScene().getChildByName('Canvas');
        this.canvasSize = this.canvas.getComponent(UITransform).contentSize;
    }

    start() {
        this.setupGame();
        this.startGame();
    }

    private setupGame() {
        this.setupHandlers();
        this.setupTimerScorePlayer();
        this.setupFruitManager();
    }

    private setupHandlers() {
        game.canvas.style.cursor = CursorTypes.none;
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.bucketSensor
            .getComponent(Collider2D)
            .on(Contact2DType.BEGIN_CONTACT, this.contactHandler, this);
    }

    private setupTimerScorePlayer() {
        this.timer = new Timer(this.timerLabel);
        this.score = new Score(this.scoreLabel);
        this.player = new Player(this.playerLifeLabel, this.heartPrefab);
    }

    private setupFruitManager() {
        this.fruitManager = new FruitManager(this.fruitPrefabs, this.canvas, this.canvasSize);
    }

    private startGame() {
        this.timer.startTimer();
        this.player.resetLife();
        this.fruitManager.startFruitsFalling();
    }

    stopGame() {
        game.canvas.style.cursor = CursorTypes.default; // set the cursor back default view
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.finishModal.active = true; // show the finish modal
        this.fruitManager.stopFruitsFalling();
        this.timer.stopTimer();
    }


    restartGame() {
        this.finishModal.active = false; // hide the finish modal
        this.bucket.setPosition(0, -280); // reset the position of the bucket
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

    /**
     * handle collisions between objects
     * @param _ - current node (not need)
     * @param contactedNode - the node that was contacted
     */
    private contactHandler(_, { node: contactedNode }: Collider2D) {
        const caughtFruit = this.fruitManager.findFruitByNodeName(contactedNode.name);

        if (caughtFruit) {
            const contactedNodeUUID = contactedNode.uuid;

            if (contactedNodeUUID !== this.lastContactedFruitUUID) {
                if (caughtFruit.isNegative) {
                    this.player.decreaseLife();
                } else {
                    this.score.increaseScore(caughtFruit.score);
                }

                this.lastContactedFruitUUID = contactedNode.uuid

                const tween = new Tween(contactedNode);
                tween.to(0.2, { scale: new Vec3(0, 0, 0) });
                tween.start();
            }
        }
    }
}
