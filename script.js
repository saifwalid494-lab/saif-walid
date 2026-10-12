// قائمة الألعاب البرمجية الحقيقية الشغالة مباشرة
const gamesList = [
    { id: 'car-racing', title: 'سباق السيارات الواقعي HD', category: 'arcade', icon: '🏎️' },
    { id: 'snake', title: 'لعبة الثعبان Classic Snake', category: 'arcade', icon: '🐍' },
    { id: 'memory', title: 'تحدي تقوية الذاكرة', category: 'puzzle', icon: '🎴' },
    { id: 'pong', title: 'كرة وتنس الطاولة', category: 'arcade', icon: '🏓' },
    { id: 'xo', title: 'لعبة XO الشهيرة', category: 'puzzle', icon: '❌⭕' },
    { id: 'clicker', title: 'تحدي النقر السريع', category: 'arcade', icon: '⚡' },
    { id: 'guess', title: 'خمن الرقم السري', category: 'puzzle', icon: '🔢' }
];

for (let i = 8; i <= 50; i++) {
    const categories = ['arcade', 'puzzle'];
    const gameTypes = ['car-racing', 'snake', 'memory', 'pong', 'xo', 'clicker', 'guess'];
    const chosenType = gameTypes[i % gameTypes.length];
    
    gamesList.push({
        id: chosenType,
        title: `لعبة ${getGameName(chosenType)} (${i})`,
        category: categories[i % 2],
        icon: getGameIcon(chosenType)
    });
}

function getGameName(type) {
    if (type === 'car-racing') return 'السيارات الواقعية';
    if (type === 'snake') return 'الثعبان';
    if (type === 'memory') return 'الذاكرة';
    if (type === 'pong') return 'كرة الطاولة';
    if (type === 'xo') return 'XO';
    if (type === 'guess') return 'تخمين الرقم';
    return 'النقر السريع';
}

function getGameIcon(type) {
    if (type === 'car-racing') return '🏎️';
    if (type === 'snake') return '🐍';
    if (type === 'memory') return '🎴';
    if (type === 'pong') return '🏓';
    if (type === 'xo') return '❌⭕';
    if (type === 'guess') return '🔢';
    return '⚡';
}

let currentCategory = 'all';
let currentGameInterval = null;
let carGameAnimationId = null;
let activeGame = null; // الاحتفاظ باللعبة الحالية لإعادة التشغيل

function renderGames(data) {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    data.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openGame(game);

        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.title}</div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(cat, event) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    filterGames();
}

function filterGames() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const filtered = gamesList.filter(game => {
        const matchesCat = (currentCategory === 'all' || game.category === currentCategory);
        const matchesSearch = game.title.toLowerCase().includes(searchText);
        return matchesCat && matchesSearch;
    });
    renderGames(filtered);
}

