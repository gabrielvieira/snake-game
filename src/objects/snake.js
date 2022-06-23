import Phaser from "phaser";

const Directions = {
    right: "right",
    left: "left",
    up: "up",
    down: "down"
}

export class SnakeGameObject
{
    constructor(scene) {
        this.scene = scene;
        this.nodes = [
            new Phaser.GameObjects.Rectangle(scene, 155, 200, 40, 40, 0x6666ff),
            new Phaser.GameObjects.Rectangle(scene, 110, 200, 40, 40, 0x6666ff),
            new Phaser.GameObjects.Rectangle(scene, 65, 200, 40, 40, 0x6666ff),
            new Phaser.GameObjects.Rectangle(scene, 20, 200, 40, 40, 0x6666ff),
        ];
        this.direction = Directions.right
    }

    add() {
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            this.scene.add.existing(node);
            this.scene.physics.add.existing(node);
        }
    }

    handleCursor(cursors) {

        if (cursors.left.isDown)
        {
            this.direction = Directions.left
        }
        else if (cursors.right.isDown)
        {
            this.direction = Directions.right
        }
        else if (cursors.up.isDown)
        {
            this.direction = Directions.up
        }
        else if (cursors.down.isDown)
        {
            this.direction = Directions.down
        }
    }

    move() {

        let prevPosition = this.nodes[0].getBounds();
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];

            if (i == 0) {
                if (this.direction == Directions.left)
                {
                    node.setPosition(prevPosition.centerX - 45,  prevPosition.centerY);
                }
                if (this.direction == Directions.right)
                {
                    node.setPosition(prevPosition.centerX + 45,  prevPosition.centerY);
                }
                if (this.direction == Directions.up)
                {
                    node.setPosition(prevPosition.centerX, prevPosition.centerY - 45);
                }
                if (this.direction == Directions.down)
                {
                    node.setPosition(prevPosition.centerX, prevPosition.centerY + 45);
                }
            } else {
                let buff = node.getBounds();
                node.setPosition(prevPosition.centerX, prevPosition.centerY);
                prevPosition = buff;
            }
            console.log(prevPosition);
            console.log(this.direction);
        }
    }
}