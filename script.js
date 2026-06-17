/**
 * Jogo da Cobrinha (Snake Game) - Versão Neon Premium (Fases, Obstáculos, Especialidades)
 * Desenvolvido em HTML5 Canvas e JavaScript Puro
 */

// --- CONFIGURAÇÕES DE ESPAÇO ---
const GRID_SIZE = 20; // Grade de tamanho 20x20
const LOGICAL_SIZE = 400; // Tamanho virtual do Canvas
const CELL_SIZE = LOGICAL_SIZE / GRID_SIZE; // Cada célula possui 20px de tamanho lógico
const LEVEL_BASE_SPEEDS = [
  180, 172, 164, 156, 148,
  140, 134, 128, 122, 116,
  110, 105, 100, 95, 90,
  86, 82, 78, 74, 70
];
const FOOD_ACCELERATION_EVERY = 5;
const FOOD_ACCELERATION_STEP = 2;
const MAX_FOOD_ACCELERATION = 16;
const MIN_SAFE_MOVE_INTERVAL = 64;
const ENERGY_BOOST_MULTIPLIER = 0.7;

// --- ESTADOS DE JOGO ---
const STATES = {
  WELCOME: 'WELCOME',
  LEVEL_SELECT: 'LEVEL_SELECT',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_COMPLETED: 'LEVEL_COMPLETED',
  GAMEOVER: 'GAMEOVER',
  VICTORY: 'VICTORY'
};

let gameState = STATES.WELCOME;

// --- DEFINIÇÃO DOS 20 NÍVEIS ---
// Certificamos que os obstáculos nunca nasçam perto do spawn central da cobra (X: 8-11, Y: 10)
const levels = [
  // Fases 1 a 5 — Tema: Clássico Neon (Fácil, sem obstáculos)
  { 
    id: 1, name: "Neon Startup", theme: "Clássico Neon", target: 10, speed: 180, difficulty: "Fácil",
    initialLength: 3, obstacles: [], allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#090d16", grid: "#10b981", snakeHead: "#10b981", snakeBody: "#047857", obstacle: "#f59e0b", food: "#f43f5e" }
  },
  { 
    id: 2, name: "Neon Glow", theme: "Clássico Neon", target: 12, speed: 172, difficulty: "Fácil",
    initialLength: 3, obstacles: [], allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#090d16", grid: "#10b981", snakeHead: "#10b981", snakeBody: "#047857", obstacle: "#f59e0b", food: "#f43f5e" }
  },
  { 
    id: 3, name: "Grid Explorer", theme: "Clássico Neon", target: 14, speed: 164, difficulty: "Fácil",
    initialLength: 3, obstacles: [], allowedFoods: ["normal"], wallsBehavior: "wrap", // Borda infinita de exemplo!
    colors: { bg: "#090d16", grid: "#10b981", snakeHead: "#10b981", snakeBody: "#047857", obstacle: "#f59e0b", food: "#f43f5e" }
  },
  { 
    id: 4, name: "Digital Pathway", theme: "Clássico Neon", target: 16, speed: 156, difficulty: "Fácil",
    initialLength: 3, obstacles: [], allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#090d16", grid: "#10b981", snakeHead: "#10b981", snakeBody: "#047857", obstacle: "#f59e0b", food: "#f43f5e" }
  },
  { 
    id: 5, name: "Luzes de Safira", theme: "Clássico Neon", target: 18, speed: 148, difficulty: "Fácil",
    initialLength: 3, obstacles: [], allowedFoods: ["normal"], wallsBehavior: "wrap", // Borda infinita de exemplo!
    colors: { bg: "#090d16", grid: "#10b981", snakeHead: "#10b981", snakeBody: "#047857", obstacle: "#f59e0b", food: "#f43f5e" }
  },

  // Fases 6 a 10 — Tema: Labirinto Âmbar (Médio, obstáculos fixos, cobra verde/azul, comida contraste)
  { 
    id: 6, name: "Colunas de Neon", theme: "Labirinto Âmbar", target: 18, speed: 140, difficulty: "Médio",
    initialLength: 4, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#110d05", grid: "#f59e0b", snakeHead: "#0ea5e9", snakeBody: "#0284c7", obstacle: "#f59e0b", food: "#ec4899" },
    obstacles: [
      {x: 10, y: 3}, {x: 10, y: 4}, {x: 10, y: 5},
      {x: 10, y: 15}, {x: 10, y: 16}, {x: 10, y: 17}
    ]
  },
  { 
    id: 7, name: "Fortaleza Quad", theme: "Labirinto Âmbar", target: 20, speed: 134, difficulty: "Médio",
    initialLength: 4, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#110d05", grid: "#f59e0b", snakeHead: "#0ea5e9", snakeBody: "#0284c7", obstacle: "#f59e0b", food: "#ec4899" },
    obstacles: [
      {x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 4},
      {x: 15, y: 4}, {x: 15, y: 5}, {x: 14, y: 4},
      {x: 4, y: 15}, {x: 4, y: 14}, {x: 5, y: 15},
      {x: 15, y: 15}, {x: 15, y: 14}, {x: 14, y: 15}
    ]
  },
  { 
    id: 8, name: "Trilhos Horizontais", theme: "Labirinto Âmbar", target: 22, speed: 128, difficulty: "Médio",
    initialLength: 4, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#110d05", grid: "#f59e0b", snakeHead: "#0ea5e9", snakeBody: "#0284c7", obstacle: "#f59e0b", food: "#ec4899" },
    obstacles: [
      {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7},
      {x: 13, y: 13}, {x: 14, y: 13}, {x: 15, y: 13}, {x: 16, y: 13}
    ]
  },
  { 
    id: 9, name: "Lados Opostos", theme: "Labirinto Âmbar", target: 24, speed: 122, difficulty: "Médio",
    initialLength: 4, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#110d05", grid: "#f59e0b", snakeHead: "#0ea5e9", snakeBody: "#0284c7", obstacle: "#f59e0b", food: "#ec4899" },
    obstacles: [
      {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 5, y: 6},
      {x: 14, y: 14}, {x: 13, y: 14}, {x: 12, y: 14}, {x: 14, y: 13}
    ]
  },
  { 
    id: 10, name: "Muralha de Berlim", theme: "Labirinto Âmbar", target: 26, speed: 116, difficulty: "Médio",
    initialLength: 4, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#110d05", grid: "#f59e0b", snakeHead: "#0ea5e9", snakeBody: "#0284c7", obstacle: "#f59e0b", food: "#ec4899" },
    obstacles: [
      {x: 10, y: 2}, {x: 10, y: 3}, {x: 10, y: 4},
      {x: 10, y: 15}, {x: 10, y: 16}, {x: 10, y: 17},
      {x: 2, y: 10}, {x: 3, y: 10}, {x: 16, y: 10}, {x: 17, y: 10}
    ]
  },

  // Fases 11 a 15 — Tema: Dimensão Energia (Difícil, comidas especiais + cyberpunk palette, cobra 4 pçs)
  { 
    id: 11, name: "Núcleo Reverso", theme: "Dimensão Energia", target: 24, speed: 110, difficulty: "Difícil",
    initialLength: 5, allowedFoods: ["normal", "golden", "energy", "reduction"], wallsBehavior: "wrap", // Borda infinita para diversão reclinada
    colors: { bg: "#0d0b1f", grid: "#8b5cf6", snakeHead: "#06b6d4", snakeBody: "#0891b2", obstacle: "#ec4899", food: "#f43f5e" },
    obstacles: [
      {x: 9, y: 5}, {x: 10, y: 5}, {x: 9, y: 15}, {x: 10, y: 15}
    ]
  },
  { 
    id: 12, name: "Isolamento Externo", theme: "Dimensão Energia", target: 26, speed: 105, difficulty: "Difícil",
    initialLength: 5, allowedFoods: ["normal", "golden", "energy", "reduction"], wallsBehavior: "solid",
    colors: { bg: "#0d0b1f", grid: "#8b5cf6", snakeHead: "#06b6d4", snakeBody: "#0891b2", obstacle: "#ec4899", food: "#f43f5e" },
    obstacles: [
      {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6},
      {x: 15, y: 13}, {x: 15, y: 14}, {x: 15, y: 15}, {x: 15, y: 16}
    ]
  },
  { 
    id: 13, name: "Zig Zag Neon", theme: "Dimensão Energia", target: 28, speed: 100, difficulty: "Difícil",
    initialLength: 5, allowedFoods: ["normal", "golden", "energy", "reduction"], wallsBehavior: "solid",
    colors: { bg: "#0d0b1f", grid: "#8b5cf6", snakeHead: "#06b6d4", snakeBody: "#0891b2", obstacle: "#ec4899", food: "#f43f5e" },
    obstacles: [
      {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6},
      {x: 13, y: 14}, {x: 14, y: 14}, {x: 15, y: 14}, {x: 16, y: 14},
      {x: 10, y: 1}
    ]
  },
  { 
    id: 14, name: "Relógio Biológico", theme: "Dimensão Energia", target: 30, speed: 95, difficulty: "Difícil",
    initialLength: 5, allowedFoods: ["normal", "golden", "energy", "reduction"], wallsBehavior: "solid",
    colors: { bg: "#0d0b1f", grid: "#8b5cf6", snakeHead: "#06b6d4", snakeBody: "#0891b2", obstacle: "#ec4899", food: "#f43f5e" },
    obstacles: [
      {x: 8, y: 4}, {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4},
      {x: 8, y: 16}, {x: 9, y: 16}, {x: 10, y: 16}, {x: 11, y: 16}
    ]
  },
  { 
    id: 15, name: "Arena Estelar", theme: "Dimensão Energia", target: 32, speed: 90, difficulty: "Difícil",
    initialLength: 5, allowedFoods: ["normal", "golden", "energy", "reduction"], wallsBehavior: "solid",
    colors: { bg: "#0d0b1f", grid: "#8b5cf6", snakeHead: "#06b6d4", snakeBody: "#0891b2", obstacle: "#ec4899", food: "#f43f5e" },
    obstacles: [
      {x: 3, y: 3}, {x: 16, y: 3}, {x: 3, y: 16}, {x: 16, y: 16},
      {x: 10, y: 4}, {x: 10, y: 16}, {x: 4, y: 10}, {x: 16, y: 10}
    ]
  },

  // Fases 16 a 20 — Tema: Caos Controlado (Extremo, mais velozes, cobra 5 pçs)
  { 
    id: 16, name: "Canal do Meio", theme: "Caos Controlado", target: 30, speed: 86, difficulty: "Extremo",
    initialLength: 6, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#180505", grid: "#ef4444", snakeHead: "#22c55e", snakeBody: "#16a34a", obstacle: "#ef4444", food: "#fbbf24" },
    obstacles: [
      {x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7},
      {x: 13, y: 13}, {x: 14, y: 13}, {x: 15, y: 13}, {x: 16, y: 13}, {x: 17, y: 13}, {x: 18, y: 13}, {x: 19, y: 13}
    ]
  },
  { 
    id: 17, name: "Labirinto Interno", theme: "Caos Controlado", target: 32, speed: 82, difficulty: "Extremo",
    initialLength: 6, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#180505", grid: "#ef4444", snakeHead: "#22c55e", snakeBody: "#16a34a", obstacle: "#ef4444", food: "#fbbf24" },
    obstacles: [
      {x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 8, y: 7},
      {x: 11, y: 12}, {x: 11, y: 13}, {x: 12, y: 13}, {x: 13, y: 13}
    ]
  },
  { 
    id: 18, name: "Paredes Trincadas", theme: "Caos Controlado", target: 34, speed: 78, difficulty: "Extremo",
    initialLength: 6, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#180505", grid: "#ef4444", snakeHead: "#22c55e", snakeBody: "#16a34a", obstacle: "#ef4444", food: "#fbbf24" },
    obstacles: [
      {x: 5, y: 5}, {x: 5, y: 6}, {x: 6, y: 5},
      {x: 14, y: 5}, {x: 14, y: 6}, {x: 13, y: 5},
      {x: 5, y: 14}, {x: 5, y: 13}, {x: 6, y: 14},
      {x: 14, y: 14}, {x: 14, y: 13}, {x: 13, y: 14}
    ]
  },
  { 
    id: 19, name: "Barreiras Esparsas", theme: "Caos Controlado", target: 36, speed: 74, difficulty: "Extremo",
    initialLength: 6, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#180505", grid: "#ef4444", snakeHead: "#22c55e", snakeBody: "#16a34a", obstacle: "#ef4444", food: "#fbbf24" },
    obstacles: [
      {x: 3, y: 5}, {x: 3, y: 6}, {x: 3, y: 7},
      {x: 8, y: 3}, {x: 9, y: 3}, {x: 10, y: 3},
      {x: 16, y: 12}, {x: 16, y: 13}, {x: 16, y: 14},
      {x: 9, y: 16}, {x: 10, y: 16}, {x: 11, y: 16}
    ]
  },
  { 
    id: 20, name: "O Desafio Supremo", theme: "Caos Controlado", target: 40, speed: 70, difficulty: "Extremo",
    initialLength: 6, allowedFoods: ["normal"], wallsBehavior: "solid",
    colors: { bg: "#180505", grid: "#ef4444", snakeHead: "#22c55e", snakeBody: "#16a34a", obstacle: "#ef4444", food: "#fbbf24" },
    obstacles: [
      {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5},
      {x: 12, y: 5}, {x: 13, y: 5}, {x: 14, y: 5},
      {x: 5, y: 14}, {x: 6, y: 14}, {x: 7, y: 14},
      {x: 12, y: 14}, {x: 13, y: 14}, {x: 14, y: 14},
      {x: 5, y: 8}, {x: 5, y: 11}, {x: 14, y: 8}, {x: 14, y: 11}
    ]
  }
];

