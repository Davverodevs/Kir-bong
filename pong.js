let difficulty = 1; // Set the difficulty for the game (adjust as needed)
// let selectedLanguage = "english";
let initialBallSpeedX = 1; // Adjust the initial X-axis speed as needed
let initialBallSpeedY = 1; // Adjust the initial Y-axis speed as needed
let computerMoveCooldown = 0;
let currentSongIndex = 0;
let currentLevel = 0;
let lastTime = 0; // Used to calculate time elapsed between frames
let deltaTime = 0; // Time elapsed since the last frame
let isGameRunning = true; // A flag to control the game state
let playerScore = 0;
let computerScore = 0;
// Define variables to track player input
let upPressed = false;
let downPressed = false;
let isGameOver = false;
let gameIsPaused = false; // Track whether the game is currently paused
// Get references to the menu and canvas elements
let menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas"); 
// Add event listeners for the menu buttons
const startButton = document.getElementById("startButton");
// Get a reference to the restart button element
const restartButton = document.getElementById("restartButton");
// Add an event listener for the "2 Player" button
const twoPlayerButton = document.getElementById("twoPlayerButton");
const instructionsButton = document.getElementById("instructionsButton");
const changeLanguageButton = document.getElementById("changeLanguageButton");
const scoreLimit = 3; // Set a score limit for winning the game (adjust as needed)
const ctx = canvas.getContext("2d"); // Get the 2D rendering context
const backgroundMusic = document.getElementById("backgroundMusic");
const paddleWidth = 10;
const paddleHeight = 100;
const PlayNextSongButton = document.getElementById("PlayNextSongButton");
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
    color: "sky blue" //or "dark blue"
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
    y: (canvas.height / 2 - paddleHeight / 2) / 3,
    width: paddleWidth,
    height: paddleHeight * 3,
    speed: 3,
    color: "red",
    name: "Devs",
    src: "/Bosses/DorkMind2.png"
};
// Function to load menu content based on language
function loadMenuContent(language) {
    // Define the path to the language-specific menu HTML file
    let menuPath = `Languages/menu_${language}.html`;

    // Use fetch to load the menu content
    fetch(menuPath)
        .then(response => response.text())
        .then(data => {
            // Replace the current menu content with the loaded content
            const menu = document.getElementById("menu");
            menu.innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading menu content:", error);
        });
}
// Add an event listener to the "Start Game" button
document.getElementById("startButton").addEventListener("click", () => {
    // Show the menu when the button is clicked
    document.getElementById("menu").style.display = "block";
    // Get the selected difficulty level
    const difficultySelect = document.getElementById("difficulty");
    const selectedDifficulty = difficultySelect.value;
    // Start the game with the selected difficulty
    if (selectedDifficulty === "easy") {
        difficulty = 0.5;
    } else if (selectedDifficulty === "medium") {
        difficulty = 1;
    } else if (selectedDifficulty === "hard") {
        difficulty = 1.5;
    } 
    // else if (selectedDifficulty === "impossible") {
    //     difficulty = 2;
    // }
    // Get the selected language
    // const languageSelect = document.getElementById("language");
    // const selectedLanguage = languageSelect.value;
    // loadMenuContent(selectedLanguage)
});
changeLanguageButton.addEventListener("click", () => {
    // Get the selected language from the dropdown
    const languageSelect = document.getElementById("language");
    let selectedLanguage = languageSelect.value;

    // Load the menu content for the selected language
    loadMenuContent(selectedLanguage);
});
const translations = {
    en: {
        startButton: "Story Mode",
        twoPlayerButton: "Party Mode (WIP)",
        instructionsButton: "Instructions",
        language: "Language",
        difficulty: "Difficulty"
    },
    fr: {
        startButton: "Mode Histoire",
        twoPlayerButton: "Mode de Fête (WIP)",
        instructionsButton: "Instructions",
        language: "Langue",
        difficulty: "Difficulté"
    },
    es: {
        startButton: "Modo Historia",
        twoPlayerButton: "Modo Fiesta (WIP)",
        instructionsButton: "Instrucciones",
        language: "Idioma",
        difficulty: "Dificultad"
    },
    de: {
        startButton: "Geschichtsmodus",
        twoPlayerButton: "Party Modus (WIP)",
        instructionsButton: "Anweisungen",
        language: "Sprache",
        difficulty: "Schwierigkeit"
    },
    it: {
        startButton: "Modalità storia",
        twoPlayerButton: "Modalità festa (WIP)",
        instructionsButton: "Istruzioni",
        language: "Lingua",
        difficulty: "Difficoltà"
    }
};
// Define the levels
const levels = [
    { name: "Whispy Woods", color: "green", src: "/Development/kir-bong/Bosses/WhispyWoods.png", number: 0.5},
    { name: "Waddle Dee", color: "blue", src: "/Development/kir-bong/Bosses/WaddleDee.png", number: 0.75},
    { name: "Waddle Doo", color: "orange", src: "/Development/kir-bong/Bosses/WaddleDoo.png", number: 1},
    { name: "King Dedede", color: "blue", src: "/Development/kir-bong/Bosses/KingDedede.png", number: 1.25},
    { name: "Marx", color: "purple", src: "/Development/kir-bong/Bosses/Marx.png", number: 1.5},
    { name: "Miracle Matter", color: "grey", src: "/Development/kir-bong/Bosses/MiracleMatter.png", number: 1.75},
    { name: "Dark Matter", color: "black", src: "/Development/kir-bong/Bosses/DarkMatter.png", number: 2},
    { name: "Zero2", color: "white", src: "/Development/kir-bong/Bosses/02.png", number: 2.25},
    { name: "Dark Mind", color: "purple", src: "/Development/kir-bong/Bosses/DorkMind.png", number: 2.5},
    { name: "Marx", color: "red", src: "/Development/kir-bong/Bosses/Marx2.png", number: 2.75},
    { name: "Whispy Woods", color: "black", src: "/Development/kir-bong/Bosses/WhispyWoods2.png", number: 3},
];
// Add event listeners to handle player input
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
});
function stopGameProcesses() {
    // Pause any ongoing animations or timers
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    // Stop any other ongoing processes or animations in your game
    clearInterval(timerId);
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
    timerId = setInterval(updateGameLogic, interval); // Replace with your specific timers
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
// Function to show the pause message
function showPauseMessage() {
    const pauseMessage = document.getElementById("pauseMessage");
    pauseMessage.style.display = "block";
}
function hidePauseMessage() {
    const pauseMessage = document.getElementById("pauseMessage");
    pauseMessage.style.display = "none";
}
// Add an event listener to a pause button or keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
        if (isGameRunning && !gameIsPaused) {
            showPauseMessage(); 
            togglePause(); // Pause the game
        } else if (isGameRunning && gameIsPaused) {
            hidePauseMessage();
            togglePause();
        }
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
    ball.speedX = levels[level].number * difficulty;
    ball.speedY = levels[level].number * difficulty;
    computer.speed = levels[level].number * difficulty;
    computer.y = (canvas.height / 2 - paddleHeight / 2) / (levels[level].number),
    computer.height = paddleHeight * (levels[level].number) * difficulty,
    computer.color = levels[level].color;
    computer.name = levels[level].name;
    // Update the computer's image source based on the level
    computer.src = levels[level].src;
    // Get a reference to the computerName image element by its ID
    const computerNameImage = document.getElementById("computerName");
    // Change the src attribute to the new image source
    computerNameImage.src = computer.src;
    computerScore = 0;
}
// Function to update the player's name display
function updatePlayerNameDisplay() {
    const playerName = document.getElementById("playerName");
    playerName.src = "/MC/Kirbo.png";
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
    playerScore = 0;
    computerScore = 0;
    initializeLevel(currentLevel)
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.radius = 10;
    ball.speedX = initialBallSpeedX;
    ball.speedY = initialBallSpeedY;
    ball.ballColor = "pink";
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
            handleGameCompletion();
        }
    } else if (computerScore >= scoreLimit) {
        handleGameOver();
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
function hideGameOverMessage() {
    // Get a reference to the game over message element by its ID
    const gameOverMessage = document.getElementById("gameOverMessage"); // Replace "gameOverMessage" with your actual ID
    // Check if the game over message element exists
    if (gameOverMessage) {
        // Hide the game over message by setting its style to "display: none;"
        gameOverMessage.style.display = "none";
    }
}
startButton.addEventListener("click", () => {
    // Start the game when the "Start Game" button is clicked
    canvas.style.display = "block";
    menu.style.display = "none";
    initializeGame(); // Start the game logic
    isGameRunning = true; // Set the game to running state
});
// Add an event listener to the restart button
restartButton.addEventListener("click", () => {
    // Call the initializeGame function to restart the game
    initializeGame();
    // Hide the game over message if it's displayed
    hideGameOverMessage(); // You'll need to define this function
    // Resume the game loop if it was paused
    if (!isGameRunning) {
        isGameRunning = true;
        runGameLoop(0); // Pass 0 as the initial timestamp
    }
});
twoPlayerButton.addEventListener("click", () => {
    // Start a 2-player game when the "2 Player" button is clicked
    // startTwoPlayerGame(); WIP
});
instructionsButton.addEventListener("click", () => {
    // Display game instructions when the "Instructions" button is clicked
    alert("just have fun :)");
});
PlayNextSongButton.addEventListener("click", () => {
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