const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let rainArray = [];
const rainAmmount = 1000;

// Box dimensions and position
const boxImage = new Image();
boxImage.src = 'top-hat.jpg';
let boxWidth = 100;
let boxHeight = 100;

// Mouse position variables
let mouseX = 0;
let mouseY = 0;

// Ball postions and size
let ballSize = 20;
let ballX = 10;
let movingBackward = false;
//Bool for moving ball up and down
let movingDown = false;

//Score and timer varibles for score 
let timerInterval = 500; 
let timer = setInterval(incrementScore, timerInterval);
let scoreValue = 0;
let isBallTouching = true;

let gameRunning = true;



class Particle {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.weight = 1;
        this.directionX = 1;
    }
    update() {
        if (this.y > canvas.height) { 
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
            this.weight = 1;
        }
        this.weight += 0.1;
        this.y += this.weight;
        this.x += this.directionX;

        //reset rain when goes off screen
        if (
            this.x < boxX + boxWidth &&
            this.x + this.size > boxX &&
            this.y < boxY + boxHeight &&
            this.y + this.size > boxY
        ) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
        } 
        


        // handles ball colision with rain
        const distance = Math.sqrt((this.x - ballX) ** 2 + (this.y - ballY) ** 2);
        if (distance < this.size + ballSize) {
            isBallTouching = true;
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;

            // Collision with ball, decrease score value
            if (scoreValue > 0 && isBallTouching){
            scoreValue -= 1;
            console.log(scoreValue);
            } 
        } else {
            isBallTouching = false;
        }


        moveBall();
    }

    drawRain() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill()
    }
}
    


function incrementScore() {
    if (!isBallTouching){
    scoreValue += 2;
    document.getElementById('scoreValue').textContent = scoreValue;
    console.log(scoreValue);
    }
}

// Updates mouse position with a listenner
function updateMousePos(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

document.addEventListener("mousemove", updateMousePos);
let ballY = canvas.height - 20;

function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function moveBall() {
    //move ball along x axis
    if (ballX < canvas.width - 20 & !movingBackward) {
        ballX += 0.001;
    } else {
        movingBackward = true;
    }
    
    if (ballX > 20 & movingBackward) {
        ballX -= 0.001;
    } else {
        movingBackward = false;
    }
    //move ball along y axis if score is over 40
    if (scoreValue > 40) {
        if (ballY > (canvas.height / 2) -30 && !movingDown) {
            ballY -= 0.003;
        } else {
            movingDown = true;
        }
        if (ballY < canvas.height && movingDown) {
            ballY += 0.005;
        } else {
            movingDown = false;
        }
    }
}

// pushes all rain particles into an array with random vales
function randomRain() {
    for (let i = 0; i <= rainAmmount; i ++){
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        rainArray.push(new Particle(x, y));
    }
}

randomRain();

// stops the game when score reaches 100
function gameEnd() {
    if (scoreValue >= 100) {
    ctx.fillStyle = "black";
    ctx.font = "100px Arial, sans-serif";
    const winMessage = "YOU WIN";
    const textWidth = ctx.measureText(winMessage).width;
    const xCoordinate = (canvas.width - textWidth) / 2;
    ctx.fillText(winMessage, xCoordinate, 500);

    gameRunning = false;
    }
}

function topHat() {
    // Center box on mouse
    boxX = mouseX - boxWidth / 2;
    boxY = mouseY - boxHeight / 2;
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.drawImage(boxImage, mouseX - boxWidth / 2, mouseY - boxHeight / 2, boxWidth, boxHeight);

}


function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("Score: " + scoreValue, 20, 30);
}

function animate() {
    if (!gameRunning) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    topHat();

    for (let i = 0; i < rainArray.length; i++) {
        rainArray[i].update();
        rainArray[i].drawRain();
    }

    drawBall();
    drawScore();
    gameEnd();
    

    requestAnimationFrame(animate);
}
animate();