// --- ARQUITETURA DE ATIVOS E ESTRUTURA VISUAL FUTURA ---
// Atualmente o jogo utiliza desenhos via Canvas (API nativa de renderização) para maximizar o desempenho neon.
// A estrutura de pastas '/assets' e os caminhos listados em 'assetPaths' estão 100% preparados para uma evolução futura:
// futuramente será possível trocar os desenhos por sprites e imagens reais usando esses caminhos, sem quebrar a lógica de estados.
const assetPaths = {
  snake: {
    head: "/assets/snake/head.png",
    body: "/assets/snake/body.png"
  },
  food: {
    normal: "/assets/food/normal.png",
    golden: "/assets/food/golden.png",
    energy: "/assets/food/energy.png",
    shrink: "/assets/food/shrink.png"
  },
  obstacles: {
    block: "/assets/obstacles/block.png"
  },
  backgrounds: {
    classicNeon: "/assets/backgrounds/classic-neon.png",
    amberMaze: "/assets/backgrounds/amber-maze.png",
    energyDimension: "/assets/backgrounds/energy-dimension.png",
    controlledChaos: "/assets/backgrounds/controlled-chaos.png"
  }
};

// Configuração centralizada dos temas visuais para os 4 mundos/temas das fases do jogo.
// Esta camada isola o design visual de cada tema (cores de fundo, grades, cobrinha, comidas e obstáculos).
const themeConfig = {
  "Clássico Neon": {
    backgroundColor: "#090d16",
    gridColor: "#10b981",
    snakeHeadColor: "#10b981",
    snakeBodyColor: "#047857",
    snakeGlowColor: "#10b981",
    foodColor: "#f43f5e",
    obstacleColor: "#f59e0b",
    accentColor: "#10b981"
  },
  "Labirinto Âmbar": {
    backgroundColor: "#110d05",
    gridColor: "#f59e0b",
    snakeHeadColor: "#0ea5e9",
    snakeBodyColor: "#0284c7",
    snakeGlowColor: "#0ea5e9",
    foodColor: "#ec4899",
    obstacleColor: "#f59e0b",
    accentColor: "#f59e0b"
  },
  "Dimensão Energia": {
    backgroundColor: "#0d0b1f",
    gridColor: "#8b5cf6",
    snakeHeadColor: "#06b6d4",
    snakeBodyColor: "#0891b2",
    snakeGlowColor: "#06b6d4",
    normalFoodColor: "#f43f5e",
    goldenFoodColor: "#fbbf24",
    energyFoodColor: "#06b6d4",
    shrinkFoodColor: "#a855f7",
    obstacleColor: "#ec4899",
    accentColor: "#8b5cf6"
  },
  "Caos Controlado": {
    backgroundColor: "#180505",
    gridColor: "#ef4444",
    snakeHeadColor: "#22c55e",
    snakeBodyColor: "#16a34a",
    snakeGlowColor: "#22c55e",
    foodColor: "#fbbf24",
    obstacleColor: "#ef4444",
    accentColor: "#ef4444"
  }
};

/**
 * Retorna o tema correto de acordo com a fase especificada ou ativa.
 * @param {object} [lvl] - Objeto opcional contendo informações do nível. Se omitido, usa-se o nível atual.
 * @returns {object} O tema estruturado a partir do themeConfig.
 */
function getCurrentTheme(lvl) {
  const currentLvl = lvl || levels[currentLevelIndex];
  if (!currentLvl) {
    return themeConfig["Clássico Neon"];
  }
  return themeConfig[currentLvl.theme] || themeConfig["Clássico Neon"];
}

function getLevelBaseSpeed(lvl) {
  const levelId = lvl?.id || 1;
  const configuredSpeed = lvl?.speed;
  const fallbackSpeed = LEVEL_BASE_SPEEDS[levelId - 1] || LEVEL_BASE_SPEEDS[0];
  return Number.isFinite(configuredSpeed) ? configuredSpeed : fallbackSpeed;
}

function getFoodAcceleration() {
  const accelerationSteps = Math.floor(levelFoodsEaten / FOOD_ACCELERATION_EVERY);
  return Math.min(accelerationSteps * FOOD_ACCELERATION_STEP, MAX_FOOD_ACCELERATION);
}

function getCurrentMoveInterval() {
  const acceleratedSpeed = baseGameSpeed - getFoodAcceleration();
  return Math.max(acceleratedSpeed, MIN_SAFE_MOVE_INTERVAL);
}

