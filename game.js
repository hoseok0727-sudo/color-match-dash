// Color Match Dash - Simple Phaser 3 Game Example

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#f4f6f8',
    parent: 'game-container',
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    }
};

let player, cursors, colorBlocks, score = 0, scoreText, colors, nextColor, nextColorText, gameOver = false;

function preload() {}

function create() {
    colors = ['0xe17055', '0x00b894', '0x0984e3', '0xfdcb6e'];
    nextColor = Phaser.Utils.Array.GetRandom(colors);

    // Player
    player = this.add.rectangle(200, 520, 80, 20, nextColor).setOrigin(0.5);
    this.physics.add.existing(player, true);

    // Score Text
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '20px Arial', fill: '#555' });

    // Next Color Text
    nextColorText = this.add.text(260, 10, 'Next:', { font: '20px Arial', fill: '#555' });
    this.nextColorBlock = this.add.rectangle(350, 20, 30, 30, nextColor);

    // Blocks Group
    colorBlocks = this.physics.add.group();

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    // Block spawn timer
    this.time.addEvent({
        delay: 800,
        callback: () => spawnBlock.call(this),
        loop: true
    });

    // Collision
    this.physics.add.overlap(player, colorBlocks, matchColor, null, this);
}

function update() {
    if (gameOver) return;
    if (cursors.left.isDown && player.x > 50) {
        player.x -= 8;
    } else if (cursors.right.isDown && player.x < 350) {
        player.x += 8;
    }
}

function spawnBlock() {
    if (gameOver) return;
    const color = Phaser.Utils.Array.GetRandom(colors);
    const x = Phaser.Math.Between(50, 350);
    const block = this.add.rectangle(x, -20, 40, 40, color).setOrigin(0.5);
    this.physics.add.existing(block);
    block.body.setVelocityY(200);
    block.colorValue = color;
    colorBlocks.add(block);

    // Remove blocks out of bounds, end game if missed
    block.update = () => {
        if (block.y > 600) {
            this.physics.world.remove(block.body);
            block.destroy();
            endGame.call(this);
        }
    };
}

function matchColor(player, block) {
    if (block.colorValue === nextColor) {
        score++;
        scoreText.setText('Score: ' + score);
        nextColor = Phaser.Utils.Array.GetRandom(colors);
        this.nextColorBlock.fillColor = nextColor;
        block.destroy();
    } else {
        endGame.call(this);
    }
}

function endGame() {
    if (gameOver) return;
    gameOver = true;
    this.add.text(200, 300, 'Game Over', { font: '32px Arial', fill: '#e17055' }).setOrigin(0.5);
    this.physics.pause();
}

const game = new Phaser.Game(config);
