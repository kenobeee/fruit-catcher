import { Label, Prefab, instantiate, UITransform, director } from 'cc';
import { GameManager } from './GameManager';

const TOTAL_PLAYER_LIVES = 3; // int
const HEART_PREFAB_WIDTH = 50; // px
const HEART_PREFAB_HEIGHT = 50; // px
const DISTANCE_BETWEEN_HEARTS = 0.5; // ratio

export class Player {
    /** label displaying the player's remaining lives */
    private readonly playerLifeLabel: Label | null;
    /** prefab representing a heart */
    private readonly heartPrefab: Prefab | null;
    /** remaining number of lives for the player */
    private lifeCounter: number;

    /**
     * creates a new instance of the Player class
     * @param playerLifeLabel - label displaying the player's remaining lives.
     * @param heartPrefab - prefab representing a heart.
     */
    constructor(playerLifeLabel: Label, heartPrefab: Prefab) {
        this.playerLifeLabel = playerLifeLabel;
        this.heartPrefab = heartPrefab;
        this.lifeCounter = TOTAL_PLAYER_LIVES;
    }

    /** decreases the player's life count and updates the UI (-1) */
    decreaseLife() {
        this.lifeCounter--;
        this.removeHeartFromLabel();
    }

    /** update the player's life count and updates the UI to INSTA */
    resetLife() {
        this.lifeCounter = TOTAL_PLAYER_LIVES;
        this.insertHeartsIntoLabel();
    }

    /** removes a single heart from the player's life label */
    private removeHeartFromLabel() {
        const lastChild = this.playerLifeLabel.node.children[this.playerLifeLabel.node.children.length - 1];
        lastChild.destroy();

        if (this.lifeCounter === 0) {
            const gameManager = director.getScene().getChildByName('GameManager').getComponent(GameManager);
            gameManager.stopGame();
        }
    }

    /** insta making hearts into the player's life label */
    private insertHeartsIntoLabel() {
        for (let i = 0; i < this.lifeCounter; i++) {
            const instantiatedHeart = instantiate(this.heartPrefab);
            instantiatedHeart.getComponent(UITransform).setContentSize(HEART_PREFAB_WIDTH, HEART_PREFAB_HEIGHT);

            instantiatedHeart.setParent(this.playerLifeLabel.node);
            instantiatedHeart.setPosition(i * DISTANCE_BETWEEN_HEARTS * HEART_PREFAB_WIDTH, 0);
        }
    }
}
