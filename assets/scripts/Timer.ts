import { Label, director } from 'cc';
import { GameManager } from './GameManager';

const TOTAL_TIMER: number = 29; // s

export class Timer {
    /** label displaying the timer */
    private readonly timerLabel: Label | null;
    /** current time remaining on the timer */
    private timer: number;
    /** interval ID for the timer update loop */
    private intervalId: number | null;

    /**
     * creates a new instance of the Timer class.
     * @param timerLabel - label displaying the timer
     */
    constructor(timerLabel: Label) {
        this.timerLabel = timerLabel;
        this.intervalId = null;
        this.timer = TOTAL_TIMER;
    }

    /** starts the timer countdown (with TOTAL_TIMER) */
    startTimer() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.updateTimer();
            }, 1000);
        }
    }

    /** stops the timer countdown */
    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /** resets the timer to its initial duration */
    resetTimer() {
        this.timer = TOTAL_TIMER;
        this.updateLabel();
    }

    /** updates the timer countdown by decreasing the remaining time and updating the label + compare for 0 -> stop game */
    private updateTimer() {
        if (this.timerLabel) {
            this.timer -= 1;
            this.updateLabel();

            if (this.timer <= 0) {
                const gameManager = director
                    .getScene()
                    .getChildByName('GameManager')
                    .getComponent(GameManager);

                gameManager.stopGame();
            }
        }
    }

    /** updates the label text */
    private updateLabel() {
        if (this.timerLabel) {
            this.timerLabel.string = `${this.timer}`;
        }
    }
}
