const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let bird = { x: 50, y: 300, radius: 20, velocity: 0, gravity: 0.5, jumpStrength: -8 };
let pipes = [];
let pipeWidth = 70;
let pipeGap = 150;
let pipeVelocity = 3;
let score = 0;
let gameOver = false;
let birdImage = new Image();
let gameStarted = false;
let imageUploaded = false;

document.getElementById("uploadImage").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            birdImage.src = e.target.result;
            imageUploaded = true;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("startGame").addEventListener("click", function() {
    if (!gameStarted) {
        gameStarted = true;
        canvas.style.display = "block";
        this.style.display = "none";
        document.getElementById("uploadImage").style.display = "none";
        requestAnimationFrame(gameLoop);
    }
});

function jump() {
    if (!gameOver) bird.velocity = bird.jumpStrength;
}

function updateGame() {
    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            let pipeHeight = Math.floor(Math.random() * 200) + 100;
            pipes.push({ x: canvas.width, height: pipeHeight });
        }

        pipes.forEach((pipe, index) => {
            pipe.x -= pipeVelocity;

            if (pipe.x + pipeWidth < 0) {
                pipes.splice(index, 1);
                score++;
            }

            if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
                if (bird.y - bird.radius < pipe.height || bird.y + bird.radius > pipe.height + pipeGap) {
                    gameOver = true;
                }
            }
        });

        if (bird.y + bird.radius > canvas.height) gameOver = true;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (imageUploaded && birdImage.complete) {
        ctx.drawImage(birdImage, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
    } else {
        ctx.fillStyle = "red";
        ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height - pipe.height - pipeGap);
    });

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    if (gameOver) {
        ctx.fillText("Game Over! Tap to Restart", 80, 300);
    }
}

function gameLoop() {
    updateGame();
    drawGame();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => { if (e.code === "Space") jump(); });
window.addEventListener("click", () => { if (gameOver) location.reload(); else jump(); });
window.addEventListener("touchstart", () => { if (gameOver) location.reload(); else jump(); });
