const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const continueBtn = document.getElementById('continue-btn');
const moodButtons = document.querySelectorAll('.mood-btn');

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameLoop;
let isPaused = false;
let currentMood = 'classic';

const moods = {
    classic: {
        snakeColor: '#2ecc71',
        foodColor: '#e74c3c',
        bgColor: '#34495e'
    },
    neon: {
        snakeColor: '#9b59b6',
        foodColor: '#2ecc71',
        bgColor: '#2c3e50'
    },
    dark: {
        snakeColor: '#34495e',
        foodColor: '#e67e22',
        bgColor: '#2c3e50'
    }
};

function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    createFood();
    isPaused = false;
    continueBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };
    
    // Prevent food from spawning on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            createFood();
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = moods[currentMood].bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = moods[currentMood].snakeColor;
    snake.forEach((segment, index) => {
        ctx.shadowColor = moods[currentMood].snakeColor;
        ctx.shadowBlur = index === 0 ? 15 : 5;
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = moods[currentMood].foodColor;
    ctx.shadowColor = moods[currentMood].foodColor;
    ctx.shadowBlur = 15;
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.shadowBlur = 0;
}

function move() {
    if (isPaused) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collisions
    if (head.x < 0 || head.x >= TILE_COUNT || 
        head.y < 0 || head.y >= TILE_COUNT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        createFood();
    } else {
        snake.pop();
    }

    draw();
}

function gameOver() {
    clearInterval(gameLoop);
    startBtn.textContent = 'Restart Game';
    continueBtn.disabled = false;
    alert(`Game Over! Final Score: ${score}`);
}

function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    initGame();
    gameLoop = setInterval(move, 100);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
continueBtn.addEventListener('click', startGame);

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMood = button.classList[1];
        draw();
    });
});

document.addEventListener('keydown', (e) => {
    if (isPaused) return;
    
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});
