let lastTime = 0; // Used to calculate time elapsed between frames
let deltaTime = 0; // Time elapsed since the last frame
let gameIsRunning = true; // A flag to control the game state
let playerScore = 0;
let computerScore = 0;
let winner = "";
// Define variables to track player input
let upPressed = false;
let downPressed = false;

const scoreLimit = 10; // Set a score limit for winning the game (adjust as needed)
const initialBallSpeedX = 1; // Adjust the initial X-axis speed as needed
const initialBallSpeedY = 1; // Adjust the initial Y-axis speed as needed
const canvas = document.getElementById("gameCanvas"); // Get a reference to the canvas element
const ctx = canvas.getContext("2d"); // Get the 2D rendering context
const backgroundMusic = document.getElementById("backgroundMusic");
const paddleWidth = 10;
const paddleHeight = 100;
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: initialBallSpeedX,
    speedY: initialBallSpeedY,
    ballColor: "pink",
};

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 1,
    color: "pink"
};

const computer = {
    x: canvas.width - paddleWidth,
    y: (canvas.height / 2 - paddleHeight / 2) / 3,
    width: paddleWidth,
    height: paddleHeight * 3,
    speed: 3,
    color: "red"
};

// Set the volume to a value between 0 (muted) and 1 (full volume)
backgroundMusic.volume = 0.5; // Adjust the value as needed

// Function to update the player's name display
function updatePlayerNameDisplay() {
    const playerName = document.getElementById("playerName");
    playerName.src = "Kirbo3.png"; // Update the image source
}

// Function to update the computer's name display
function updateComputerNameDisplay() {
    const computerName = document.getElementById("computerName");
    computerName.src = "DorkMind3.png"; // Update the image source
}

// Start playing the background music
function playBackgroundMusic() {
    backgroundMusic.play();
}

playBackgroundMusic();

// Stop the background music
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset playback to the beginning
}

function initializeGame() {
    // Your game initialization code here
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.radius = 10;
    ball.speedX = initialBallSpeedX;
    ball.speedY = initialBallSpeedY;
    ball.ballColor = "pink";
}

// Function to handle keydown events
function handleKeyDown(event) {
    if (event.key === "ArrowUp") {
        upPressed = true;
    } else if (event.key === "ArrowDown") {
        downPressed = true;
    }
}

// Function to handle keyup events
function handleKeyUp(event) {
    if (event.key === "ArrowUp") {
        upPressed = false;
    } else if (event.key === "ArrowDown") {
        downPressed = false;
    }
}

// Function to reset the ball's position after a point is scored
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = initialBallSpeedX; // Set initial speed
    ball.speedY = initialBallSpeedY; // Set initial speed
}

function restartGame() {
    playerScore = 0;
    computerScore = 0;
    resetBall(); // Reset ball position
    gameIsRunning = true; // Restart the game
}

function drawGameElements() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player's paddle
    ctx.fillStyle = player.color; // Set the fill color (green)
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw the computer's paddle
    ctx.fillStyle = computer.color; // Set the fill color (red)
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Draw the ball as a filled circle
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.ballColor; // Set the ball color
    ctx.fill();
    ctx.closePath();

    // Draw the player's score
    ctx.fillStyle = "#000000"; // Set the fill color (white)
    ctx.font = "24px Arial"; // Set the font size and style
    ctx.fillText("Kirby: " + playerScore, 20, 30);

    // Draw the computer's score
    ctx.fillText("Dark Mind: " + computerScore, canvas.width - 180, 30);
}


function updateGameLogic() {
    // Update paddles based on player input
    if (upPressed) {
        // Move the paddle up
        player.y -= player.speed * deltaTime;
    } else if (downPressed) {
        // Move the paddle down
        player.y += player.speed * deltaTime;
    }

    // Ensure the paddle stays within the canvas boundaries
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Update the computer's paddle position to track the ball
    const computerTargetY = ball.y - computer.height / 2;
    if (computerTargetY < computer.y) {
        computer.y -= computer.speed * deltaTime;
    } else if (computerTargetY > computer.y) {
        computer.y += computer.speed * deltaTime;
    }

    // Ensure the computer's paddle stays within the canvas boundaries
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }

    // Update ball position
    ball.x += ball.speedX * deltaTime;
    ball.y += ball.speedY * deltaTime;

    // Check for collisions with paddles
    if (
        ball.x < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.radius > player.y
    ) {
        // Ball hit the player's paddle, reverse its horizontal direction
        ball.speedX = -ball.speedX;
    } else if (
        ball.x + ball.radius > computer.x &&
        ball.x < computer.x + computer.width &&
        ball.y < computer.y + computer.height &&
        ball.y + ball.radius > computer.y
    ) {
        // Ball hit the computer's paddle, reverse its horizontal direction
        ball.speedX = -ball.speedX;
    }

    // Check for collisions with top and bottom walls, reverse vertical direction
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Check for scoring conditions
    if (ball.x + ball.radius < 0) {
        // Computer scores a point
        computerScore++;
        // Reset the ball's position
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) {
        // Player scores a point
        playerScore++;
        // Reset the ball's position
        resetBall();
    }

    // Check for game over conditions
    if (playerScore >= scoreLimit || computerScore >= scoreLimit) {
        gameIsRunning = false;
    }

    // Other game logic...
}

function gameLoop(timestamp) {
    playBackgroundMusic();

    // Calculate deltaTime (time elapsed since the last frame)
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear the canvas to prepare for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game logic (e.g., move paddles, update ball position)
    updateGameLogic();

    // Draw game elements (paddles, ball, etc.)
    drawGameElements()

    // Check for game over conditions and handle them
    if (gameIsRunning) {
        requestAnimationFrame(gameLoop); // Request the next frame
    } else {
        // Game over logic (e.g., display a message, allow restart)
        // Check for a winner
        if (playerScore >= scoreLimit) {
            // Player wins
            gameIsRunning = false; // End the game
            handleGameOver("Kirby"); // Display winner message
        } else if (computerScore >= scoreLimit) {
            // Computer wins
            gameIsRunning = false; // End the game
            handleGameOver("Dark Mind"); // Display winner message
        }
    }
}

// Function to set up the game when the ball image is loaded
function setupGameAfterImageLoad() {
    initializeGame(); // Call the initialization function
    requestAnimationFrame(gameLoop); // Start the game loop
}

// Function to display the winner
function displayWinner(winner) {
    ctx.fillStyle = "#000000";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 50);
    ctx.fillText(winner + " wins!", canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Press 'R' to restart", canvas.width / 2 - 80, canvas.height / 2 + 50);
}

function handleGameOver(winner) {
    stopBackgroundMusic();
    gameIsRunning = false; // End the game
    displayWinner(winner); // Display "Game Over" message
}

// Add event listeners to handle player input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
// Add an event listener to restart the game when 'R' is pressed
document.addEventListener("keydown", function (event) {
    if (event.key === "r" || event.key === "R") {
        console.log("R key pressed"); // Add this line
        restartGame();
    }
});
// Add an event listener to restart the game when 'R' is pressed
document.addEventListener("keydown", function (event) {
    if (event.key === "r" || event.key === "R") {
        restartGame();
    }
});

playButton.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(error => {
            console.error("Error playing music:", error);
        });
    }
});

stopButton.addEventListener("click", () => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
});

// Assign the setup function to the image's onload event
ball.onload = setupGameAfterImageLoad;

// Start the game loop when the game begins
gameLoop(0); // Pass 0 as the initial timestamp