function getWallRule(lvl) {
  const behavior = lvl?.wallsBehavior || 'solid';

  if (behavior === 'wrap') {
    return {
      key: 'free',
      cardLabel: 'BORDA LIVRE',
      hudLabel: 'LIVRES',
      description: 'Atravessa todas as bordas',
      className: 'wall-free',
      wrapsX: true,
      wrapsY: true
    };
  }

  if (behavior === 'wrap-x' || behavior === 'lateral') {
    return {
      key: 'lateral',
      cardLabel: 'PORTAL LATERAL',
      hudLabel: 'LATERAIS',
      description: 'Atravessa esquerda e direita',
      className: 'wall-lateral',
      wrapsX: true,
      wrapsY: false
    };
  }

  if (behavior === 'wrap-y' || behavior === 'vertical') {
    return {
      key: 'vertical',
      cardLabel: 'PORTAL VERTICAL',
      hudLabel: 'VERTICAIS',
      description: 'Atravessa cima e baixo',
      className: 'wall-vertical',
      wrapsX: false,
      wrapsY: true
    };
  }

  return {
    key: 'solid',
    cardLabel: 'PAREDE SOLIDA',
    hudLabel: 'FECHADAS',
    description: 'Bateu na borda, perdeu',
    className: 'wall-solid',
    wrapsX: false,
    wrapsY: false
  };
}

// --- VARIÁVEIS SENSORIAIS E ESTADUAIS DO JOGO ---
let currentLevelIndex = 0; // Fase carregada (0 a 19)
let isCampaignMode = true; // Define se está progredindo (true) ou jogando nível isolado (false)
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let foodType = 'normal'; // 'normal', 'golden', 'energy', 'reduction'
let orientationBlocked = false; // Controle de bloqueio para touch landscape
let savedStateBeforeBlock = null; // Memoriza estado para restauração dinâmica post-bloqueio
let campaignCarryOverLength = 0; // Comprimento transportado no modo campanha
let score = 0; // Score acumulado de todas as partidas se continuar
let levelFoodsEaten = 0; // Quantidade de comidas colhidas na fase corrente
let highScore = 0;

// Temporizadores e buffs especiais
let baseGameSpeed = LEVEL_BASE_SPEEDS[0]; // Velocidade base definida pela fase atual
let speedBoostTimer = 0; // Buff de supervelocidade restante (frames de jogo)
let reductionSplashTimer = 0; // Efeito estético de reduzir tamanho

// Controle do loop de animação de alta precisão
const MAX_FRAME_DELTA = 250;
const MAX_LOGIC_STEPS_PER_FRAME = 3;
let lastFrameTime = 0;
let logicAccumulator = 0;
let animationFrameId = null;

// Matrizes visuais extras
let particles = [];
let foodPulseAngle = 0;
let scoreWobbleTimeoutId = null;
let activeLevel = levels[currentLevelIndex];
let activeTheme = getCurrentTheme(activeLevel);
const snakeGradientCache = {
  key: '',
  colors: []
};

// --- SISTEMAS DE ÁUDIO (WEB AUDIO API) ---
let audioCtx = null;
let isSoundEnabled = true;

/**
 * Inicializa e retoma o AudioContext de maneira segura após interação do usuário.
 */
function initAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  } catch (e) {
    console.warn("Web Audio API não é suportada ou foi bloqueada pelo navegador:", e);
  }
}

/**
 * Toca o som de arcade quando a cobra se alimenta de acordo com o tipo do item
 * @param {string} type Tipo do item colhido ('normal', 'golden', 'energy', 'reduction')
 */
function playEatSound(type) {
  if (!isSoundEnabled) return;
  
  // Garante a inicialização ou retorno do contexto de áudio
  if (!audioCtx) {
    initAudio();
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;

    if (type === 'golden') {
      // 2. Comida Dourada: Som mais dinâmico, brilhante, agudo e com sensação de bônus (varredura ascendente de onda senoidal de 880Hz a 1760Hz)
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } 
    else if (type === 'energy') {
      // 3. Comida de Energia: Som mais elétrico/cibernético formado por duas notas rápidas crescentes no estilo arpeggio
      const osc1 = audioCtx.createOscillator();
      const gainNode1 = audioCtx.createGain();
      osc1.connect(gainNode1);
      gainNode1.connect(audioCtx.destination);
      
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(659.25, now); // Nota E5
      gainNode1.gain.setValueAtTime(0.04, now);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      
      osc1.start(now);
      osc1.stop(now + 0.06);

      const osc2 = audioCtx.createOscillator();
      const gainNode2 = audioCtx.createGain();
      osc2.connect(gainNode2);
      gainNode2.connect(audioCtx.destination);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(987.77, now + 0.05); // Nota B5
      gainNode2.gain.setValueAtTime(0.04, now + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc2.start(now + 0.05);
      osc2.stop(now + 0.12);
    } 
    else if (type === 'reduction' || type === 'shrink') {
      // 4. Comida de Redução: Onda senoidal/triangular de pitch descendente (para soar suave e indicar mudança sem parecer erro)
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // Nota D5
      osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.15); // Nota D4
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } 
    else {
      // 1. Comida Normal: Som curto e chic de tom arcade leve (varredura rápida de onda triangular de 523Hz a 880Hz)
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // Nota C5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // Nota A5
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (err) {
    console.warn("Falha ao sintetizar tom de áudio:", err);
  }
}

/**
 * Toca o som de Game Over (tom descendente dramático, no estilo retro/arcade)
 */
function playGameOverSound() {
  if (!isSoundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220.00, now); // Nota A3
    osc.frequency.exponentialRampToValueAtTime(82.41, now + 0.35); // Nota E2
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn("Falha ao tocar som de Game Over:", err);
  }
}

/**
 * Toca som curto e agradável de Fase Concluída (duas notas brilhantes crescentes)
 */
function playLevelCompleteSound() {
  if (!isSoundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    
    // Primeira nota (G5)
    const osc1 = audioCtx.createOscillator();
    const gainNode1 = audioCtx.createGain();
    osc1.connect(gainNode1);
    gainNode1.connect(audioCtx.destination);
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now);
    gainNode1.gain.setValueAtTime(0.05, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc1.start(now);
    osc1.stop(now + 0.12);
    
    // Segunda nota (C6)
    const osc2 = audioCtx.createOscillator();
    const gainNode2 = audioCtx.createGain();
    osc2.connect(gainNode2);
    gainNode2.connect(audioCtx.destination);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.08);
    gainNode2.gain.setValueAtTime(0.05, now + 0.08);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc2.start(now + 0.08);
    osc2.stop(now + 0.22);
  } catch (err) {
    console.warn("Falha ao tocar som de Fase Concluída:", err);
  }
}

/**
 * Toca efeito sonoro mais festivo de Vitória Final (arpeggio maior triunfante)
 */
function playVictorySound() {
  if (!isSoundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const notes = [
      { f: 523.25, t: 0.0 },  // C5
      { f: 659.25, t: 0.08 }, // E5
      { f: 783.99, t: 0.16 }, // G5
      { f: 1046.50, t: 0.24 } // C6
    ];
    notes.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.t);
      gainNode.gain.setValueAtTime(0.04, now + note.t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.3);
      
      osc.start(now + note.t);
      osc.stop(now + note.t + 0.3);
    });
  } catch (err) {
    console.warn("Falha ao tocar som de Vitória Final:", err);
  }
}

/**
 * Toca som de clique de botão extremamente sutil e leve
 */
function playButtonSound() {
  if (!isSoundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.04);
    
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    // Falha silenciosa
  }
}

// --- ELEMENTOS DOM REVESTIDOS ---
const appContainer = document.getElementById('app-container');
const gameArena = document.getElementById('game-arena');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const finalScoreEl = document.getElementById('final-score');
const finalHighScoreEl = document.getElementById('final-high-score');

// Status Bar do Cabeçalho da Fase
const gameStatusBar = document.getElementById('game-status-bar');
const modeBadge = document.getElementById('mode-badge');
const phaseTitle = document.getElementById('phase-title');
const wallRuleBadge = document.getElementById('wall-rule-badge');
const targetProgress = document.getElementById('target-progress');

// Telas de Overlays Integradas
const startOverlay = document.getElementById('start-overlay');
const levelSelectOverlay = document.getElementById('level-select-overlay');
const levelCompletedOverlay = document.getElementById('level-completed-overlay');
const victoryOverlay = document.getElementById('victory-overlay');
const gameoverOverlay = document.getElementById('gameover-overlay');

// Nodos de Informação nos Overlays
const completedTitle = document.getElementById('completed-title');
const completedDesc = document.getElementById('completed-desc');
const completedScore = document.getElementById('completed-score');
const completedNextTarget = document.getElementById('completed-next-target');
const completedNextTargetLabel = document.getElementById('completed-next-target-label');
const victoryScore = document.getElementById('victory-score');
const victoryHighScore = document.getElementById('victory-high-score');

// Botões de Entrada / Modos
const btnCampaign = document.getElementById('btn-campaign');
const btnShowLevels = document.getElementById('btn-show-levels');
const btnBackToMenuOverlay = document.getElementById('btn-back-to-menu-overlay');

// Botões de Ações dos Overlays
const btnNextLevel = document.getElementById('btn-next-level');
const btnReplayLevel = document.getElementById('btn-replay-level');
const btnSelectDifferentLevel = document.getElementById('btn-select-different-level');
const btnVictoryRestart = document.getElementById('btn-victory-restart');
const btnVictorySelector = document.getElementById('btn-victory-selector');
const btnRestart = document.getElementById('btn-restart'); // Game Over button
const btnGameOverMenu = document.getElementById('btn-gameover-menu'); // Game Over Menu button