function openGame(game) {
    activeGame = game;
    document.getElementById('modalTitle').innerText = game.title;
    
    // تنظيف النافذة وتحميل شريط التحكم العلوي المضاف له زر Restart
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div style="width:100%; display:flex; justify-content:flex-end; margin-bottom:10px;">
            <button onclick="restartCurrentGame()" style="padding:6px 14px; background:#eab308; color:#0f172a; font-weight:bold; border:none; border-radius:6px; cursor:pointer; font-size:0.85rem; box-shadow:0 2px 8px rgba(234,179,8,0.3);">
                🔄 إعادة التشغيل
            </button>
        </div>
        <div id="activeGameArea" style="width:100%; display:flex; flex-direction:column; align-items:center;"></div>
    `;

    loadGameContent(game);
    document.getElementById('gameModal').style.display = 'flex';
}

// زر إعادة تشغيل اللعبة الحالية
function restartCurrentGame() {
    if (activeGame) {
        loadGameContent(activeGame);
    }
}

// دالة توجيه تشغيل المحتوى للألعاب
function loadGameContent(game) {
    const area = document.getElementById('activeGameArea');
    if (!area) return;

    if (currentGameInterval) clearInterval(currentGameInterval);
    if (carGameAnimationId) cancelAnimationFrame(carGameAnimationId);

    if (game.id === 'car-racing') {
        loadCarGameMainUI(area);
    } else if (game.id === 'snake') {
        loadSnakeGame(area);
    } else if (game.id === 'memory') {
        loadMemoryGame(area);
    } else if (game.id === 'pong') {
        loadPongGame(area);
    } else if (game.id === 'xo') {
        loadXOGame(area);
    } else if (game.id === 'guess') {
        loadGuessGame(area);
    } else {
        loadClickerGame(area);
    }
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    if (currentGameInterval) clearInterval(currentGameInterval);
    if (carGameAnimationId) cancelAnimationFrame(carGameAnimationId);
}

/* ==========================================
   🏎️ لعبة السيارات HD
   ========================================== */

const carSkins = [
    { name: 'السيارة الحمراء', src: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=150&q=80' },
    { name: 'السيارة الصفراء', src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=80' },
    { name: 'السيارة الزرقاء', src: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=150&q=80' }
];

let selectedCarIndex = 0;
let playerDriverName = 'البطل';
let selectedDifficulty = 'normal';

function loadCarGameMainUI(container) {
    container.innerHTML = `
        <div style="width:100%; max-width:420px; background:#0f172a; border:2px solid #38bdf8; border-radius:15px; padding:20px; text-align:center; box-shadow:0 0 20px rgba(56,189,248,0.3);">
            <h2 style="color:#38bdf8; margin-bottom:15px;">🏁 سباق السيارات HD</h2>
            
            <div style="margin-bottom:15px; text-align:right;">
                <label style="color:#94a3b8; font-size:0.85rem;">اسم السائق:</label>
                <input type="text" id="driverNameInput" value="${playerDriverName}" style="width:100%; padding:8px; border-radius:6px; border:1px solid #334155; background:#1e293b; color:#fff; margin-top:4px;">
            </div>

            <div style="margin-bottom:15px;">
                <label style="color:#94a3b8; font-size:0.85rem; display:block; text-align:right; margin-bottom:6px;">اختر سيارتك المفضلة:</label>
                <div style="display:flex; justify-content:space-around; align-items:center;">
                    ${carSkins.map((car, idx) => `
                        <div onclick="selectCarSkin(${idx})" id="carSkin_${idx}" style="border:2px solid ${idx === selectedCarIndex ? '#38bdf8' : 'transparent'}; border-radius:10px; padding:5px; cursor:pointer; background:#1e293b;">
                            <img src="${car.src}" style="width:50px; height:80px; object-fit:cover; border-radius:6px;">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-bottom:20px; text-align:right;">
                <label style="color:#94a3b8; font-size:0.85rem;">مستوى الصعوبة:</label>
                <select id="diffSelect" style="width:100%; padding:8px; border-radius:6px; border:1px solid #334155; background:#1e293b; color:#fff; margin-top:4px;">
                    <option value="easy">سهل (سرعة بطيئة)</option>
                    <option value="normal" selected>متوسط (سباق قياسي)</option>
                    <option value="hard">صعب (تحدي المحترفين)</option>
                </select>
            </div>

            <button onclick="startCarGameEngine()" style="width:100%; padding:12px; font-size:1.1rem; background:#10b981; color:#fff; font-weight:bold; border:none; border-radius:8px; cursor:pointer; box-shadow:0 4px 12px rgba(16,185,129,0.4);">
                ▶ ابدأ اللعب الآن
            </button>
        </div>
    `;
}

function selectCarSkin(index) {
    selectedCarIndex = index;
    carSkins.forEach((_, idx) => {
        const el = document.getElementById(`carSkin_${idx}`);
        if (el) el.style.borderColor = (idx === index) ? '#38bdf8' : 'transparent';
    });
}

function startCarGameEngine() {
    const inputName = document.getElementById('driverNameInput')?.value;
    if (inputName) playerDriverName = inputName;
    const diffEl = document.getElementById('diffSelect');
    if (diffEl) selectedDifficulty = diffEl.value;

    const area = document.getElementById('activeGameArea');
    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <canvas id="carCanvas" width="360" height="520" style="background:#090d16; border:3px solid #38bdf8; border-radius:12px; max-width:100%; box-shadow:0 0 25px rgba(56,189,248,0.35);"></canvas>
            <p style="margin-top:10px; font-size:0.85rem; color:#94a3b8; text-align:center;">
                🎮 ⬆️ تسارع | ⬇️ فرامل | ⬅️ ➡️ توجيه حر
            </p>
        </div>
    `;

    const canvas = document.getElementById('carCanvas');
    const ctx = canvas.getContext('2d');

    const playerCarImg = new Image();
    playerCarImg.crossOrigin = "Anonymous";
    playerCarImg.src = carSkins[selectedCarIndex].src;

    const enemyCarImg = new Image();
    enemyCarImg.crossOrigin = "Anonymous";
    enemyCarImg.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=80';

    let score = 0;
    let gameOver = false;

    let baseEnemySpeed = selectedDifficulty === 'easy' ? 3 : (selectedDifficulty === 'hard' ? 6 : 4.2);

    const car = {
        x: canvas.width / 2 - 22,
        y: canvas.height - 110,
        width: 44,
        height: 80,
        speed: 0,
        maxSpeed: 7,
        acceleration: 0.2,
        friction: 0.05
    };

    const lanes = [40, 155, 270]; 

    const enemies = [
        { laneIndex: 0, x: lanes[0], y: -120, width: 44, height: 80, speed: baseEnemySpeed },
        { laneIndex: 1, x: lanes[1], y: -380, width: 44, height: 80, speed: baseEnemySpeed * 1.1 },
        { laneIndex: 2, x: lanes[2], y: -640, width: 44, height: 80, speed: baseEnemySpeed * 0.95 }
    ];

    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

    const handleKeyDown = (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
    };

    const handleKeyUp = (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let roadOffsetY = 0;

    function drawRoad() {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, 20, canvas.height);
        ctx.fillRect(canvas.width - 20, 0, 20, canvas.height);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(20, 0, 5, canvas.height);
        ctx.fillRect(canvas.width - 25, 0, 5, canvas.height);

        ctx.fillStyle = '#f8fafc';
        roadOffsetY = (roadOffsetY + (car.speed > 0 ? car.speed * 1.5 : 3)) % 50;

        for (let y = -50; y < canvas.height; y += 50) {
            ctx.fillRect(125, y + roadOffsetY, 4, 25);
            ctx.fillRect(235, y + roadOffsetY, 4, 25);
        }
    }

    function update() {
        if (gameOver) return;

        if (keys.ArrowUp) {
            if (car.speed < car.maxSpeed) car.speed += car.acceleration;
        } else if (keys.ArrowDown) {
            if (car.speed > -car.maxSpeed / 2) car.speed -= car.acceleration;
        } else {
            if (car.speed > 0) car.speed -= car.friction;
            if (car.speed < 0) car.speed += car.friction;
            if (Math.abs(car.speed) < car.friction) car.speed = 0;
        }

        if (keys.ArrowLeft) car.x -= 5;
        if (keys.ArrowRight) car.x += 5;

        if (car.x < 25) car.x = 25;
        if (car.x > canvas.width - car.width - 25) car.x = canvas.width - car.width - 25;

        enemies.forEach((enemy) => {
            enemy.y += enemy.speed + (car.speed * 0.4);

            if (enemy.y > canvas.height) {
                enemy.y = -150 - (Math.random() * 100);
                
                let availableLanes = [0, 1, 2];
                let chosenLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
                enemy.laneIndex = chosenLane;
                enemy.x = lanes[chosenLane];
                
                score += 15;
            }

            if (
                car.x < enemy.x + enemy.width - 5 &&
                car.x + car.width > enemy.x + 5 &&
                car.y < enemy.y + enemy.height - 5 &&
                car.y + car.height > enemy.y + 5
            ) {
                gameOver = true;
            }
        });
    }

    function draw() {
        drawRoad();

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(car.x + 4, car.y + 6, car.width, car.height);
        ctx.drawImage(playerCarImg, car.x, car.y, car.width, car.height);

        enemies.forEach(enemy => {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(enemy.x + 4, enemy.y + 6, enemy.width, enemy.height);
            ctx.drawImage(enemyCarImg, enemy.x, enemy.y, enemy.width, enemy.height);
        });

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px "Segoe UI", Tahoma';
        ctx.fillText(`السائق: ${playerDriverName}`, 30, 30);
        ctx.fillText(`النقاط: ${score}`, 30, 52);

        if (gameOver) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 26px "Segoe UI", Tahoma';
            ctx.textAlign = 'center';
            ctx.fillText('انتهت اللعبة! 💥', canvas.width / 2, canvas.height / 2 - 30);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '16px "Segoe UI", Tahoma';
            ctx.fillText(`اللاعب: ${playerDriverName}`, canvas.width / 2, canvas.height / 2 + 10);
            ctx.fillText(`مجموع النقاط: ${score}`, canvas.width / 2, canvas.height / 2 + 40);

            ctx.fillStyle = '#eab308';
            ctx.font = '14px "Segoe UI", Tahoma';
            ctx.fillText('اضغط زر "إعادة التشغيل 🔄" بالأعلى للعب فوراً', canvas.width / 2, canvas.height / 2 + 85);
            ctx.textAlign = 'start';
        }
    }

    function loop() {
        update();
        draw();
        if (!gameOver) {
            carGameAnimationId = requestAnimationFrame(loop);
        }
    }

    playerCarImg.onload = () => {
        loop();
    };
}

/* ==========================================
   🐍 لعبة الثعبان
   ========================================== */
function loadSnakeGame(container) {
    container.innerHTML = `
        <h3 style="margin-bottom:10px;">النقاط: <span id="snakeScore">0</span></h3>
        <canvas id="snakeCanvas" width="300" height="300"></canvas>
        <p style="margin-top:10px; font-size:0.85rem; color:#94a3b8;">استخدم أسهم الكيبورد للتحكم ⬆️ ⬇️ ⬅️ ➡️</p>
    `;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 15;
    let score = 0;

    let snake = { x: 150, y: 150, dx: grid, dy: 0, cells: [], maxCells: 4 };
    let apple = { x: 60, y: 60 };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    document.onkeydown = function(e) {
        if (e.key === 'ArrowLeft' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
        else if (e.key === 'ArrowUp' && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
        else if (e.key === 'ArrowRight' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
        else if (e.key === 'ArrowDown' && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
    };

    function loop() {
        currentGameInterval = setTimeout(function() {
            requestAnimationFrame(loop);
        }, 1000 / 10);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) snake.x = canvas.width - grid;
        else if (snake.x >= canvas.width) snake.x = 0;
        
        if (snake.y < 0) snake.y = canvas.height - grid;
        else if (snake.y >= canvas.height) snake.y = 0;

        snake.cells.unshift({ x: snake.x, y: snake.y });

        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

        ctx.fillStyle = '#10b981';
        snake.cells.forEach(function(cell, index) {
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score += 10;
                document.getElementById('snakeScore').innerText = score;
                apple.x = getRandomInt(0, 20) * grid;
                apple.y = getRandomInt(0, 20) * grid;
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = 150;
                    snake.y = 150;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = grid;
                    snake.dy = 0;
                    score = 0;
                    document.getElementById('snakeScore').innerText = score;
                }
            }
        });
    }
    requestAnimationFrame(loop);
}

/* ==========================================
   🎴 لعبة قوه الذاكرة
   ========================================== */
function loadMemoryGame(container) {
    const icons = ['🐶', '🐱', '🦊', '🦁', '🐶', '🐱', '🦊', '🦁'];
    let shuffled = icons.sort(() => 0.5 - Math.random());
    let flippedCards = [];
    let matchedCount = 0;

    container.innerHTML = `
        <h3 id="memStatus" style="margin-bottom:10px;">طابق الصور المماثلة!</h3>
        <div class="memory-grid" id="memoryGrid"></div>
    `;

    const gridEl = document.getElementById('memoryGrid');
    shuffled.forEach((icon, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.dataset.index = idx;
        card.innerText = '❓';

        card.onclick = () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                card.innerText = icon;
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    if (flippedCards[0].dataset.icon === flippedCards[1].dataset.icon) {
                        matchedCount += 2;
                        flippedCards = [];
                        if (matchedCount === icons.length) {
                            document.getElementById('memStatus').innerText = '🎉 أحسنت! كسبت اللعبة!';
                        }
                    } else {
                        setTimeout(() => {
                            flippedCards.forEach(c => {
                                c.classList.remove('flipped');
                                c.innerText = '❓';
                            });
                            flippedCards = [];
                        }, 800);
                    }
                }
            }
        };
        gridEl.appendChild(card);
    });
}

/* ==========================================
   🏓 لعبة كرة الطاولة
   ========================================== */
function loadPongGame(container) {
    container.innerHTML = `
        <canvas id="pongCanvas" width="320" height="250"></canvas>
        <p style="margin-top:10px; font-size:0.85rem; color:#94a3b8;">حرّك الماوس يميناً ويساراً للتحكم بالمضرب</p>
    `;

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    let paddleWidth = 70, paddleHeight = 10, paddleX = (canvas.width - paddleWidth) / 2;
    let x = canvas.width / 2, y = canvas.height - 30;
    let dx = 2, dy = -2, ballRadius = 6;

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.closePath();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
        if (y + dy < ballRadius) dy = -dy;
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2; dy = -2;
            }
        }

        x += dx;
        y += dy;
    }

    currentGameInterval = setInterval(draw, 10);
}

/* ==========================================
   ❌⭕ لعبة XO
   ========================================== */
function loadXOGame(container) {
    let board = ["", "", "", "", "", "", "", "", ""];
    let turn = "X";
    container.innerHTML = `<h3 id="xoStatus">دور اللاعب: X</h3><div class="xo-board" id="xoBoard"></div>`;
    const boardEl = document.getElementById('xoBoard');
    board.forEach((_, idx) => {
        const cell = document.createElement('div');
        cell.className = 'xo-cell';
        cell.onclick = () => {
            if (board[idx] !== "") return;
            board[idx] = turn;
            cell.innerText = turn;
            cell.style.color = turn === 'X' ? '#f87171' : '#60a5fa';
            if (checkWin(board)) {
                document.getElementById('xoStatus').innerText = `🎉 الفائز هو ${turn}!`;
            } else {
                turn = turn === "X" ? "O" : "X";
                document.getElementById('xoStatus').innerText = `دور اللاعب: ${turn}`;
            }
        };
        boardEl.appendChild(cell);
    });
}

function checkWin(b) {
    const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return w.some(p => b[p[0]] && b[p[0]] === b[p[1]] && b[p[0]] === b[p[2]]);
}

/* ==========================================
   ⚡ لعبة النقر السريع
   ========================================== */
function loadClickerGame(container) {
    let score = 0;
    container.innerHTML = `
        <h2>النقاط: <span id="score">0</span></h2><br>
        <button class="clicker-btn" onclick="document.getElementById('score').innerText = ++score">اضغط بسرعة! 🚀</button>
    `;
}

/* ==========================================
   🔢 لعبة تخمين الرقم
   ========================================== */
function loadGuessGame(container) {
    const secret = Math.floor(Math.random() * 10) + 1;
    container.innerHTML = `
        <h3>خمن رقماً بين 1 و 10</h3><br>
        <input type="number" id="guessInput" class="search-box" style="width:100px; text-align:center;">
        <br><br>
        <button class="cat-btn" onclick="
            let g = document.getElementById('guessInput').value;
            let res = document.getElementById('guessRes');
            if(g == ${secret}) res.innerText = '🎉 إجابة صحيحة!';
            else res.innerText = '❌ خطأ، جرب رقم آخر!';
        ">تخمين</button>
        <h4 id="guessRes" style="margin-top:15px; color:#38bdf8;"></h4>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderGames(gamesList);
});