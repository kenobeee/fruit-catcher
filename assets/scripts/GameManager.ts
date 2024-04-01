import { _decorator, Component, input, Input, EventMouse, screen, Node, Label} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    bucket: Node = null;

    @property(Label)
    timerLabel: Label;
    @property(Label)
    scoreLabel: Label;

    timer:number = 19;
    score:number = 0

    endGame() {
        this.unschedule(this.updateTimer);
        console.log('end');
    }

    onMouseMove(event: EventMouse) {
        const mousePositionX = event.getLocation().x;
        const canvasWidth = screen.windowSize.width;

        if (this.bucket) {
            this.bucket.setPosition(mousePositionX - canvasWidth / 2, this.bucket.getPosition().y);
        }
    }

    updateTimer() {
        if (this.timerLabel) {
            this.timer -= 1;
            this.timerLabel.string = `${this.timer}`;

            if (this.timer <= 0) this.endGame();
        }
    }

    onLoad() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        this.schedule(this.updateTimer, 1);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
}