// Botões de Rodapé / Controles
const btnPause = document.getElementById('btn-pause');
const btnRestartCurrentOnly = document.getElementById('btn-restart-current-only');
const btnSelectFaseFooter = document.getElementById('btn-select-fase-footer');
const btnMenu = document.getElementById('btn-menu');
const pauseText = document.getElementById('pause-text');

// Teclado Mobile Virtual
const ctrlUp = document.getElementById('ctrl-up');
const ctrlDown = document.getElementById('ctrl-down');
const ctrlLeft = document.getElementById('ctrl-left');
const ctrlRight = document.getElementById('ctrl-right');

let mobileLayoutFrameId = null;

function getVisibleViewportSize() {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width || window.innerWidth || document.documentElement.clientWidth,
    height: viewport?.height || window.innerHeight || document.documentElement.clientHeight
  };
}

function syncMobilePortraitLayout() {
  const { width, height } = getVisibleViewportSize();
  const root = document.documentElement;
  root.style.setProperty('--app-height', `${Math.floor(height)}px`);

  const isPortrait = height >= width;
  const isPortableWidth = width <= 1366;
  const isTouchLayout = window.matchMedia('(pointer: coarse)').matches || width <= 767;

  if (!appContainer || !gameArena || !isPortrait || !isPortableWidth || !isTouchLayout) {
    root.style.removeProperty('--game-board-size');
    root.style.removeProperty('--menu-panel-height');
    return;
  }

  const bodyStyles = window.getComputedStyle(document.body);
  const containerStyles = window.getComputedStyle(appContainer);
  const parsePx = (value) => Number.parseFloat(value) || 0;
  const parseGap = (value) => {
    const numericValue = Number.parseFloat(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };
  const bodyVerticalPadding = parsePx(bodyStyles.paddingTop) + parsePx(bodyStyles.paddingBottom);
  const bodyHorizontalPadding = parsePx(bodyStyles.paddingLeft) + parsePx(bodyStyles.paddingRight);
  const visibleChildren = Array.from(appContainer.children).filter((element) => {
    const styles = window.getComputedStyle(element);
    return styles.display !== 'none' && styles.visibility !== 'hidden';
  });

  const gap = parseGap(containerStyles.rowGap) ?? parsePx(containerStyles.gap);
  const gapsHeight = Math.max(0, visibleChildren.length - 1) * gap;
  const fixedHeight = visibleChildren.reduce((total, element) => {
    if (element === gameArena) return total;
    return total + element.getBoundingClientRect().height;
  }, 0);
  const availableHeight = height - bodyVerticalPadding - fixedHeight - gapsHeight - 12;
  const availableWidth = Math.min(
    appContainer.getBoundingClientRect().width || width - bodyHorizontalPadding,
    width - bodyHorizontalPadding
  );
  const boardSize = Math.floor(Math.max(120, Math.min(availableWidth, availableHeight)));
  const isExpandedPanelState = appContainer.classList.contains('state-welcome') ||
    appContainer.classList.contains('state-level-select') ||
    appContainer.classList.contains('state-gameover');
  const targetPanelHeight = isExpandedPanelState
    ? Math.floor(Math.max(boardSize, Math.min(availableHeight, availableWidth * 1.42)))
    : boardSize;

  root.style.setProperty('--game-board-size', `${boardSize}px`);
  root.style.setProperty('--menu-panel-height', `${targetPanelHeight}px`);
}

function queueMobilePortraitLayoutSync() {
  if (mobileLayoutFrameId) {
    cancelAnimationFrame(mobileLayoutFrameId);
  }

  mobileLayoutFrameId = requestAnimationFrame(() => {
    mobileLayoutFrameId = null;
    syncMobilePortraitLayout();
  });
}

// --- INICIALIZADOR DE NAVEGAÇÃO E EVENTOS ---

function loadHighScore() {
  // O recorde agora é temporário da sessão atual e começa em 000 a cada carregamento de página.
  // Leitura e persistência em localStorage foram removidas.
  highScore = 0;
  updateHighScoreDisplay();
}

function setupEventHandlers() {
  // 1. Modos da Tela Inicial
  btnCampaign.addEventListener('click', () => {
    playButtonSound();
    isCampaignMode = true;
    currentLevelIndex = 0; // Começa da fase 1
    transitionTo(STATES.PLAYING);
  });

  btnShowLevels.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.LEVEL_SELECT);
  });

  btnBackToMenuOverlay.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.WELCOME);
  });

  // 2. Eventos nos overlays de desfecho
  btnNextLevel.addEventListener('click', () => {
    playButtonSound();
    advanceToNextLevel();
  });

  btnReplayLevel.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.PLAYING);
  });

  btnSelectDifferentLevel.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.LEVEL_SELECT);
  });

  btnVictoryRestart.addEventListener('click', () => {
    playButtonSound();
    isCampaignMode = true;
    currentLevelIndex = 0;
    transitionTo(STATES.PLAYING);
  });

  btnVictorySelector.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.LEVEL_SELECT);
  });

  btnRestart.addEventListener('click', () => {
    playButtonSound();
    // Tentar novamente na mesma fase (reinicialização isolada)
    transitionTo(STATES.PLAYING);
  });

  if (btnGameOverMenu) {
    btnGameOverMenu.addEventListener('click', () => {
      playButtonSound();
      transitionTo(STATES.WELCOME);
    });
  }

  // 3. Controles do Rodapé da interface
  btnPause.addEventListener('click', () => {
    playButtonSound();
    togglePause();
  });
  
  btnRestartCurrentOnly.addEventListener('click', () => {
    playButtonSound();
    if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
      transitionTo(STATES.PLAYING);
    }
  });

  if (btnSelectFaseFooter) {
    btnSelectFaseFooter.addEventListener('click', () => {
      playButtonSound();
      transitionTo(STATES.LEVEL_SELECT);
    });
  }

  btnMenu.addEventListener('click', () => {
    playButtonSound();
    transitionTo(STATES.WELCOME);
  });

  // 3.5. Sistema de Alternar Som e ativação segura de áudio
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        btnToggleSound.setAttribute('aria-label', 'Desativar Som');
        btnToggleSound.innerHTML = `
          <svg id="sound-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px var(--color-primary-glow));">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      } else {
        btnToggleSound.setAttribute('aria-label', 'Ativar Som');
        btnToggleSound.innerHTML = `
          <svg id="sound-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.35));">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      }
    });
  }

  // Registra aspas globais de gestos para desbloquear o AudioContext no primeiro input
  const unlockAudio = () => {
    initAudio();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  // 4. Teclado Físico
  window.addEventListener('keydown', handleKeyDown);

  // 5. Teclado Virtual para Mobile (D-Pad)
  setupMobileCtrls();
}

function cleanLoopsAndOverlays() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  resetLoopTiming();
}

function resetLoopTiming(now = performance.now()) {
  lastFrameTime = now;
  logicAccumulator = 0;
}

function startGameLoop() {
  if (animationFrameId) return;

  const now = performance.now();
  resetLoopTiming(now);
  drawLoop(now);
}

function getActiveLogicInterval() {
  const currentInterval = getCurrentMoveInterval();

  if (speedBoostTimer > 0) {
    return Math.max(MIN_SAFE_MOVE_INTERVAL, Math.floor(currentInterval * ENERGY_BOOST_MULTIPLIER));
  }

  return currentInterval;
}

function refreshActiveLevelCache() {
  activeLevel = levels[currentLevelIndex] || levels[0];
  activeTheme = getCurrentTheme(activeLevel);
  snakeGradientCache.key = '';
  snakeGradientCache.colors.length = 0;
}

function getSnakeSegmentColors(headColor, bodyColor, isBoosted) {
  const startColor = isBoosted ? '#06b6d4' : headColor;
  const endColor = isBoosted ? '#0891b2' : bodyColor;
  const cacheKey = `${snake.length}|${startColor}|${endColor}`;

  if (snakeGradientCache.key !== cacheKey) {
    snakeGradientCache.key = cacheKey;
    snakeGradientCache.colors.length = snake.length;

    for (let i = 0; i < snake.length; i++) {
      snakeGradientCache.colors[i] = i === 0
        ? startColor
        : blendColors(startColor, endColor, i / snake.length);
    }
  }

  return snakeGradientCache.colors;
}

