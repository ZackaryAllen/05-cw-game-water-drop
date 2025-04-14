// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops
let score = 0;           // Initialize score
let timer = 60;          // Initialize timer
let timerInterval;       // Declare timerInterval globally to manage it in resetGame

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);

// Event listener for the reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Game initialization function
function startGame() {
    // Prevent multiple game instances
    if (gameActive) return;
    
    // Set up initial game state
    gameActive = true;
    timer = 60; // Reset timer
    score = 0;  // Reset score
    updateScore();
    updateTimer();
    document.getElementById('start-btn').disabled = true;
    
    // Start creating drops every 1000ms (1 second)
    gameInterval = setInterval(createDrop, 1000);

    // Start the timer countdown
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Function to update the score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Function to update the timer display
function updateTimer() {
    document.getElementById('timer').textContent = timer;
}

// Function to end the game
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    document.getElementById('start-btn').disabled = false;
    alert(`Game Over! Your final score is: ${score}`);
}

// Function to reset the game
function resetGame() {
    // Stop the game if it's running
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval); // Stop the timer

    // Reset score and timer
    score = 0;
    timer = 60;
    updateScore();
    updateTimer();

    // Clear all drops from the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.querySelectorAll('.water-drop, .bad-drop').forEach(drop => drop.remove());

    // Ensure the start button is enabled and the game does not start automatically
    document.getElementById('start-btn').disabled = false;
}

// Function to create and manage individual water drops
function createDrop() {
    const drop = document.createElement('div');
    
    // Randomly determine if this drop is good or bad (20% chance of bad)
    const isBadDrop = Math.random() < 0.2;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';
    
    // Remove emoji and style as a circle
    drop.style.backgroundColor = isBadDrop ? 'red' : '#0099ff'; // Red for bad drops, blue for good drops
    drop.style.borderRadius = '50%'; // Make it circular
    drop.style.width = '40px'; // Set width
    drop.style.height = '40px'; // Set height

    // Create random size variation for visual interest
    const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
    drop.style.transform = `scale(${scale})`;
    
    // Position drop randomly along the width of the game container
    const gameWidth = document.getElementById('game-container').offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;
    
    // Set drop animation speed
    drop.style.animationDuration = '4s';
    
    // Simple click handler to remove drops
    drop.addEventListener('click', () => {
        drop.remove();
    });
    
    // Check for collision with the water can during animation
    const collisionInterval = setInterval(() => {
        if (isCollision(drop, waterCan)) {
            drop.classList.add('caught'); // Mark drop as caught
            drop.remove();
            clearInterval(collisionInterval);
            // Update score or handle bad drop logic
            if (drop.classList.contains('bad-drop')) {
                score -= 5; // Decrease score for bad drop
                console.log('Caught a bad drop! Score:', score);
            } else {
                score += 5; // Increase score for good drop
                console.log('Caught a good drop! Score:', score);
            }
            updateScore(); // Update the score display
        }
    }, 50);

    // Remove drop if it reaches bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove();
        clearInterval(collisionInterval);
        if (!drop.classList.contains('caught') && !drop.classList.contains('bad-drop')) {
            // Only decrease score if a good drop is missed
            score -= 2;
            console.log('Missed a good drop! Score:', score);
            updateScore(); // Update the score display
        }
    });

    // Add drop to game container
    document.getElementById('game-container').appendChild(drop);
}

// Add event listener to move the water can with the mouse
const waterCan = document.getElementById('water-can');
document.addEventListener('mousemove', (event) => {
    const gameContainer = document.getElementById('game-container');
    const containerRect = gameContainer.getBoundingClientRect();
    
    // Restrict movement within the game container
    let newX = event.clientX - containerRect.left - waterCan.offsetWidth / 2;
    newX = Math.max(0, Math.min(newX, containerRect.width - waterCan.offsetWidth));
    waterCan.style.left = `${newX}px`;
});

// Function to check collision between the water can and a drop
function isCollision(drop, waterCan) {
    const dropRect = drop.getBoundingClientRect();
    const canRect = waterCan.getBoundingClientRect();
    
    return !(
        dropRect.top > canRect.bottom ||
        dropRect.bottom < canRect.top ||
        dropRect.left > canRect.right ||
        dropRect.right < canRect.left
    );
}
