let lastTime = 0; // Used to calculate time elapsed between frames
let deltaTime = 0; // Time elapsed since the last frame
let gameIsRunning = true; // A flag to control the game state
let playerScore = 0;
let computerScore = 0;
let winner = "";
// Define variables to track player input
let upPressed = false;
let downPressed = false;
let gameOver = false;
let rPressed = false;
// Get references to the menu and canvas elements
const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas"); // Get a reference to the canvas element
// Add event listeners for the menu buttons
const startButton = document.getElementById("startButton");
const instructionsButton = document.getElementById("instructionsButton");
const scoreLimit = 10; // Set a score limit for winning the game (adjust as needed)
const initialBallSpeedX = 1; // Adjust the initial X-axis speed as needed
const initialBallSpeedY = 1; // Adjust the initial Y-axis speed as needed
const ctx = canvas.getContext("2d"); // Get the 2D rendering context
const backgroundMusic = document.getElementById("backgroundMusic");
const paddleWidth = 10;
const paddleHeight = 100;
const playButton = document.getElementById("playButton");
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
    y: (canvas.height / 2 - paddleHeight / 2),
    width: paddleWidth,
    height: paddleHeight,
    speed: 3,
    color: "red"
};
const songs = [
    document.getElementById("ng1"),
    document.getElementById("ng2"),
    document.getElementById("ng3"),
    document.getElementById("ng4"),
    document.getElementById("ng5"),
    document.getElementById("ng6"),
    document.getElementById("ng7"),
    document.getElementById("ng8"),
    document.getElementById("ng9"),
    document.getElementById("ng10"),
    // Add more audio elements for additional songs as needed
];
let currentSongIndex = 0;

// Add an event listener to the "Start Game" button
document.getElementById("startButton").addEventListener("click", () => {
    // Show the menu when the button is clicked
    document.getElementById("menu").style.display = "block";
});
// Add event listeners to handle player input
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    // Add an event listener for the "R" keydown event
    document.addEventListener("keydown", handleRestart);
});

startButton.addEventListener("click", () => {
    console.log("Start button clicked"); // Add this line
    // Start the game when the "Start Game" button is clicked
    canvas.style.display = "block";
    menu.style.display = "none";
    initializeGame(); // Start the game logic
});

instructionsButton.addEventListener("click", () => {
    // Display game instructions when the "Instructions" button is clicked
    alert("just have fun :)");
});

playButton.addEventListener("click", () => {
    switchToNextSong();
});

// Initially, hide the game canvas and show the menu
canvas.style.display = "none";
menu.style.display = "block";

// Function to update the player's name display
function updatePlayerNameDisplay() {
    const playerName = document.getElementById("playerName");
    playerName.src = "/MC/Kirbo3.png"; // Update the image source
}

// Function to update the computer's name display
function updateComputerNameDisplay() {
    const computerName = document.getElementById("computerName");
    computerName.src = "/Bosses/DorkMind3.png"; // Update the image source
}

// Start playing the background music
function playBackgroundMusic() {
    songs[currentSongIndex].play().catch(error => {
        console.error("Error playing music:", error);
    });
}

function switchToNextSong() {
    // Pause the current song
    songs[currentSongIndex].pause();
    songs[currentSongIndex].currentTime = 0; // Reset playback to the beginning

    // Increment the current song index or loop back to the first song
    currentSongIndex = (currentSongIndex + 1) % songs.length;

    // Play the new current song
    playBackgroundMusic();
}

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
    playBackgroundMusic();
}

// Function to reset the ball's position after a point is scored
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = initialBallSpeedX; // Set initial speed
    ball.speedY = initialBallSpeedY; // Set initial speed
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

function handleRKey(event) {
    if (event.key === "r" || event.key === "R") {
        restartGame();
    }
};

function restartGame() {
    playerScore = 0;
    computerScore = 0;
    resetBall(); // Reset ball position
    gameOver = false;
    gameIsRunning = true; // Restart the game
    playBackgroundMusic();
}

function drawGameElements() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player's paddle with a border
    ctx.fillStyle = player.color; // Set the fill color
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeStyle = "black"; // Set the border color
    ctx.lineWidth = 2; // Set the border width
    ctx.strokeRect(player.x, player.y, player.width, player.height); // Draw the border

     // Draw the computer's paddle with a border
     ctx.fillStyle = computer.color; // Set the fill color
     ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
     ctx.strokeStyle = "black"; // Set the border color
     ctx.lineWidth = 2; // Set the border width
     ctx.strokeRect(computer.x, computer.y, computer.width, computer.height); // Draw the border

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
    ctx.fillStyle = "#000000"; // Set the fill color (white)
    ctx.font = "24px Arial"; // Set the font size and style
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

    // Restart game when pressing the R key
    if (rPressed) {
        // Restart game
        restartGame();
    } 

    // Other game logic...
}

function gameLoop(timestamp) {
    // Calculate deltaTime (time elapsed since the last frame)
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear the canvas to prepare for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements (paddles, ball, etc.)
    drawGameElements()

    // Update game logic (e.g., move paddles, update ball position)
    updateGameLogic();

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
    // stopBackgroundMusic();
    gameOver = true; // Set the game over flag
    displayWinner(winner); // Display "Game Over" message
    gameIsRunning = false; // Stop the game
    canvas.style.display = "none"; // Hide the canvas
    menu.style.display = "block"; // Show the menu
}

function handleRestart(event) {
    if (event.key === "r" || event.key === "R") {
        restartGame();
        // rPressed = true
        gameOver = false; // Reset the game over flag
        gameIsRunning = true
    }
}

// Start the game loop when the game begins
gameLoop(0); // Pass 0 as the initial timestamp