const canvas = document.getElementById("mandelbrotCanvas");
const ctx = canvas.getContext("2d");

// Controles
const iterationsSlider = document.getElementById("iterationsSlider");
const iterationsValueSpan = document.getElementById("iterationsValue");
const zoomInput = document.getElementById("zoomInput");
const zoomValueSpan = document.getElementById("zoomValue");
const colorSchemeSelect = document.getElementById("colorSchemeSelect");
const renderButton = document.getElementById("renderButton");
const resetButton = document.getElementById("resetButton");
const loadingIndicator = document.getElementById("loadingIndicator");

let maxIterations = parseInt(iterationsSlider.value);
let currentZoom = parseFloat(zoomInput.value);
let centerX = -0.5;
let centerY = 0;
let colorScheme = colorSchemeSelect.value;

const initialCenterX = -0.5;
const initialCenterY = 0;
const initialZoom = 1.0;

function updateControlsDisplay() {
  iterationsValueSpan.textContent = iterationsSlider.value;
  zoomInput.value = currentZoom.toFixed(4); // Mostrar mais precisão no input
  zoomValueSpan.textContent = currentZoom.toFixed(2);
}

iterationsSlider.oninput = () => {
  maxIterations = parseInt(iterationsSlider.value);
  updateControlsDisplay();
  // Não renderiza automaticamente no slider para evitar sobrecarga, usar botão
};
zoomInput.onchange = () => {
  // Usar onchange para evitar renderização a cada dígito
  let newZoom = parseFloat(zoomInput.value);
  if (!isNaN(newZoom) && newZoom > 0) {
    currentZoom = newZoom;
  }
  updateControlsDisplay();
};

colorSchemeSelect.onchange = () => {
  colorScheme = colorSchemeSelect.value;
  // Renderizar com novo esquema de cores
  drawMandelbrot();
};

renderButton.onclick = () => {
  drawMandelbrot();
};

resetButton.onclick = () => {
  currentZoom = initialZoom;
  centerX = initialCenterX;
  centerY = initialCenterY;
  updateControlsDisplay();
  drawMandelbrot();
};

function setCanvasSize() {
  const padding = 20;
  const controlsHeight =
    document.getElementById("controlsContainer").offsetHeight + 40; // 40 para margem do loading
  const availableWidth = window.innerWidth - padding * 2;
  const availableHeight = window.innerHeight - controlsHeight - padding * 2;

  const size = Math.min(availableWidth, availableHeight, 700); // Limitar tamanho máximo
  canvas.width = size;
  canvas.height = size;
}

// Função de coloração
function getColor(n, maxIter, scheme) {
  if (n === maxIter) return "#000000"; // Preto para pontos dentro do conjunto

  const t = n / maxIter; // Normalizado

  switch (scheme) {
    case "smooth":
      // Esquema de cores suave (baseado em https://iquilezles.org/articles/mandelcolors/)
      const r_s = 9 * (1 - t) * t * t * t * 255;
      const g_s = 15 * (1 - t) * (1 - t) * t * t * 255;
      const b_s = 8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255;
      return `rgb(${Math.floor(r_s)}, ${Math.floor(g_s)}, ${Math.floor(b_s)})`;
    case "ultra":
      // Esquema "Ultra" - cores vibrantes
      const r_u = Math.floor(255 * Math.pow(t, 0.25));
      const g_u = Math.floor(255 * Math.pow(t, 0.5));
      const b_u = Math.floor(255 * Math.pow(t, 0.75));
      return `rgb(${r_u},${g_u},${b_u})`;
    case "psych":
      // Esquema psicadélico
      const r_p = Math.floor(128 + 127 * Math.sin(n * 0.1));
      const g_p = Math.floor(128 + 127 * Math.cos(n * 0.05));
      const b_p = Math.floor(128 + 127 * Math.sin(n * 0.02));
      return `rgb(${r_p},${g_p},${b_p})`;
    case "default":
    default:
      // Escala de cinza simples
      const gray = Math.floor(255 * Math.sqrt(t)); // Raiz quadrada para melhor distribuição
      return `rgb(${gray},${gray},${gray})`;
  }
}

