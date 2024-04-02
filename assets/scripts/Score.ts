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
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }

    resetScore() {
        this.score = 0;
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }
}
