import Phaser from "phaser";

const Directions = {
    right: "right",
    left: "left",
    up: "up",
    down: "down"
}

const ReverseDirection = new Map([
    [Directions.right,  Directions.left],
    [Directions.left,  Directions.right],
    [Directions.up,  Directions.down],
    [Directions.down,  Directions.up],
]);

function calcMove(direction) {
    switch (direction) {
        case Directions.right:
            return function (i, j) {
                i += 1;
                return { i, j }
            }
        case Directions.left:
            return function (i, j) {
                i -= 1;
                return { i, j }
            }
        case Directions.up:
            return function (i, j) {
                j -= 1;
                return { i, j }
            }
        case Directions.down:
            return function (i, j) {
                j += 1;
                return { i, j }
            }
    }
}

class SnakeGameObjectPart {
    constructor(gameObject, i, j) {
        this.gameObject = gameObject;
        this.i = i;
        this.j = j;
    }

    move(i, j) {
        this.i = i;
        this.j = j;
        let {x, y} = this.getCoordinates(i, j);
        this.gameObject.setPosition(x, y);
    }

    getCoordinates(i, j) {
        let x = 25;
        let y = 25;
        x += (45 * i);
        y += (45 * j);
        return {x, y}
    }

    getCurrentPosition() {
       let i = this.i;
       let j = this.j;
       return {i, j}
    }
 }

export class SnakeGameObject
{
    constructor(scene) {
        this.scene = scene;
        this.direction = Directions.right;
        this.lastMove = Directions.right;
        this.collisionMatrix = [];
        this.nextMoves = [];
        for (let i = 0; i < 18; i++) {
            this.collisionMatrix[i] = new Array();
            for (let j = 0; j < 14; j++) {
                this.collisionMatrix[i][j] = false
            }
        }
        this.createSnake();
        this.createApple();
    }

    createSnake() {
        this.nodes = [];
        for (let j = 6; j >= 0; j--) {
            let {x, y} = this.getPosition(0, j);
            this.nodes.push(
                new SnakeGameObjectPart(
                    new Phaser.GameObjects.Rectangle(this.scene, x, y, 40, 40, 0x6666ff), 0, j,
                )
            )
            this.collisionMatrix[0][j] = true;
        }

        this.lastTailPosition = this.getPosition(0, 0);
    }

    incrementSnake() {

    }

    createApple() {
        let {x, y} = this.getPosition(10, 10);
        this.apple = new SnakeGameObjectPart(
            new Phaser.GameObjects.Rectangle(this.scene, x, y, 40, 40, 0xFF0000), 10, 10,
        )
    }

    moveApple() {
        let i = Math.floor(Math.random() * 18);
        let j = Math.floor(Math.random() * 14);
        // prevent create apple in save local as snake
        while (this.collisionMatrix[i][j]) {
            i = Math.floor(Math.random() * 18);
            j = Math.floor(Math.random() * 14);
        }
        this.apple.move(i, j);
    }

    reset() {
        //clear snake
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            node.gameObject.destroy();
        }
        //clear
        for (let i = 0; i < 18; i++) {
            for (let j = 0; j < 14; j++) {
                this.collisionMatrix[i][j] = false
            }
        }
        this.createSnake()
    }

    getPosition(i, j) {
        let x = 25;
        let y = 25;
        x += (45 * i);
        y += (45 * j);
        return {x, y}
    }

    add() {
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            this.scene.add.existing(node.gameObject);
        }
        this.scene.add.existing(this.apple.gameObject)
    }

    handleCursor(cursors) {
        let newDirection = this.direction
        if (cursors.left.isDown)
        {
            newDirection = Directions.left;
        }
        else if (cursors.right.isDown)
        {
            newDirection = Directions.right;
        }
        else if (cursors.up.isDown)
        {
            newDirection = Directions.up;
        }
        else if (cursors.down.isDown)
        {
            newDirection = Directions.down;
        }
        if (ReverseDirection.get(newDirection) === this.lastMove) {
            return;
        }
        this.direction = newDirection;

        //pro process snake moves
        let prevPosition = this.nodes[0].getCurrentPosition();
        for (let x = 0; x < this.nodes.length; x++) {
            let node = this.nodes[x];
            let newPosition = prevPosition;
            if (x === 0) {
                let moveFunc = calcMove(this.direction);
                newPosition = moveFunc(prevPosition.i, prevPosition.j);
            } else {
                prevPosition = node.getCurrentPosition();
            }
            this.nextMoves[x] = newPosition;
            this.collisionMatrix[prevPosition.i][prevPosition.j] = false;
            if (x == this.nodes.length -1) {
                this.lastTailPosition = prevPosition;
            }
        }
    }

    validateMove(i, j) {
        if (this.collisionMatrix[i][j]) {
            return false
        }
        return i >= 0 && j >= 0 && i < 18 && j < 14;
    }

    move() {
        let incrementTail = false;
        for (let x = 0; x < this.nodes.length; x++) {
            let newPosition = this.nextMoves[x];
            let node = this.nodes[x];
            if (x == 0) {
                let applePos = this.apple.getCurrentPosition()
                if (applePos.i === newPosition.i && applePos.j == newPosition.j) {
                    incrementTail = true;
                }
            }
            if (!this.validateMove(newPosition.i, newPosition.j)) {
                this.scene.setGameOver();
                return;
            }
            this.nodes[x].move(newPosition.i, newPosition.j);
            node.move(newPosition.i, newPosition.j);
            this.collisionMatrix[newPosition.i][newPosition.j] = true;
        }

        if (incrementTail) {
            this.moveApple();
            this.scene.incrementScore();
            let {x, y} = this.getPosition(this.lastTailPosition.i, this.lastTailPosition.j);
            let newNode = new SnakeGameObjectPart(
                new Phaser.GameObjects.Rectangle(this.scene, x, y, 40, 40, 0x6666ff), this.lastTailPosition.i, this.lastTailPosition.j,
            )
            this.nodes.push(newNode);
            this.scene.add.existing(newNode.gameObject);
        }
        this.lastMove = this.direction;
    }
}