// Configura botões direcionais virtuais e eventos de swipe no tabuleiro/canvas
function setupMobileCtrls() {
  // 1. Configura botões direcionais virtuais (D-Pad) com eventos de toque rápida
  const touchConfig = [
    { el: ctrlUp, dir: { x: 0, y: -1 } },
    { el: ctrlDown, dir: { x: 0, y: 1 } },
    { el: ctrlLeft, dir: { x: -1, y: 0 } },
    { el: ctrlRight, dir: { x: 1, y: 0 } }
  ];

  touchConfig.forEach(cfg => {
    if (cfg.el) {
      cfg.el.addEventListener('pointerdown', (e) => {
        if (gameState === STATES.PLAYING) {
          e.preventDefault();
          setDirection(cfg.dir);
        }
      });
    }
  });

  // Impedir scroll ao deslizar sobre o D-Pad ativo
  const dpad = document.getElementById('touch-dpad');
  if (dpad) {
    dpad.addEventListener('touchmove', (e) => {
      if (gameState === STATES.PLAYING) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // 2. Configura controle por gestos de Swipe no tabuleiro/canvas
  let touchStartX = 0;
  let touchStartY = 0;
  const swipeThreshold = 30; // Limite mínimo de deslocamento (30px) para evitar comandos acidentais

  canvas.addEventListener('touchstart', (e) => {
    if (gameState !== STATES.PLAYING) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    // Evita scroll da página ao iniciar o controle por gestos
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (gameState !== STATES.PLAYING) return;
    
    // Evita scroll da página durante o movimento de swipe no canvas
    e.preventDefault();
    
    if (!touchStartX || !touchStartY) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    // Verificamos se atingimos o threshold mínimo exigido
    if (Math.abs(diffX) > swipeThreshold || Math.abs(diffY) > swipeThreshold) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Movimento horizontal predominante
        if (diffX > 0) {
          setDirection({ x: 1, y: 0 }); // Direita
        } else {
          setDirection({ x: -1, y: 0 }); // Esquerda
        }
      } else {
        // Movimento vertical predominante
        if (diffY > 0) {
          setDirection({ x: 0, y: 1 }); // Baixo
        } else {
          setDirection({ x: 0, y: -1 }); // Cima
        }
      }
      
      // Atualiza coordenadas de início para que o jogador possa fazer múltiplos gestos seguidos de forma fluida
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (gameState === STATES.PLAYING) {
      e.preventDefault();
    }
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: false });
}

// --- CONSTRUTOR DINÂMICO DA GRADE DE FASES ---

function buildLevelGrid() {
  const grid = document.getElementById('level-grid');
  grid.innerHTML = ''; // Limpa antes de gerar

  levels.forEach((lvl, idx) => {
    const card = document.createElement('div');
    card.className = `level-card ${currentLevelIndex === idx ? 'active' : ''}`;
    
    // Configura o conteúdo interno dinâmico
    const formattedNum = lvl.id < 10 ? `0${lvl.id}` : lvl.id;
    const wallRule = getWallRule(lvl);
    card.innerHTML = `
      <span class="level-num">${formattedNum}</span>
      <div class="level-info">
        <span class="level-name">${lvl.name}</span>
        <span class="level-theme" style="color: ${getCurrentTheme(lvl).snakeHeadColor || '#10b981'}; opacity: 0.95;">${lvl.theme}</span>
      </div>
      <span class="level-diff ${lvl.difficulty.toLowerCase()}">${lvl.difficulty}</span>
      <span class="wall-rule-tag ${wallRule.className}" title="${wallRule.description}">${wallRule.cardLabel}</span>
    `;

    // Clicar inicia diretamente a fase correspondente no modo isolado (avulso)
    card.addEventListener('click', () => {
      playButtonSound();
      isCampaignMode = false;
      currentLevelIndex = idx;
      transitionTo(STATES.PLAYING);
    });

    grid.appendChild(card);
  });
}

// --- MÁQUINA DE ESTADO DO SNAKE GAME ---

function updateOverlaysVisibility() {
  // Ocultar todos os containers de overlays unificados
  startOverlay.classList.add('hidden');
  levelSelectOverlay.classList.add('hidden');
  levelCompletedOverlay.classList.add('hidden');
  victoryOverlay.classList.add('hidden');
  gameoverOverlay.classList.add('hidden');

  const gameActions = document.getElementById('game-actions');
  const touchDpad = document.getElementById('touch-dpad');
  const appContainer = document.getElementById('app-container');

  if (gameState === STATES.WELCOME) {
    startOverlay.classList.remove('hidden');
    gameStatusBar.classList.add('hidden');
    btnPause.setAttribute('disabled', 'true');
  } else if (gameState === STATES.LEVEL_SELECT) {
    levelSelectOverlay.classList.remove('hidden');
    gameStatusBar.classList.add('hidden');
    btnPause.setAttribute('disabled', 'true');
  } else if (gameState === STATES.LEVEL_COMPLETED) {
    levelCompletedOverlay.classList.remove('hidden');
    btnPause.setAttribute('disabled', 'true');
  } else if (gameState === STATES.GAMEOVER) {
    gameoverOverlay.classList.remove('hidden');
    btnPause.setAttribute('disabled', 'true');
  } else if (gameState === STATES.VICTORY) {
    victoryOverlay.classList.remove('hidden');
    btnPause.setAttribute('disabled', 'true');
  } else if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
    // Ambos jogando e pausado mantêm a barra de status e ocultam overlays
    gameStatusBar.classList.remove('hidden');
  }

  // Lógica de visibilidade condicional de controles conforme nova regra de UX
  if (appContainer) {
    appContainer.classList.remove('state-welcome', 'state-level-select', 'state-level-completed', 'state-gameover', 'state-victory', 'state-playing');
    if (gameState === STATES.WELCOME) {
      appContainer.classList.add('state-welcome');
    } else if (gameState === STATES.LEVEL_SELECT) {
      appContainer.classList.add('state-level-select');
    } else if (gameState === STATES.LEVEL_COMPLETED) {
      appContainer.classList.add('state-level-completed');
    } else if (gameState === STATES.GAMEOVER) {
      appContainer.classList.add('state-gameover');
    } else if (gameState === STATES.VICTORY) {
      appContainer.classList.add('state-victory');
    } else if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
      appContainer.classList.add('state-playing');
    }
  }

  if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
    if (gameActions) gameActions.classList.remove('hidden-by-state');
    if (touchDpad) touchDpad.classList.remove('hidden-by-state');
  } else {
    if (gameActions) gameActions.classList.add('hidden-by-state');
    if (touchDpad) touchDpad.classList.add('hidden-by-state');
  }

  queueMobilePortraitLayoutSync();
}

function transitionTo(newState) {
  if (orientationBlocked) {
    savedStateBeforeBlock = newState;
    return;
  }
  gameState = newState;

  // Sincroniza visibilidade de todos os overlays unificados do jogo
  updateOverlaysVisibility();

  if (newState === STATES.PLAYING) {
    cleanLoopsAndOverlays();
    
    // Inicializa a fase corrente
    loadCurrentLevel();

    // Habilita Botão de Pausa com ícone de Pause padrão
    btnPause.removeAttribute('disabled');
    pauseText.textContent = 'Pausar';
    btnPause.querySelector('svg').innerHTML = '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1" />';

    // Inicia Loop de Frames se estiver desligado
    if (!animationFrameId) {
      startGameLoop();
    }
  } 
  else if (newState === STATES.PAUSED) {
    // Garanta que o botão está habilitado e configurado para continuar
    btnPause.removeAttribute('disabled');
    pauseText.textContent = 'Continuar';
    btnPause.querySelector('svg').innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';

    // Inicia Loop de Frames se estiver desligado para atualizar o canvas estático
    if (!animationFrameId) {
      startGameLoop();
    }
  }
  else if (newState === STATES.LEVEL_SELECT) {
    cleanLoopsAndOverlays();
    campaignCarryOverLength = 0;
    buildLevelGrid();
  }
  else if (newState === STATES.WELCOME) {
    cleanLoopsAndOverlays();
    score = 0;
    campaignCarryOverLength = 0;
    updateScoreDisplay();
  }
  else if (newState === STATES.LEVEL_COMPLETED) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    playLevelCompleteSound();

    // Configura dados da fase finalizada no overlay
    const lvl = levels[currentLevelIndex];
    completedTitle.textContent = `FASE ${lvl.id < 10 ? '0' + lvl.id : lvl.id} CONCLUÍDA!`;
    completedDesc.textContent = `Você completou o "${lvl.name}" (${lvl.theme}) com excelência!`;
    completedScore.textContent = formatNumber(score);

    // Ajusta botão "Próxima Fase"
    if (currentLevelIndex < levels.length - 1) {
      btnNextLevel.style.display = 'flex';
      const nextLvl = levels[currentLevelIndex + 1];
      completedNextTargetLabel.textContent = "Próxima Meta:";
      completedNextTarget.textContent = `${nextLvl.target} Comidas`;
    } else {
      // Se era a fase 20, esconde botão de avançar e muda objetivo
      btnNextLevel.style.display = 'none';
      completedNextTargetLabel.textContent = "Final das Fases:";
      completedNextTarget.textContent = `TP LAB Concluído`;
    }
  } 
  else if (newState === STATES.GAMEOVER) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    playGameOverSound();

    // Atualiza pontuação maior se necessário nesta sessão (sem persistir no localStorage)
    if (score > highScore) {
      highScore = score;
      updateHighScoreDisplay();
    }

    finalScoreEl.textContent = formatNumber(score);
    finalHighScoreEl.textContent = formatNumber(highScore);
  } 
  else if (newState === STATES.VICTORY) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    playVictorySound();

    // Atualiza pontuação maior se necessário nesta sessão (sem persistir no localStorage)
    if (score > highScore) {
      highScore = score;
      updateHighScoreDisplay();
    }

    victoryScore.textContent = formatNumber(score);
    victoryHighScore.textContent = formatNumber(highScore);
  }
}

