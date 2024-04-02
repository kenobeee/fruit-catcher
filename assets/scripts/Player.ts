import { Label, Prefab, instantiate, UITransform, director } from 'cc';
import {GameManager} from './GameManager';

const TOTAL_PLAYER_LIVES = 3;
const HEART_PREFAB_WIDTH = 50;
const HEART_PREFAB_HEIGHT = 50;
const DISTANCE_BETWEEN_HEARTS = 0.5; // ratio

export class Player {
    private readonly playerLifeLabel: Label | null;
    private readonly heartPrefab: Prefab | null;
    private lifeCounter: number;

    constructor(playerLifeLabel: Label, heartPrefab: Prefab) {
        this.playerLifeLabel = playerLifeLabel;
        this.heartPrefab = heartPrefab;
        this.lifeCounter = TOTAL_PLAYER_LIVES;
    }

    decreaseLife() {
        this.lifeCounter--;
        this.removeHeartFromLabel();

        if (this.lifeCounter === 0) {
            const gameManager = director
                .getScene()
                .getChildByName('GameManager')
                .getComponent(GameManager);

            gameManager.stopGame();
        }
    }

    resetLife() {
        this.lifeCounter = TOTAL_PLAYER_LIVES;
        this.insertHeartsIntoLabel();
    }

    private removeHeartFromLabel() {
        const lastChild = this.playerLifeLabel.node.children[this.playerLifeLabel.node.children.length - 1];
        lastChild.destroy();
    }

    private insertHeartsIntoLabel() {
        for (let i = 0; i < this.lifeCounter; i++) {
            const instantiatedHeart = instantiate(this.heartPrefab);
            instantiatedHeart.getComponent(UITransform).setContentSize(HEART_PREFAB_WIDTH, HEART_PREFAB_HEIGHT);

            instantiatedHeart.setParent(this.playerLifeLabel.node);
            instantiatedHeart.setPosition(i * DISTANCE_BETWEEN_HEARTS * HEART_PREFAB_WIDTH, 0);
        }
    }
}
