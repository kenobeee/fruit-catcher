import { Label } from 'cc';

export class Score {
    /** label displaying the score (left-top screen part) */
    private readonly scoreLabel: Label | null;
    /** current score of the player */
    private score: number;

    /**
     * creates a new instance of the Score class
     * @param scoreLabel - label displaying the score
     */
    constructor(scoreLabel: Label) {
        this.scoreLabel = scoreLabel;
        this.score = 0;
    }

    /**
     * increases the score by the given number of points and updates the UI
     * @param points - number of points to add to the score
     */
    increaseScore(points: number) {
        this.score += points;
        this.updateLabel();
    }

    /** Resets the score to zero and update Label */
    resetScore() {
        this.score = 0;
        this.updateLabel();
    }

    /** updates the score label text with the current score value (UI) */
    private updateLabel() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `${this.score}`;
        }
    }
}
