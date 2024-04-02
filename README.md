# Fruit Catcher Game

## Description
Fruit Catcher Game is a simple 2D game developed using Cocos Creator. The player controls a bucket to catch falling fruits within a limited time. The game features a score system and player lives. The goal is to achieve the highest score possible before running out of lives or time.

## Installation
1. Clone the repository to your local machine.
2. Open the project in Cocos Creator.

## How to Play
1. Use the mouse or touch input to move the bucket horizontally across the screen.
2. Catch fruits falling from the top of the screen by moving the bucket beneath them.
3. Avoid catching negative fruits, as they will decrease your remaining lives.
4. Try to catch as many fruits as possible to increase your score.
5. The game ends when the timer runs out or when all lives are lost.

## Entities
- **GameManager**: Controls the overall flow of the game, including starting, stopping, and restarting the game.
- **Player**: Manages the player's lives and handles actions such as decreasing lives and resetting lives.
- **Score**: Manages the player's score and updates the score label accordingly.
- **Timer**: Controls the countdown timer and updates the timer label.
- **FruitManager**: Handles the generation and removal of fruits on the canvas.
- **Fruit**: Represents individual fruit objects with properties such as fall speed, score value, and whether they are negative.
- **utils**: Contains utility functions such as getRandomInt used throughout the game.

## Credits
- Developed by Nikolai Shaliaev