// Encontra uma posição e direção de spawn seguras para a cobra de determinado comprimento
function findSafeSpawn(lvl, length) {
  const directions = [
    { x: 1, y: 0 },  // Indo para a Direita, corpo cresce para a Esquerda
    { x: -1, y: 0 }, // Indo para a Esquerda, corpo cresce para a Direita
    { x: 0, y: 1 },  // Indo para Baixo, corpo cresce para Cima
    { x: 0, y: -1 }  // Indo para Cima, corpo cresce para Baixo
  ];

  const isBlocked = (cx, cy) => {
    if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) return true;
    return lvl.obstacles && lvl.obstacles.some(o => o.x === cx && o.y === cy);
  };

  // Coleta as posições e ordena pela distância ao centro (10, 10)
  const candidates = [];
  for (let x = 1; x < GRID_SIZE - 1; x++) {
    for (let y = 1; y < GRID_SIZE - 1; y++) {
      candidates.push({ x, y });
    }
  }

  candidates.sort((a, b) => {
    const distA = Math.pow(a.x - 10, 2) + Math.pow(a.y - 10, 2);
    const distB = Math.pow(b.x - 10, 2) + Math.pow(b.y - 10, 2);
    return distA - distB;
  });

  // Prioridade 1: corpo livre + 1 célula livre em frente à cabeça
  for (const cand of candidates) {
    for (const dir of directions) {
      let isPerfect = true;
      if (isBlocked(cand.x + dir.x, cand.y + dir.y)) {
        isPerfect = false;
      }
      if (isPerfect) {
        for (let i = 0; i < length; i++) {
          if (isBlocked(cand.x - i * dir.x, cand.y - i * dir.y)) {
            isPerfect = false;
            break;
          }
        }
      }
      if (isPerfect) {
        return { startX: cand.x, startY: cand.y, dir };
      }
    }
  }

  // Prioridade 2: apenas o corpo livre (sem clearance de frente)
  for (const cand of candidates) {
    for (const dir of directions) {
      let isValid = true;
      for (let i = 0; i < length; i++) {
        if (isBlocked(cand.x - i * dir.x, cand.y - i * dir.y)) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        return { startX: cand.x, startY: cand.y, dir };
      }
    }
  }

  // Fallback seguro
  return { startX: 10, startY: 10, dir: { x: 1, y: 0 } };
}

// Inicializa variáveis baseadas nas configurações da fase ativa
function loadCurrentLevel() {
  refreshActiveLevelCache();
  const lvl = activeLevel;

  // Configuração visual do status bar superior
  modeBadge.textContent = isCampaignMode ? "CAMPANHA" : "AVULSO";
  modeBadge.className = isCampaignMode ? "status-val-highlight" : "status-val-highlight-orange";
  phaseTitle.textContent = `FASE ${lvl.id < 10 ? '0' + lvl.id : lvl.id}: ${lvl.name}`;
  const wallRule = getWallRule(lvl);
  if (wallRuleBadge) {
    wallRuleBadge.textContent = wallRule.hudLabel;
    wallRuleBadge.className = `status-val-highlight wall-rule-hud ${wallRule.className}`;
    wallRuleBadge.title = wallRule.description;
  }
  
  levelFoodsEaten = 0;
  updateTargetProgressDisplay();

  // Determina comprimento inicial da cobra
  let initialLength = lvl.initialLength || 3;
  let spawnConfig = null;

  if (isCampaignMode && currentLevelIndex > 0 && campaignCarryOverLength > 0) {
    // Maior valor entre tamanho mínimo da fase e tamanho carry-over limitado ao teto seguro (ex: 8)
    const MAX_SAFE_CARRY_OVER = 8;
    const preferredLength = Math.max(initialLength, Math.min(campaignCarryOverLength, MAX_SAFE_CARRY_OVER));

    // Procura local seguro para o tamanho ideal, se não der decresce até o tamanho padrão do nível
    let testLength = preferredLength;
    while (testLength >= initialLength) {
      const config = findSafeSpawn(lvl, testLength);
      const isFallback = (config.startX === 10 && config.startY === 10 && config.dir.x === 1 && config.dir.y === 0);
      const centerBlocked = lvl.obstacles && lvl.obstacles.some(o => o.x === 10 && o.y === 10);
      
      if (config && (!isFallback || !centerBlocked || testLength === initialLength)) {
        spawnConfig = config;
        initialLength = testLength;
        break;
      }
      testLength--;
    }
  }

  if (!spawnConfig) {
    spawnConfig = findSafeSpawn(lvl, initialLength);
  }

  // Cria a cobra com o tamanho adequado na direção encontrada
  snake = [];
  const dir = spawnConfig.dir;
  for (let i = 0; i < initialLength; i++) {
    snake.push({ x: spawnConfig.startX - i * dir.x, y: spawnConfig.startY - i * dir.y });
  }

  direction = { x: dir.x, y: dir.y };
  nextDirection = { x: dir.x, y: dir.y };

  baseGameSpeed = getLevelBaseSpeed(lvl);
  speedBoostTimer = 0;
  reductionSplashTimer = 0;

  particles = [];
  
  // No início da campanha (Nível 1), o score acumulado inicia em 0
  if (isCampaignMode && currentLevelIndex === 0) {
    score = 0;
  } else if (!isCampaignMode) {
    // No modo avulso, o score reinicia sempre para a fase corrente
    score = 0;
  }
  // Se for continuação do Modo Campanha nas fases 2 a 20, mantemos o score acumulado!

  updateScoreDisplay();
  spawnFood();
}

function advanceToNextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex++;
    // Se estivesse colhido de forma avulsa, ao avançar torna-se parte de progressão
    transitionTo(STATES.PLAYING);
  } else {
    // Alcançou o final da fase 20
    transitionTo(STATES.VICTORY);
  }
}

function togglePause() {
  if (gameState === STATES.PLAYING) {
    gameState = STATES.PAUSED;
    resetLoopTiming();
    pauseText.textContent = 'Continuar';
    btnPause.querySelector('svg').innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';
  } else if (gameState === STATES.PAUSED) {
    gameState = STATES.PLAYING;
    resetLoopTiming();
    pauseText.textContent = 'Pausar';
    btnPause.querySelector('svg').innerHTML = '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1" />';
  }
}

// --- DIREÇÃO E CONTROLES DE MOVIMENTO ---

function setDirection(newDir) {
  if (orientationBlocked) return;
  if (gameState !== STATES.PLAYING) return;

  // Barra o inverso imediato da direção ativa de caminhada para evitar autocolisão por input
  const isOppositeX = (newDir.x !== 0 && direction.x === -newDir.x);
  const isOppositeY = (newDir.y !== 0 && direction.y === -newDir.y);

  if (!isOppositeX && !isOppositeY) {
    nextDirection = newDir;
  }
}

function handleKeyDown(e) {
  if (orientationBlocked) return;
  const key = e.key;

  if (key === 'ArrowUp' || key === 'w' || key === 'W') {
    if (gameState === STATES.PLAYING) e.preventDefault();
    setDirection({ x: 0, y: -1 });
  } 
  else if (key === 'ArrowDown' || key === 's' || key === 'S') {
    if (gameState === STATES.PLAYING) e.preventDefault();
    setDirection({ x: 0, y: 1 });
  } 
  else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
    if (gameState === STATES.PLAYING) e.preventDefault();
    setDirection({ x: -1, y: 0 });
  } 
  else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
    if (gameState === STATES.PLAYING) e.preventDefault();
    setDirection({ x: 1, y: 0 });
  }
  else if (key === ' ' || key === 'Spacebar') {
    if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
      e.preventDefault();
      togglePause();
    }
  }
}

// --- MECÂNICA DE COMIDAS E SPAWN INTELIGENTE ---

function spawnFood() {
  const lvl = activeLevel;
  
  // Decide o tipo de comida baseado na fase config
  // As fases com múltiplas comidas permitidas habilitam types dinâmicos
  if (lvl.allowedFoods && lvl.allowedFoods.length > 1) {
    const roll = Math.random();
    if (roll < 0.55) {
      foodType = 'normal';
    } else if (roll < 0.72 && lvl.allowedFoods.includes('golden')) {
      foodType = 'golden'; // Bônus triplo de pontos
    } else if (roll < 0.86 && lvl.allowedFoods.includes('energy')) {
      foodType = 'energy'; // Momentum acelerado temporariamente
    } else if (lvl.allowedFoods.includes('reduction')) {
      foodType = 'reduction'; // Reduz tamanho estesticamente
    } else {
      foodType = 'normal';
    }
  } else {
    // Demais fases usam comidas puras normais
    foodType = 'normal';
  }

  let isPositionTaken;
  let newFood;

  // Garante que o spawn nunca coincida com a cobra ou obstáculos fixos
  do {
    isPositionTaken = false;
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    // 1. Verifica corpo da cobra
    for (const segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        isPositionTaken = true;
        break;
      }
    }

    // 2. Verifica obstáculos da fase atual
    if (!isPositionTaken && lvl.obstacles) {
      for (const obs of lvl.obstacles) {
        if (obs.x === newFood.x && obs.y === newFood.y) {
          isPositionTaken = true;
          break;
        }
      }
    }
  } while (isPositionTaken);

  food = newFood;
}

// --- LOOP DE LÓGICA DO JOGO ---

