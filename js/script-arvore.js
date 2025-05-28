const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

// Controles
const angleSlider = document.getElementById("angleSlider");
const depthSlider = document.getElementById("depthSlider");
const lengthFactorSlider = document.getElementById("lengthFactorSlider");
const lineWidthSlider = document.getElementById("lineWidthSlider");
const branchColorPicker = document.getElementById("branchColorPicker");
const leafColorPicker = document.getElementById("leafColorPicker");
const generateButton = document.getElementById("generateButton");

// Exibição dos valores dos sliders
const angleValueSpan = document.getElementById("angleValue");
const depthValueSpan = document.getElementById("depthValue");
const lengthFactorValueSpan = document.getElementById("lengthFactorValue");
const lineWidthValueSpan = document.getElementById("lineWidthValue");

let currentAngle = parseFloat(angleSlider.value);
let maxDepth = parseInt(depthSlider.value);
let currentLengthFactor = parseFloat(lengthFactorSlider.value);
let initialLineWidth = parseInt(lineWidthSlider.value);
let branchColor = branchColorPicker.value;
let leafColor = leafColorPicker.value;

function updateSliderValue(slider, span) {
  span.textContent = slider.value;
}

angleSlider.oninput = () => {
  currentAngle = parseFloat(angleSlider.value);
  updateSliderValue(angleSlider, angleValueSpan);
  drawFractalTree();
};
depthSlider.oninput = () => {
  maxDepth = parseInt(depthSlider.value);
  updateSliderValue(depthSlider, depthValueSpan);
  drawFractalTree();
};
lengthFactorSlider.oninput = () => {
  currentLengthFactor = parseFloat(lengthFactorSlider.value);
  updateSliderValue(lengthFactorSlider, lengthFactorValueSpan);
  drawFractalTree();
};
lineWidthSlider.oninput = () => {
  initialLineWidth = parseInt(lineWidthSlider.value);
  updateSliderValue(lineWidthSlider, lineWidthValueSpan);
  drawFractalTree();
};
branchColorPicker.oninput = () => {
  branchColor = branchColorPicker.value;
  drawFractalTree();
};
leafColorPicker.oninput = () => {
  leafColor = leafColorPicker.value;
  drawFractalTree();
};
generateButton.onclick = drawFractalTree;

function setCanvasSize() {
  const aspectRatio = 16 / 10; // Proporção para a árvore
  const padding = 40; // Espaçamento das bordas da janela
  const availableWidth = window.innerWidth - padding;
  const availableHeight =
    window.innerHeight -
    document.getElementById("controlsContainer").offsetHeight -
    padding -
    50; // 50px para margem extra

  let canvasWidth = Math.min(availableWidth, availableHeight * aspectRatio);
  let canvasHeight = canvasWidth / aspectRatio;

  if (canvasHeight > availableHeight) {
    canvasHeight = availableHeight;
    canvasWidth = canvasHeight * aspectRatio;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

/**
 * Desenha um galho da árvore fractal.
 * @param {number} x1 - Coordenada X inicial do galho.
 * @param {number} y1 - Coordenada Y inicial do galho.
 * @param {number} length - Comprimento do galho.
 * @param {number} angle - Ângulo do galho em radianos.
 * @param {number} depth - Profundidade atual da recursão.
 * @param {number} lineWidth - Largura da linha para o galho.
 */
function drawBranch(x1, y1, length, angle, depth, lineWidth) {
  if (depth > maxDepth || length < 1) {
    // Desenhar uma "folha" no final de galhos finos e profundos
    if (depth > maxDepth / 1.5 && length < 10 && length > 0.5) {
      ctx.beginPath();
      ctx.arc(x1, y1, Math.random() * 2 + 2, 0, Math.PI * 2); // Círculo pequeno como folha
      ctx.fillStyle = leafColor;
      ctx.fill();
    }
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);

  // Calcular o ponto final do galho
  // Adiciona uma pequena variação aleatória ao ângulo e comprimento para um aspeto mais natural
  const randomAngleFactor = (Math.random() - 0.5) * 0.1; // Pequena variação no ângulo
  const randomLengthFactor = 1 + (Math.random() - 0.5) * 0.1; // Pequena variação no comprimento

  const x2 =
    x1 + Math.cos(angle + randomAngleFactor) * length * randomLengthFactor;
  const y2 =
    y1 + Math.sin(angle + randomAngleFactor) * length * randomLengthFactor;

  ctx.lineTo(x2, y2);
  ctx.strokeStyle = branchColor;
  ctx.lineWidth = Math.max(
    0.5,
    lineWidth * ((maxDepth - depth + 1) / maxDepth)
  ); // Galhos mais finos à medida que se afastam
  ctx.stroke();

  // Ângulo em graus para os novos galhos
  const branchAngleDeg = currentAngle + (Math.random() - 0.5) * 10; // Variação no ângulo de ramificação

  // Ramificação à esquerda
  drawBranch(
    x2,
    y2,
    length * currentLengthFactor,
    angle - (branchAngleDeg * Math.PI) / 180,
    depth + 1,
    lineWidth * 0.7
  );
  // Ramificação à direita
  drawBranch(
    x2,
    y2,
    length * currentLengthFactor,
    angle + (branchAngleDeg * Math.PI) / 180,
    depth + 1,
    lineWidth * 0.7
  );

  // Opcional: um galho central mais curto para algumas árvores
  if (Math.random() < 0.2 && depth < maxDepth / 1.5) {
    // Menos provável e não nos galhos mais externos
    drawBranch(
      x2,
      y2,
      length * currentLengthFactor * 0.7,
      angle + (Math.random() - 0.5) * 0.1,
      depth + 1,
      lineWidth * 0.6
    );
  }
}

/**
 * Limpa o canvas e desenha a árvore fractal completa.
 */
function drawFractalTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  // Ponto inicial da árvore (base do tronco, no centro inferior do canvas)
  const startX = canvas.width / 2;
  const startY = canvas.height;
  const initialLength = canvas.height / (maxDepth > 7 ? 4.5 : 3.5); // Comprimento inicial do tronco

  // Desenha o primeiro galho (tronco)
  // O ângulo -Math.PI / 2 faz a árvore crescer para cima
  drawBranch(startX, startY, initialLength, -Math.PI / 2, 1, initialLineWidth);
  updateSliderValuesDisplay();
}

function updateSliderValuesDisplay() {
  angleValueSpan.textContent = angleSlider.value;
  depthValueSpan.textContent = depthSlider.value;
  lengthFactorValueSpan.textContent = lengthFactorSlider.value;
  lineWidthValueSpan.textContent = lineWidthSlider.value;
}

// Ajustar o tamanho do canvas e desenhar a árvore quando a janela é redimensionada
window.addEventListener("resize", () => {
  setCanvasSize();
  drawFractalTree();
});

// Configuração inicial
setCanvasSize();
drawFractalTree();
updateSliderValuesDisplay();