async function drawMandelbrot() {
  loadingIndicator.style.display = "block";
  renderButton.disabled = true;
  resetButton.disabled = true;

  // Adiar a renderização para permitir que o DOM atualize o indicador de loading
  await new Promise((resolve) => setTimeout(resolve, 50));

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  // Mapeamento de coordenadas do canvas para o plano complexo
  // A largura do conjunto de Mandelbrot é aproximadamente 3.5 (-2.5 a 1)
  // A altura é aproximadamente 2 (-1 a 1)
  // Ajustar rangeX e rangeY com base no zoom
  const rangeX = 3.5 / currentZoom;
  const rangeY = 2.0 / currentZoom;

  const minReal = centerX - rangeX / 2;
  const maxReal = centerX + rangeX / 2;
  const minImag = centerY - rangeY / 2;
  const maxImag = centerY + rangeY / 2;

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      // Converter pixel (x,y) para coordenadas no plano complexo (c_real, c_imag)
      const c_real = minReal + (x / canvas.width) * (maxReal - minReal);
      const c_imag = minImag + (y / canvas.height) * (maxImag - minImag);

      let z_real = 0;
      let z_imag = 0;
      let n = 0; // Número de iterações

      while (n < maxIterations) {
        const z_real_sq = z_real * z_real;
        const z_imag_sq = z_imag * z_imag;

        if (z_real_sq + z_imag_sq > 4) {
          // Se |z|^2 > 4, o ponto escapa
          break;
        }

        // z_new = z^2 + c
        // z_new_imag = 2 * z_real * z_imag + c_imag
        // z_new_real = z_real^2 - z_imag^2 + c_real
        const next_z_imag = 2 * z_real * z_imag + c_imag;
        z_real = z_real_sq - z_imag_sq + c_real;
        z_imag = next_z_imag;
        n++;
      }

      const color = getColor(n, maxIterations, colorScheme);
      const r =
        parseInt(color.substring(1, 3), 16) ||
        (color.startsWith("rgb") ? parseInt(color.match(/\d+/g)[0]) : 0);
      const g =
        parseInt(color.substring(3, 5), 16) ||
        (color.startsWith("rgb") ? parseInt(color.match(/\d+/g)[1]) : 0);
      const b =
        parseInt(color.substring(5, 7), 16) ||
        (color.startsWith("rgb") ? parseInt(color.match(/\d+/g)[2]) : 0);

      const pixelIndex = (y * canvas.width + x) * 4;
      data[pixelIndex] = r; // Red
      data[pixelIndex + 1] = g; // Green
      data[pixelIndex + 2] = b; // Blue
      data[pixelIndex + 3] = 255; // Alpha (opaco)
    }
  }
  ctx.putImageData(imageData, 0, 0);
  loadingIndicator.style.display = "none";
  renderButton.disabled = false;
  resetButton.disabled = false;
}

// Zoom ao clicar
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Converter clique do canvas para coordenadas do plano complexo
  const rangeX = 3.5 / currentZoom;
  const rangeY = 2.0 / currentZoom;
  const minReal = centerX - rangeX / 2;
  const minImag = centerY - rangeY / 2;

  centerX = minReal + (clickX / canvas.width) * rangeX;
  centerY = minImag + (clickY / canvas.height) * rangeY;

  currentZoom *= 2.0; // Dobrar o zoom a cada clique
  updateControlsDisplay();
  drawMandelbrot();
});

// Ajustar o tamanho do canvas e desenhar quando a janela é redimensionada
window.addEventListener("resize", () => {
  setCanvasSize();
  drawMandelbrot();
});

// Configuração inicial
setCanvasSize();
updateControlsDisplay();
drawMandelbrot();