function gameLogicStep() {
  const lvl = activeLevel;

  // Consome próxima direção
  direction = nextDirection;

  // Avanço da cabeça calculada
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  // 1. Colisão ou Transposição das Paredes do Tabuleiro
  const wallRule = getWallRule(lvl);
  const isOutX = newHead.x < 0 || newHead.x >= GRID_SIZE;
  const isOutY = newHead.y < 0 || newHead.y >= GRID_SIZE;

  if (isOutX || isOutY) {
    if (isOutX && wallRule.wrapsX) {
      newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
    } else if (isOutX) {
      transitionTo(STATES.GAMEOVER);
      return;
    }

    if (isOutY && wallRule.wrapsY) {
      newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
    } else if (isOutY) {
      transitionTo(STATES.GAMEOVER);
      return;
    }
  }

  // 2. Colisão com Obstáculos Fixos da Fase Ativa
  if (lvl.obstacles) {
    for (const obs of lvl.obstacles) {
      if (obs.x === newHead.x && obs.y === newHead.y) {
        transitionTo(STATES.GAMEOVER);
        return;
      }
    }
  }

  // 3. Colisão com o Próprio Corpo
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
      transitionTo(STATES.GAMEOVER);
      return;
    }
  }

  // Insere nova cabeça no vetor
  snake.unshift(newHead);

  // 4. Consumo da Comida Especial / Normal
  if (newHead.x === food.x && newHead.y === food.y) {
    // Processamento de pontos e colheita
    levelFoodsEaten++;
    updateTargetProgressDisplay();

    // Executa e aplica os efeitos das comidas especiais
    playEatSound(foodType);
    applyFoodEffect();

    // Cria faíscas coloridas correspondentes ao tipo de comida colhido
    createExplosion(
      food.x * CELL_SIZE + CELL_SIZE / 2, 
      food.y * CELL_SIZE + CELL_SIZE / 2,
      getFoodColorHex()
    );

    triggerScoreWobble();

    // Verifica se completou o objetivo de energia para avançar de fase
    if (levelFoodsEaten >= lvl.target) {
      if (isCampaignMode && currentLevelIndex === levels.length - 1) {
        // Encerrou a campanha (Fase 20)
        transitionTo(STATES.VICTORY);
      } else {
        // Concluiu fase regular
        if (isCampaignMode) {
          campaignCarryOverLength = snake.length;
        }
        transitionTo(STATES.LEVEL_COMPLETED);
      }
      return;
    }

    spawnFood();
  } else {
    // Se não consumiu alimento neste loop, deleta o rabo para simular caminhada
    snake.pop();
  }

  // Redução do Buff de Energia após tick se estiver ativo
  if (speedBoostTimer > 0) {
    speedBoostTimer--;
  }
}

// Aplicação de regras específicas para tipos de comida
function applyFoodEffect() {
  if (foodType === 'normal') {
    score += 10;
  } 
  else if (foodType === 'golden') {
    score += 30; // Pontuação Tripla
  } 
  else if (foodType === 'energy') {
    score += 20;
    speedBoostTimer = 35; // Ativa velocidade por ~35 updates físicos
  } 
  else if (foodType === 'reduction') {
    score += 10;
    reductionSplashTimer = 10; // Esteticamente gera flashes roxos
    
    // Reduz comprimento do rabo do corpo se possuir mais peças do que o tamanho padrão (3)
    const targetLength = 3;
    if (snake.length > targetLength) {
      const shrinkCount = Math.min(2, snake.length - targetLength);
      for (let i = 0; i < shrinkCount; i++) {
        snake.pop();
      }
    }
  }
  updateScoreDisplay();
}

function getFoodColorHex() {
  switch (foodType) {
    case 'golden': return '#fbbf24';
    case 'energy': return '#06b6d4';
    case 'reduction': return '#a855f7';
    default: return '#f43f5e';
  }
}

// --- PARTÍCULAS E MICRO-ANIMAÇÕES ---

function createExplosion(x, y, colorStr) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 3.2;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1.0,
      radius: 1.2 + Math.random() * 2.2,
      decay: 0.02 + Math.random() * 0.02,
      color: colorStr
    });
  }
}

function updateParticles() {
  let writeIndex = 0;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    if (p.alpha > 0) {
      particles[writeIndex] = p;
      writeIndex++;
    }
  }

  particles.length = writeIndex;
}

function triggerScoreWobble() {
  currentScoreEl.classList.add('changed');

  if (scoreWobbleTimeoutId) {
    clearTimeout(scoreWobbleTimeoutId);
  }

  scoreWobbleTimeoutId = setTimeout(() => {
    currentScoreEl.classList.remove('changed');
    scoreWobbleTimeoutId = null;
  }, 180);
}

// --- RENDENIZAÇÃO NO GRAPHICS CANVAS ---

function drawLoop(currentTime) {
  if (orientationBlocked) {
    animationFrameId = null;
    resetLoopTiming(currentTime);
    return;
  }
  if (gameState !== STATES.PLAYING && gameState !== STATES.PAUSED) {
    animationFrameId = null;
    resetLoopTiming(currentTime);
    return;
  }

  animationFrameId = requestAnimationFrame(drawLoop);

  if (gameState === STATES.PLAYING) {
    const frameDelta = Math.min(Math.max(currentTime - lastFrameTime, 0), MAX_FRAME_DELTA);
    logicAccumulator += frameDelta;

    let stepsThisFrame = 0;
    let activeInterval = getActiveLogicInterval();

    while (
      logicAccumulator >= activeInterval &&
      stepsThisFrame < MAX_LOGIC_STEPS_PER_FRAME &&
      gameState === STATES.PLAYING
    ) {
      gameLogicStep();
      logicAccumulator -= activeInterval;
      stepsThisFrame++;
      activeInterval = getActiveLogicInterval();
    }

    if (stepsThisFrame === MAX_LOGIC_STEPS_PER_FRAME && logicAccumulator >= activeInterval) {
      logicAccumulator = activeInterval;
    }
  } else {
    logicAccumulator = 0;
  }

  lastFrameTime = currentTime;

  updateParticles();
  renderCanvas();
}

function renderCanvas() {
  // 1. Desenha o fundo discreto baseado no tema ativo
  drawBoardBackground();

  // 2. Desenha a grade virtual discreta de navegação
  drawGrid();
  drawBoardEdges();

  if (gameState === STATES.PLAYING || gameState === STATES.PAUSED) {
    // 3. Desenha obstáculos estáticos da fase se houver
    drawObstacles();

    // 4. Desenha a comida ativa pulsando suavemente
    drawFood();

    // 5. Desenha a cobrinha com gradientes de preenchimento
    drawSnake();

    // 6. Desenha efeitos de partículas para ações/alimentações
    drawParticles();
  }
}

/**
 * Desenha o fundo do tabuleiro de jogo utilizando uma cor sólida ou gradientes por tema.
 */
function drawBoardBackground() {
  const theme = activeTheme;
  ctx.fillStyle = theme.backgroundColor || '#090d16';
  ctx.fillRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);
}

/**
 * Desenha a grade virtual do tabuleiro para auxiliar a visibilidade e controle espacial.
 */
function drawGrid() {
  const theme = activeTheme;
  ctx.save();
  ctx.strokeStyle = theme.gridColor || '#10b981';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  
  for (let i = 0; i <= GRID_SIZE; i++) {
    const coord = i * CELL_SIZE;

    ctx.moveTo(coord, 0);
    ctx.lineTo(coord, LOGICAL_SIZE);
    ctx.globalAlpha = 0.08; // Transparência refinada para o grid discreto
    ctx.moveTo(0, coord);
    ctx.lineTo(LOGICAL_SIZE, coord);
  }

  ctx.stroke();
  ctx.restore();
}

// Desenha a dica visual das bordas: solida quando mata, tracejada quando atravessa.
function drawBoardEdges() {
  const wallRule = getWallRule(activeLevel);
  const theme = activeTheme;
  const portalColor = theme.snakeHeadColor || '#10b981';
  const dangerColor = theme.obstacleColor || '#f43f5e';

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;

  drawBoardEdge('top', wallRule.wrapsY, portalColor, dangerColor);
  drawBoardEdge('right', wallRule.wrapsX, portalColor, dangerColor);
  drawBoardEdge('bottom', wallRule.wrapsY, portalColor, dangerColor);
  drawBoardEdge('left', wallRule.wrapsX, portalColor, dangerColor);

  ctx.restore();
}

