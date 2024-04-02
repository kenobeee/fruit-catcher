import { Label, director } from 'cc';
import {GameManager} from './GameManager';

export class Timer {
    private readonly timerLabel: Label | null;
    private timer: number = 29;
    private intervalId: number | null;

    constructor(timerLabel: Label) {
        this.timerLabel = timerLabel;
        this.intervalId = null;
    }

    startTimer() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.updateTimer();
            }, 1000); // каждую секунду обновляем таймер
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private updateTimer() {
        if (this.timerLabel) {
            this.timer -= 1;
            this.timerLabel.string = `${this.timer}`;

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
}
