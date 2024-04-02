import { Label, director } from 'cc';
import {GameManager} from './GameManager';

const TOTAL_TIMER: number = 29;

export class Timer {
    private readonly timerLabel: Label | null;
    private timer: number;
    private intervalId: number | null;

    constructor(timerLabel: Label) {
        this.timerLabel = timerLabel;
        this.intervalId = null;
        this.timer = TOTAL_TIMER;
    }

    startTimer() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.updateTimer();
            }, 1000);
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resetTimer() {
        this.timer = TOTAL_TIMER;
        this.setLabel();
    }

    private updateTimer() {
        if (this.timerLabel) {
            this.timer -= 1;
            this.setLabel();

            if (this.timer <= 0) {
                const gameManager = director
                    .getScene()
                    .getChildByName('GameManager')
                    .getComponent(GameManager);

                gameManager.stopGame();
                this.stopTimer();
            }
        }
    }

    private setLabel() {
        this.timerLabel.string = `${this.timer}`;
    }
}
