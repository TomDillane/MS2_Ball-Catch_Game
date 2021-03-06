$(window).on("resize", resizeCanvas());
$(window).on("load", resizeCanvas());

function resizeCanvas() {
    let canvas = $("#canvas");
    let canvas2 = $("#canvas2");
    canvas.css("width", $(window).width());
    canvas.css("height", $(window).height());
    canvas2.css("width", $(window).width());
    canvas2.css("height", $(window).height());
}

document.getElementById("game-area").classList.toggle("hidden");

let canvas = document.getElementById("canvas");
let canvas2 = document.getElementById("canvas2");
let ctx = canvas.getContext("2d");
let ctx2 = canvas2.getContext("2d");
let r = 5;
let fireBalls = [];
let fireBallSpeed = 0.5;
let fireBallRate = 2000;
let lastFireBall = -1;
let colors = ["red", "green", "orange", "Blue", "Purple", "Pink"];
let warriorx = (canvas.width - 64) / 2;
let warriory = (canvas.height - 50);
let rightPressed = false;
let leftPressed = false;
let lives = 3;
let score = 0;

function listenForEvents() {
    document.getElementById("start-game").addEventListener("click", startGame);
    document.getElementById("start-game").addEventListener("click", draw);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.getElementById("move-right").addEventListener("click", moveright);
    document.getElementById("move-left").addEventListener("click", moveleft);
    document.getElementById("reset").addEventListener("click", tryAgain);
}

function startGame() {
    document.getElementById("game-area").classList.toggle("hidden");
    document.getElementById("home-header").classList.toggle("hidden");
    document.getElementById("home-footer").classList.toggle("hidden");
    document.getElementById("game-intro").classList.toggle("hidden");
}

function createFireBalls() {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let fireBall = {
        c: color,
        x: Math.random() * (canvas.width - 10) + 5,
        y: 5,
        status: 1,
    };
    fireBalls.push(fireBall);
}

function dropFireBalls() {
    for (let i = 0; i < fireBalls.length; i++) {
        let fireBall = fireBalls[i];
        if (fireBalls[i].status == 1) {
            fireBall.y += fireBallSpeed;
            ctx.beginPath();
            ctx.arc(fireBall.x, fireBall.y, r, 0, Math.PI * 2);
            ctx.fillStyle = fireBall.c;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function speedUpBalls() {
    if (score > 10) {
        fireBallSpeed = 1;
    }
    if (score > 20) {
        fireBallSpeed = 1.5;
    }
    if (score > 30) {
        fireBallSpeed = 2;
    }
    if (score > 40) {
        fireBallSpeed = 2.5;
    }
    if (score > 50) {
        fireBallSpeed = 3;
    }
    if (score > 60) {
        fireBallSpeed = 3.5;
    }
    if (score > 70) {
        fireBallSpeed = 4;
    }
    if (score > 80) {
        fireBallSpeed = 4.5;
    }
    if (score > 90) {
        fireBallSpeed = 5;
    }
    if (score > 100) {
        fireBallSpeed = 5.5;
    }
}

function isFireBallAlive(fireBall, fireBallSpeed, canvas) {
    return (fireBall.y + fireBallSpeed > canvas.height - 40);
}

function didNinjaStrike(fireBall, warriorx, fireBall, warriorx) {
    return (fireBall.x > warriorx && fireBall.x < warriorx + 60);
}

function updateScore() {
    fireBalls.splice(0, 1);
    score++;
    document.getElementById("score-count").innerHTML = score;
}

function updateLives() {
    fireBalls.splice(0, 1);
    lives -= 1;
    document.getElementById("live-count").innerHTML = lives;
    return lives;
}

function gameOver() {
    document.getElementById("game-area").classList.toggle("hidden");
    document.getElementById("home-header").classList.toggle("hidden");
    document.getElementById("home-footer").classList.toggle("hidden");
    document.getElementById("game-intro").classList.toggle("hidden");
    document.getElementById("reset").classList.toggle("hidden");
    document.getElementById("start-game").classList.toggle("hidden");
    document.getElementById("intro").classList.toggle("hidden");
    document.getElementById("controls").classList.toggle("hidden");
    document.getElementById("game-over").innerHTML = "GAME OVER!!!!!";
    document.getElementById("end-score").innerHTML = "You prevented " + score + " hits to the city. Well done!! Take a break and get back out there when ready! ";
}

function tryAgain() {
    location.reload();
}

function strike() {
    for (let s = 0; s < fireBalls.length; s++) {
        let fireBall = fireBalls[s];
        
        if (fireBall.status != 1) {
            return false;
        }

        if (!isFireBallAlive(fireBall, fireBallSpeed, canvas)) {
            return false;
        }

        if (didNinjaStrike(fireBall, warriorx, fireBall, warriorx)) {
            updateScore();
        }

        else {
            if (!updateLives()) {
                gameOver();
            }
        }
    }
}

function drawWarrior() {
    img = new Image();
    img.onload = function () {
        ctx.imageSmoothingEnabled = false;
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.drawImage(img, warriorx, warriory, 70, 60);
    };
    img.src = "assets/images/defender_v2.png";
}

function moveright() {
    warriorx += 40;
    if (warriorx + 64 > canvas.width) {
        warriorx = canvas.width - 45;
    }
}

function moveleft() {
    warriorx -= 40;
    if (warriorx < 0) {
        warriorx = -20;
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function draw() {
    let timeStamp = Date.now();
    if (timeStamp > (lastFireBall + fireBallRate)) {
        lastFireBall = timeStamp;
        createFireBalls();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dropFireBalls();
    drawWarrior();
    strike();
    speedUpBalls();

    if (rightPressed) {
        warriorx += 7;
        if (warriorx + 64 > canvas.width) {
            warriorx = canvas.width - 45;
        }
    }
    else if (leftPressed) {
        warriorx -= 7;
        if (warriorx < 0) {
            warriorx = -20;
        }
    }
    requestAnimationFrame(draw);
}
listenForEvents();
