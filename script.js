// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops
let score = 0;           // Initialize score
let timer = 60;          // Initialize timer
let timerInterval;       // Declare timerInterval globally to manage it in resetGame
let easyMode = false;    // Tracks if Easy Mode is active

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);

// Event listener for the reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Event listener for Easy Mode toggle
document.getElementById('easy-mode-btn').addEventListener('click', () => {
    easyMode = !easyMode;
    document.getElementById('easy-mode-btn').textContent = easyMode ? 'Easy Mode: ON' : 'Easy Mode: OFF';
});

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

    // Remove all remaining drops from the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.querySelectorAll('.water-drop, .bad-drop').forEach(drop => drop.remove());

    // Check win or lose conditions
    if (score >= 50) {
        alert(`Congratulations! You win! Your final score is: ${score}`);
    } else {
        alert(`Game Over! You lose. Your final score is: ${score}`);
    }

    document.getElementById('start-btn').disabled = false;
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
    
    // Randomly determine if this drop is good or bad (30% chance of bad)
    const isBadDrop = Math.random() < 0.3;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';
    
    // Style good drops with the 💧 emoji
    if (!isBadDrop) {
        drop.textContent = '💧';
        drop.style.fontSize = '24px'; // Adjust emoji size
        drop.style.textAlign = 'center';
        drop.style.lineHeight = '40px'; // Center the emoji vertically
        drop.style.backgroundColor = 'transparent'; // Remove background for emoji
    } else {
        // Style bad drops with the 🩸 emoji
        drop.textContent = '🩸';
        drop.style.fontSize = '24px'; // Adjust emoji size
        drop.style.textAlign = 'center';
        drop.style.lineHeight = '40px'; // Center the emoji vertically
        drop.style.backgroundColor = 'transparent'; // Remove background for emoji
    }

    // Create random size variation for visual interest
    const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
    drop.style.transform = `scale(${scale})`;
    
    // Position drop randomly along the width of the game container
    const gameWidth = document.getElementById('game-container').offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;
    
    // Set drop animation speed
    drop.style.animationDuration = '4s';
    
    // Click handler to remove drops, show water can, and update score
    drop.addEventListener('click', () => {
        const waterCan = document.getElementById('water-can');
        
        // Position the water can at the drop's location
        const dropRect = drop.getBoundingClientRect();
        const containerRect = document.getElementById('game-container').getBoundingClientRect();
        waterCan.style.left = `${dropRect.left - containerRect.left}px`;
        waterCan.style.top = `${dropRect.top - containerRect.top}px`;
        waterCan.style.display = 'block'; // Show the water can

        // Hide the water can after a shorter delay
        setTimeout(() => {
            waterCan.style.display = 'none';
        }, 150); // Reduced from 300ms

        drop.remove();
        if (drop.classList.contains('bad-drop')) {
            score -= 5; // Decrease score for bad drop
            console.log('Clicked a bad drop! Score:', score);
        } else {
            score += 5; // Increase score for good drop
            console.log('Clicked a good drop! Score:', score);
        }
        updateScore(); // Update the score display
    });

    // Remove drop if it reaches bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove();
        if (!drop.classList.contains('bad-drop') && !easyMode) {
            // Only decrease score if a good drop is missed and Easy Mode is OFF
            score -= 2;
            console.log('Missed a good drop! Score:', score);
            updateScore(); // Update the score display
        }
    });

    // Add drop to game container
    document.getElementById('game-container').appendChild(drop);
}
