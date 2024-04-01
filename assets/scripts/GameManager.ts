import { _decorator, Component, input, Input, EventMouse, screen, Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    bucket: Node = null;

    onMouseMove(event: EventMouse) {
        const mousePositionX = event.getLocation().x;
        const canvasWidth = screen.windowSize.width;

        if (this.bucket) {
            this.bucket.setPosition(mousePositionX - canvasWidth / 2, this.bucket.getPosition().y);
        }
    }

    onLoad() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
}
