import { Label } from 'cc';

export class Score {
    private readonly scoreLabel: Label | null;
    private score: number;

    constructor(scoreLabel: Label) {
        this.scoreLabel = scoreLabel;
        this.score = 0;
    }

    increaseScore(points: number) {
        this.score += points;
        this.setLabel();
    }

    resetScore() {
        this.score = 0;
        this.setLabel();
    }

    private setLabel() {
        this.scoreLabel.string = `${this.score}`;
    }
}
