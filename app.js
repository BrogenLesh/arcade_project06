const snkboard = document.querySelector("#board");
const scoreAmnt = document.querySelector("#scoreText");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");

class SnakeGame {
    constructor(){
        this.ctx = snkboard.getContext("2d");
        this.width = snkboard.width;
        this.height = snkboard.height;
        this.boardBackgrnd = "black";
        this.snkColor = "lightgreen";
        this.snkboarder = "black";
        this.appleColor = "red";
        this.snkSize = 25;
        this.playing = false;
        this.snkPart = {
            xVelocity: this.snkSize,
            yVelocity: 0,
            appleX: null,
            appleY: null
        }
        this.score = 0;
        this.snk = this.getSnkCordinates()
        this.clearBoard();
        this.createApple();
        this.drawApple();
        this.drawSnk();
    }
    getSnkCordinates(){
        return [
            { x: this.snkSize * 3, y: 0 },
            { x: this.snkSize * 2, y: 0 },
            { x: this.snkSize, y: 0 },
            { x: 0, y: 0 },
        ];
    }
    
    nextSpot() {
        if (this.playing) {
            setTimeout(() => {
                this.clearBoard();
                this.drawApple();
                this.moveSnk();
                this.drawSnk();
                this.checkGameOver();
                this.nextSpot();
            }, 100);
        } else {
            this.showGameOver();
        }
    }
    clearBoard() {
        this.ctx.fillStyle = this.boardBackgrnd;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    createApple() {
        const randomApple = (min, max) => {
            let randNum; 
            while (true) {
                randNum = Math.round(
                    (Math.random() * (max - min) + min) / this.snkSize
                ) * this.snkSize;
                if (randNum < 400) {
                    break
                }
            }
            return randNum;
        }
        this.snkPart.appleX = randomApple(0, this.width - this.snkSize);
        this.snkPart.appleY = randomApple(0, this.width - this.snkSize);
    }
    drawApple() {
        this.ctx.fillStyle = this.appleColor;
        this.ctx.fillRect(this.snkPart.appleX, this.snkPart.appleY, this.snkSize, this.snkSize);
    }
    moveSnk() {
        const snkhead = { x: this.snk[0].x + this.snkPart.xVelocity, y: this.snk[0].y + this.snkPart.yVelocity };
        this.snk.unshift(snkhead);
        if (this.snk[0].x == this.snkPart.appleX && this.snk[0].y == this.snkPart.appleY) {
            this.score += 1;
            scoreAmnt.textContent = this.score;
            this.createApple();
        } else {
            this.snk.pop();
        }
    }
    drawSnk() {
        this.ctx.fillStyle = this.snkColor;
        this.ctx.strokeStyle = this.snkboarder;
        this.snk.forEach((snkPiece) => {
            this.ctx.fillRect(snkPiece.x, snkPiece.y, this.snkSize, this.snkSize);
            this.ctx.strokeRect(snkPiece.x, snkPiece.y, this.snkSize, this.snkSize);
        });
    }

    checkGameOver() {
        switch (true) {
            case this.snk[0].x < 0:
                this.playing = false;
                break;
            case this.snk[0].x >= this.width:
                this.playing = false;
                break;
            case this.snk[0].y < 0:
                this.playing = false;
                break;
            case this.snk[0].y >= this.height:
                this.playing = false;
                break;
        }
        for (let i = 1; i < this.snk.length; i += 1) {
            if (this.snk[i].x == this.snk[0].x && this.snk[i].y == this.snk[0].y) {
                this.playing = false;
            }
        }
    }
    showGameOver() {
        this.ctx.font = "75px MV";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
        this.playing = false;
    }
    
}

const newSnakeGame = new SnakeGame()
function startGame() {
    newSnakeGame.playing = true;
    scoreAmnt.textContent = newSnakeGame.score;
    newSnakeGame.drawApple();
    newSnakeGame.nextSpot();
}
function gameReset (){
    newSnakeGame.createApple();
    newSnakeGame.score = 0;
    newSnakeGame.snkPart.xVelocity = newSnakeGame.snkSize;
    newSnakeGame.snkPart.yVelocity = 0;
    newSnakeGame.snk = newSnakeGame.getSnkCordinates()
    newSnakeGame.playing = true;
    scoreAmnt.textContent = newSnakeGame.score;
    newSnakeGame.nextSpot();
}
function movement(press) {
    let pressKey = press.keyCode;
    let LEFT = 37;
    let UP = 38;
    let RIGHT = 39;
    let DOWN = 40;

    let goUp = newSnakeGame.snkPart.yVelocity == -newSnakeGame.snkSize;
    let goDown = newSnakeGame.snkPart.yVelocity == newSnakeGame.snkSize;
    let goRight = newSnakeGame.snkPart.xVelocity == newSnakeGame.snkSize;
    let goLeft = newSnakeGame.snkPart.xVelocity == -newSnakeGame.snkSize;

    switch (true) {
        case pressKey == LEFT && !goRight:
            newSnakeGame.snkPart.xVelocity = -newSnakeGame.snkSize;
            newSnakeGame.snkPart.yVelocity = 0;
            break;
        case pressKey == UP && !goDown:
            newSnakeGame.snkPart.xVelocity = 0;
            newSnakeGame.snkPart.yVelocity = -newSnakeGame.snkSize;
            break;
        case pressKey == RIGHT && !goLeft:
            newSnakeGame.snkPart.xVelocity = newSnakeGame.snkSize;
            newSnakeGame.snkPart.yVelocity = 0;
            break;
        case pressKey == DOWN && !goUp:
            newSnakeGame.snkPart.xVelocity = 0;
            newSnakeGame.snkPart.yVelocity = newSnakeGame.snkSize;
            break;
    }
}
resetButton.addEventListener("click", gameReset);
startButton.addEventListener("click", startGame);
window.addEventListener("keydown", movement);







