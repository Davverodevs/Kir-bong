// Get references to the menu and canvas elements
const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas"); // Get a reference to the canvas element
// Add event listeners for the menu buttons
const startButton = document.getElementById("startButton");
// Add an event listener for the "2 Player" button
const twoPlayerButton = document.getElementById("twoPlayerButton");
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
// Player 1 paddle
const player1 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 1,
    color: "pink"
};
// Player 2 paddle
const player2 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 1,
    color: "sky blue"
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
    document.getElementById("ng14")
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
let computerMoveCooldown = 0;
let currentSongIndex = 0;
let currentLevel = 0;
let lastTime = 0; // Used to calculate time elapsed between frames
let deltaTime = 0; // Time elapsed since the last frame
let isGameRunning = true; // A flag to control the game state
let playerScore = 0;
let computerScore = 0;
let winner = "";
// Define variables to track player input
let upPressed = false;
let downPressed = false;
let isGameOver = false;
let gameIsPaused = false; // Track whether the game is currently paused
// Add an event listener to the "Start Game" button
document.getElementById("startButton").addEventListener("click", () => {
    // Show the menu when the button is clicked
    document.getElementById("menu").style.display = "block";
});
// Add event listeners to handle player input
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
});
function stopGameProcesses() {
    // Pause any ongoing animations or timers
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    // Stop any other ongoing processes or animations in your game
    // For example, if you have any setTimeout or setInterval timers, clear them here
    clearInterval(timerId);
    // You can add more logic to stop other game-related processes as needed
}
function updateComputerMovement() {
    // Check if the cooldown timer has elapsed
    if (computerMoveCooldown <= 0) {
        // Generate a random number between -1 and 1
        const randomMovement = (Math.random() - 0.5) * 2;

        // Apply the random movement to the computer's paddle
        computer.dy = randomMovement * computer.speed;

        // Set a new cooldown timer (adjust the duration as needed)
        computerMoveCooldown = 100; // 1000 milliseconds (1 second)
    } else {
        // Decrement the cooldown timer
        computerMoveCooldown -= deltaTime;
    }

    // Update the computer's paddle position
    computer.y += computer.dy * deltaTime;

    // Ensure the computer's paddle stays within the canvas boundaries
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}
// Function to pause the game
function pauseGame() {
    gameIsPaused = true;
    // Display a pause menu or screen (you can create a div element for this)
    const pauseMenu = document.getElementById("pauseMenu");
    pauseMenu.style.display = "block";
    // Stop any game-related processes (e.g., stop updating game logic)
    stopGameProcesses();
}
function startGameProcesses() {
    // Resume the game loop
    requestAnimationFrame(gameLoop);
    // Restart any other timers or processes that were paused
    // For example, if you have any setTimeout or setInterval timers, start them again
    timerId = setInterval(updateGameLogic, interval); // Replace with your specific timers
    // You can add more logic to resume other game-related processes as needed
}
// Function to resume the game
function resumeGame() {
    gameIsPaused = false;
    // Hide the pause menu or screen
    const pauseMenu = document.getElementById("pauseMenu");
    pauseMenu.style.display = "none";
    // Resume game-related processes (e.g., resume updating game logic)
    startGameProcesses();
}
// Function to handle the pause/resume action when the pause button is clicked
function togglePause() {
    if (gameIsPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}
// Add an event listener to a pause button or keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
        togglePause();
        // alert("that the game is now paused");
    }
});
function randomizeDirection() {
    // Generate a random number between -1 and 1
    const randomX = Math.random() * 2 - 1;
    const randomY = Math.random() * 2 - 1;
  
    // Normalize the vector (X and Y components) to maintain constant speed
    const length = Math.sqrt(randomX * randomX + randomY * randomY);
    const speed = 1; // Adjust this value to control the ball's speed
    const speedX = (randomX / length) * speed;
    const speedY = (randomY / length) * speed;
  
    return { speedX, speedY };
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}
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
    songs[currentSongIndex].pause();initializeGame
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
    initializeLevel(currentLevel)
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.radius = 10;
    ball.speedX = initialBallSpeedX;
    ball.speedY = initialBallSpeedY;
    ball.ballColor = "pink";
    playerScore = 0;
    computerScore = 0;
    isGameOver = false;
    isGameRunning = true;
    playBackgroundMusic();
}
// Function to reset the ball's position after a point is scored
function resetBall() {
    const { speedX, speedY } = randomizeDirection();
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = speedX; // Set initial speed
    ball.speedY = speedY; // Set initial speed
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
// Function to display the winner
function displayWinner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "36px Arial";
    ctx.fillText("Congratulations! You win!", canvas.width / 2 - 80, canvas.height / 2 - 50);
    ctx.fillText("Thanks for playing!", canvas.width / 2 - 80, canvas.height / 2);
}
function handleGameCompletion() {
    // Game completion logic (e.g., display a victory message)
    isGameOver = true; // Set the game over flag
    displayWinner(); // Display "Game Over" message
    isGameRunning = false; // Stop the game
    // canvas.style.display = "none"; // Hide the canvas
    // menu.style.display = "block"; // Show the menu
}
function handleGameOver() {
    canvas.style.display = "none"; // Hide the canvas
    menu.style.display = "block"; // Show the menu
}
function drawGameElements() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the player's paddle with a border
    ctx.fillStyle = player1.color; // Set the fill color
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.strokeStyle = "black"; // Set the border color
    ctx.lineWidth = 2; // Set the border width
    ctx.strokeRect(player1.x, player1.y, player1.width, player1.height); // Draw the border
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
    ctx.fillText(levels[currentLevel].name+ ": " + computerScore, canvas.width - 200, 30);
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
        player1.y -= player1.speed * deltaTime;
    } else if (downPressed) {
        // Move the paddle down
        player1.y += player1.speed * deltaTime;
    }
    // Ensure the paddle stays within the canvas boundaries
    if (player1.y < 0) {
        player1.y = 0;
    } else if (player1.y + player1.height > canvas.height) {
        player1.y = canvas.height - player1.height;
    }
    updateComputerMovement();
    // Update ball position
    ball.x += ball.speedX * deltaTime;
    ball.y += ball.speedY * deltaTime;
    // Check for collisions with paddles
    if (
        ball.x < player1.x + player1.width &&
        ball.x + ball.radius > player1.x &&
        ball.y < player1.y + player1.height &&
        ball.y + ball.radius > player1.y
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
    // Other game logic...
}
function runGameLoop(timestamp) {
    // Calculate deltaTime (time elapsed since the last frame)
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    // Clear the canvas to prepare for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameIsPaused) {
        // Update game logic only if the game is not paused
        // Draw game elements (paddles, ball, etc.)
        drawGameElements()
        // Update game logic (e.g., move paddles, update ball position)
        updateGameLogic();
    }
    // Check for game over conditions and handle them
    if (isGameRunning) {
        requestAnimationFrame(runGameLoop); // Request the next frame
    }
}
startButton.addEventListener("click", () => {
    // Start the game when the "Start Game" button is clicked
    canvas.style.display = "block";
    menu.style.display = "none";
    initializeGame(); // Start the game logic
    isGameRunning = true; // Set the game to running state
});
twoPlayerButton.addEventListener("click", () => {
    // Start a 2-player game when the "2 Player" button is clicked
    // startTwoPlayerGame(); WIP
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
// Shuffle the songs array
shuffleArray(songs);
// Start the game loop when the game begins
runGameLoop(0); // Pass 0 as the initial timestamp