function drawBoardEdge(side, isPortal, portalColor, dangerColor) {
  const inset = 2;
  const max = LOGICAL_SIZE - inset;
  const color = isPortal ? portalColor : dangerColor;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = isPortal ? 9 : 5;
  ctx.globalAlpha = isPortal ? 0.85 : 0.55;
  ctx.setLineDash(isPortal ? [8, 8] : []);

  ctx.beginPath();
  if (side === 'top') {
    ctx.moveTo(inset, inset);
    ctx.lineTo(max, inset);
  } else if (side === 'right') {
    ctx.moveTo(max, inset);
    ctx.lineTo(max, max);
  } else if (side === 'bottom') {
    ctx.moveTo(max, max);
    ctx.lineTo(inset, max);
  } else {
    ctx.moveTo(inset, max);
    ctx.lineTo(inset, inset);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Desenha todos os blocos de obstaculos cadastrados na fase atual.
 */
function drawObstacles() {
  const lvl = activeLevel;
  if (!lvl || !lvl.obstacles) return;

  const theme = activeTheme;
  const color = theme.obstacleColor || '#f59e0b';

  lvl.obstacles.forEach(obs => {
    const x = obs.x * CELL_SIZE;
    const y = obs.y * CELL_SIZE;
    const pad = 1.5;

    ctx.save();
    
    // Efeito brilhante de aviso do tema
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'; // Preenchimento robusto escuro
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    drawRoundedRect(x + pad, y + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, 4);
    ctx.fill();
    ctx.stroke();

    // Desenha marcas transversais em X
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 5);
    ctx.lineTo(x + CELL_SIZE - 5, y + CELL_SIZE - 5);
    ctx.moveTo(x + CELL_SIZE - 5, y + 5);
    ctx.lineTo(x + 5, y + CELL_SIZE - 5);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    ctx.stroke();

    ctx.restore();
  });
}

/**
 * Desenha a iguaria ativa que a cobra deve consumir, pulsando ciclicamente.
 */
function drawFood() {
  const theme = activeTheme;
  foodPulseAngle += 0.08;
  const pulse = 1 + Math.sin(foodPulseAngle) * 0.12;
  const radius = (CELL_SIZE / 2.22) * pulse;

  const cx = food.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = food.y * CELL_SIZE + CELL_SIZE / 2;

  // Seleção inteligente de cor de comida baseada no tipo ativo e configurações do tema
  let foodColor = theme.foodColor || '#f43f5e';
  let centerColor = '#ffffff';

  if (foodType === 'golden') {
    foodColor = theme.goldenFoodColor || '#fbbf24'; // Ouro cintilante
    centerColor = '#fef08a';
  } else if (foodType === 'energy') {
    foodColor = theme.energyFoodColor || '#06b6d4'; // Ciano energético
    centerColor = '#67e8f9';
  } else if (foodType === 'reduction') {
    foodColor = theme.shrinkFoodColor || '#a855f7'; // Roxo compactador
    centerColor = '#d8b4fe';
  } else {
    // Normal usa foodColor por padrão ou normalFoodColor se especificado
    foodColor = theme.normalFoodColor || theme.foodColor || '#f43f5e';
  }

  ctx.save();
  ctx.shadowColor = foodColor;
  ctx.shadowBlur = 12;

  ctx.fillStyle = foodColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(cx - radius * 0.2, cy - radius * 0.2, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Renderiza todos os segmentos da cobra com gradientes neon, olhos direcionados e efeitos de buffet.
 */
function drawSnake() {
  const theme = activeTheme;
  ctx.save();
  ctx.globalAlpha = 1.0; // Solidez total contra fundo escuro

  const headColor = theme.snakeHeadColor || '#10b981';
  const bodyColor = theme.snakeBodyColor || '#059669';
  const segmentColors = getSnakeSegmentColors(headColor, bodyColor, speedBoostTimer > 0);
  const useReductionFlash = reductionSplashTimer > 0 && Math.floor(reductionSplashTimer) % 2 === 0;

  for (let index = 0; index < snake.length; index++) {
    const segment = snake[index];
    const isHead = index === 0;
    const x = segment.x * CELL_SIZE;
    const y = segment.y * CELL_SIZE;

    const segmentColor = useReductionFlash ? '#a855f7' : segmentColors[index];

    if (false) {
      // Cria um gradiente suave da cabeça à cauda usando nosso misturador de cores
    }

    // Adaptador de cor dinâmico caso receba buffs ativos
    if (false && speedBoostTimer > 0) {
      // Brilho especial de hipermomentum
      if (isHead) {
        segmentColor = '#06b6d4';
      } else {
        const ratio = index / snake.length;
        segmentColor = blendColors('#06b6d4', '#0891b2', ratio);
      }
    } else if (false && reductionSplashTimer > 0 && Math.floor(reductionSplashTimer) % 2 === 0) {
      // Flashing de encolhimento
      segmentColor = '#a855f7';
    }

    ctx.save();
    
    // Propaga o glow baseado no theme.snakeGlowColor ou cor de segmento correspondente
    ctx.shadowColor = theme.snakeGlowColor || segmentColor;
    ctx.shadowBlur = isHead ? 10 : 4;

    ctx.fillStyle = segmentColor;
    const pad = 1.0; // Margem milimétrica para segmentos robustos
    const radius = isHead ? 6 : 4;
    
    drawRoundedRect(
      x + pad, 
      y + pad, 
      CELL_SIZE - pad * 2, 
      CELL_SIZE - pad * 2, 
      radius
    );
    ctx.fill();

    // Desenha olhos para a expressividade da cobra
    if (isHead) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#07090e';

      const eyeOffset = CELL_SIZE * 0.25;
      const eyeSize = 3;
      let eye1 = { x: 0, y: 0 }, eye2 = { x: 0, y: 0 };

      if (direction.x !== 0) {
        const lx = x + (direction.x > 0 ? CELL_SIZE - eyeOffset : eyeOffset);
        eye1 = { x: lx, y: y + eyeOffset };
        eye2 = { x: lx, y: y + CELL_SIZE - eyeOffset };
      } else {
        const ly = y + (direction.y > 0 ? CELL_SIZE - eyeOffset : eyeOffset);
        eye1 = { x: x + eyeOffset, y: ly };
        eye2 = { x: x + CELL_SIZE - eyeOffset, y: ly };
      }

      ctx.beginPath();
      ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
      ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // Ponto de brilho de alta fidelidade
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eye1.x - 0.5, eye1.y - 0.5, 0.8, 0, Math.PI * 2);
      ctx.arc(eye2.x - 0.5, eye2.y - 0.5, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.restore();

  if (reductionSplashTimer > 0) {
    reductionSplashTimer -= 0.1;
  }
}

/**
 * Desenha as partículas brilhantes dispersas no Canvas.
 */
function drawParticles() {
  if (particles.length === 0) return;

  ctx.save();
  ctx.shadowBlur = 6;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Utilitário para misturar duas cores Hexadecimais no formato #RRGGBB
function blendColors(c1, c2, ratio) {
  if (!c1.startsWith('#')) return c1;
  if (!c2.startsWith('#')) return c2;
  
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);

  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);

  const r = Math.floor(r1 + (r2 - r1) * ratio);
  const g = Math.floor(g1 + (g2 - g1) * ratio);
  const b = Math.floor(b1 + (b2 - b1) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

function drawRoundedRect(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// --- UTILS DE SUPORTES DE APRESENTAÇÃO ---

function updateScoreDisplay() {
  currentScoreEl.textContent = formatNumber(score);
}

function updateHighScoreDisplay() {
  highScoreEl.textContent = formatNumber(highScore);
}

function updateTargetProgressDisplay() {
  const currentTargetValue = activeLevel.target;
  targetProgress.textContent = `${levelFoodsEaten} / ${currentTargetValue}`;
}

function formatNumber(num) {
  if (num < 10) return `00${num}`;
  if (num < 100) return `0${num}`;
  return `${num}`;
}

// --- CONTROLE DE ORIENTAÇÃO PARA DISPOSITIVOS MÓVEIS ---

function checkOrientation() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(any-pointer: coarse)').matches;
  const isLandscape = window.innerWidth > window.innerHeight;

  // Bloqueamos apenas em aparelhos touch de até 1366px de largura (mobile, tablets e iPads no modo horizontal)
  const shouldBlock = isTouchDevice && isLandscape;

  if (shouldBlock && !orientationBlocked) {
    // Salva o estado atual antes de bloquear para poder retornar ao mesmo ponto
    savedStateBeforeBlock = gameState;
    orientationBlocked = true;

    // Se o jogo estivesse ativamente rolando, pausa de forma amigável
    if (gameState === STATES.PLAYING) {
      gameState = STATES.PAUSED;
      pauseText.textContent = 'Continuar';
      btnPause.querySelector('svg').innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';
    }

    // Mostra o overlay de bloqueio
    const blocker = document.getElementById('orientation-blocker');
    if (blocker) {
      blocker.classList.remove('hidden');
    }

    // Oculta componentes de gameplay
    const gameActions = document.getElementById('game-actions');
    const touchDpad = document.getElementById('touch-dpad');
    if (gameActions) gameActions.classList.add('hidden-by-state');
    if (touchDpad) touchDpad.classList.add('hidden-by-state');

    // Cancela loops e animações ativos
    cleanLoopsAndOverlays();
  } else if (!shouldBlock && orientationBlocked) {
    orientationBlocked = false;

    // Remove o overlay de bloqueio
    const blocker = document.getElementById('orientation-blocker');
    if (blocker) {
      blocker.classList.add('hidden');
    }

    // Retorna ao estado anterior com total segurança. Se estava no meio da partida,
    // retorna pausado para evitar que o jogador colida imediatamente ao girar.
    if (savedStateBeforeBlock === STATES.PLAYING) {
      transitionTo(STATES.PAUSED);
    } else if (savedStateBeforeBlock) {
      transitionTo(savedStateBeforeBlock);
    } else {
      transitionTo(STATES.WELCOME);
    }
    savedStateBeforeBlock = null;
  }
}

// --- ARRANQUE GERAL ---
document.addEventListener('DOMContentLoaded', () => {
  loadHighScore();
  setupEventHandlers();
  const handleViewportChange = () => {
    checkOrientation();
    queueMobilePortraitLayoutSync();
  };
  
  // Registra eventos de redimensionamento e rotação
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', queueMobilePortraitLayoutSync);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(queueMobilePortraitLayoutSync);
  }
  
  checkOrientation(); // Checagem inicial
  queueMobilePortraitLayoutSync();
  
  transitionTo(STATES.WELCOME);
  renderCanvas();
});
