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
const scoreLimit = 3; // Set a score limit for winning the game (adjust as needed)
const initialBallSpeedX = 1; // Adjust the initial X-axis speed as needed
const initialBallSpeedY = 1; // Adjust the initial Y-axis speed as needed
const ctx = canvas.getContext("2d"); // Get the 2D rendering context
const backgroundMusic = document.getElementById("backgroundMusic");
const paddleWidth = 10;
const paddleHeight = 100;
const playButton = document.getElementById("playButton");
const ballImage = document.getElementById("ballImage");
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: initialBallSpeedX,
    speedY: initialBallSpeedY,
};
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 1,
    color: "pink"
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
    document.getElementById("ng11"),
    document.getElementById("ng12"),
    document.getElementById("ng13"),
    document.getElementById("ng14"),
    // Add more audio elements for additional songs as needed
];
const computer = {
    x: canvas.width - paddleWidth,
    y: (canvas.height / 2 - paddleHeight / 2),
    width: paddleWidth,
    height: paddleHeight,
    speed: 3,
    color: "red",
    name: "Devs",
    src: "/Bosses/DorkMind2.png"
};
// Define the levels
const levels = [
    { name: "Whispy Woods", color: "green", src: "/Development/kir-bong/Bosses/WhispyWoods.png", ballSpeedX: 0.5, ballSpeedY: 0.5, computerSpeed: 0.5 },
    { name: "Waddle Dee", color: "blue", src: "/Development/kir-bong/Bosses/WaddleDee.png", ballSpeedX: 0.75, ballSpeedY: 0.75, computerSpeed: 0.75 },
    { name: "Waddle Doo", color: "orange", src: "/Development/kir-bong/Bosses/WaddleDoo.png", ballSpeedX: 1, ballSpeedY: 1, computerSpeed: 1 },
    { name: "King Dedede", color: "blue", src: "/Development/kir-bong/Bosses/KingDedede.png", ballSpeedX: 1.25, ballSpeedY: 1.25, computerSpeed: 1.25 },
    { name: "Marx", color: "purple", src: "/Development/kir-bong/Bosses/Marx.png", ballSpeedX: 1.5, ballSpeedY: 1.5, computerSpeed: 1.5 },
    { name: "Miracle Matter", color: "grey", src: "/Development/kir-bong/Bosses/MiracleMatter.png", ballSpeedX: 1.75, ballSpeedY: 1.75, computerSpeed: 1.75 },
    { name: "Dark Matter", color: "black", src: "/Development/kir-bong/Bosses/DarkMatter.png", ballSpeedX: 2, ballSpeedY: 2, computerSpeed: 2 },
    { name: "0 2", color: "white", src: "/Development/kir-bong/Bosses/02.png", ballSpeedX: 2.25, ballSpeedY: 2.25, computerSpeed: 2.25 },
    { name: "Dark Mind", color: "purple", src: "/Development/kir-bong/Bosses/DorkMind.png", ballSpeedX: 2.5, ballSpeedY: 2.5, computerSpeed: 2.5 },
    { name: "Marx", color: "red", src: "/Development/kir-bong/Bosses/Marx2.png", ballSpeedX: 2.75, ballSpeedY: 2.75, computerSpeed: 2.75 },
    { name: "Whispy Woods", src: "/Development/kir-bong/Bosses/WhispyWoods2.png", color: "black", ballSpeedX: 3, ballSpeedY: 3, computerSpeed: 3 },
];
let currentSongIndex = 0;
let currentLevel = 0;
// Add an event listener to the "Start Game" button
document.getElementById("startButton").addEventListener("click", () => {
    // Show the menu when the button is clicked
    document.getElementById("menu").style.display = "block";
});
// Add event listeners to handle player input
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleRestart);
});
function initializeLevel(level) {
    // Set game parameters based on the current level
    ball.speedX = levels[level].ballSpeedX;
    ball.speedY = levels[level].ballSpeedY;
    computer.speed = levels[level].computerSpeed;
    computer.color = levels[level].color;
    computer.name = levels[level].name;
    // computer.height = levels[level].paddleSize;
    // Update the computer's image source based on the level
    computer.src = levels[level].src;
    // Get a reference to the computerName image element by its ID
    const computerNameImage = document.getElementById("computerName");
    // Change the src attribute to the new image source
    computerNameImage.src = computer.src;
}
// Function to update the player's name display
function updatePlayerNameDisplay() {
    const playerName = document.getElementById("playerName");
    playerName.src = "/MC/Kirbo3.png";
}
// Start playing the background music
function playBackgroundMusic() {
    songs[currentSongIndex].play().catch(error => {
        console.error("Error playing music:", error);
    });
}
function handleAudioEnded() {
    // Increment the current song index or loop back to the first song
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    // Play the new current song
    playBackgroundMusic();
}
function switchToNextSong() {
    // Pause the current song
    songs[currentSongIndex].pause();
    songs[currentSongIndex].currentTime = 0; // Reset playback to the beginning
    // Call the handleAudioEnded function to switch to the next song
    handleAudioEnded();
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
function restartGame() {
    playerScore = 0;
    computerScore = 0;
    resetBall(); // Reset ball position
    gameOver = false;
    gameIsRunning = true;
    playBackgroundMusic();
}
function handleRKey(event) {
    if (event.key === "r" || event.key === "R") {
        rPressed = true;
        restartGame();
    }
};
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
    // Draw the ball image
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    // Draw the player's score
    ctx.fillStyle = "#000000"; // Set the fill color (white)
    ctx.font = "24px Arial"; // Set the font size and style
    ctx.fillText("Kirby: " + playerScore, 20, 30);
    // Draw the computer's score
    ctx.fillStyle = "#000000"; // Set the fill color (white)
    ctx.font = "24px Arial"; // Set the font size and style
    ctx.fillText(levels[currentLevel].name+ ": " + computerScore, canvas.width - 180, 30);
}
function updateGameLogic() {
     // Check if the player reached the score limit for the current level
     if (playerScore >= scoreLimit) {
        // Increment the level
        currentLevel++;
        if (currentLevel < levels.length) {
            // Initialize the next level
            playerScore = 0;
            initializeLevel(currentLevel);
        } else {
            // Player has completed all levels, handle game completion
            handleGameCompletion("Kirby");
        }
    } else if (computerScore >= scoreLimit) {
        handleGameOver(levels[currentLevel].name);
    }
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
    }
}
// Function to display the winner
function displayWinner(winner) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 50);
    ctx.fillText(winner + " has defeated Kirby!", canvas.width / 2 - 80, canvas.height / 2);
}
function handleGameCompletion(winner) {
    // Game completion logic (e.g., display a victory message)
    gameOver = true; // Set the game over flag
    displayWinner(winner); // Display "Game Over" message
    gameIsRunning = false; // Stop the game
    canvas.style.display = "none"; // Hide the canvas
    menu.style.display = "block"; // Show the menu
}
function handleGameOver(winner) {
    gameOver = true; // Set the game over flag
    displayWinner(winner); // Display "Game Over" message
    gameIsRunning = false; // Stop the game
    canvas.style.display = "none"; // Hide the canvas
    menu.style.display = "block"; // Show the menu
}
function handleRestart(event) {
    if (event.key === "r" || event.key === "R") {
        rPressed = true;
        restartGame();
    }
}
startButton.addEventListener("click", () => {
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
songs.forEach((song, index) => {
    song.addEventListener("ended", handleAudioEnded);
    // Set a custom attribute to store the index of each song
    song.setAttribute("data-song-index", index);
});
// Start the game loop when the game begins
gameLoop(0); // Pass 0 as the initial timestamp