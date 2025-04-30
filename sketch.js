let numCols = 17;
let numRows = 10;
let gridSizeX;
let gridSizeY;
const minCols = 7;
const minRows = 5;
const minGridSize = 70;
const maxGridSize = 100;
const BREAKPOINT = 768;
let noiseScale = 0.003;
let time = 0;

function setup() {
  createCanvas(windowWidth, document.documentElement.scrollHeight);
  adjustGridSize();
  adjustLogoSize();
  adjustButtonPositions();
  adjustHeroContainerPosition();

  // Preloader handling
  const preloader = document.getElementById('preloader');

  // After 0.5 seconds, add fade-out class
  setTimeout(() => {
    preloader.classList.add('fade-out');
  }, 500); 
  
  // After 1 second, completely hide the preloader
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1000);

  // Observer to detect content changes
  const observer = new MutationObserver(() => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas(windowWidth, document.documentElement.scrollHeight);
        adjustGridSize();
        redraw();
    }, 100); // Adjust the debounce delay
});
}

function draw() {
  if (document.documentElement.scrollHeight !== height) {
    resizeCanvas(windowWidth, document.documentElement.scrollHeight); // Resize canvas to include overflow height
    adjustGridSize();
  }
  background(255, 255, 255);
  drawAlignedGrid();
  applyNoiseLayer();
}

function adjustGridSize() {
  gridSizeX = windowWidth / numCols;
  gridSizeY = document.documentElement.scrollHeight / numRows;

  // Adjust the number of columns based on the width
  if (gridSizeX < minGridSize) {
    numCols = max(minCols, floor(windowWidth / minGridSize));
  } else if (gridSizeX > maxGridSize) {
    numCols = max(minCols, floor(windowWidth / maxGridSize));
  }

  // Adjust the number of rows based on the height
  if (gridSizeY < minGridSize) {
    numRows = max(minRows, floor(document.documentElement.scrollHeight / minGridSize));
  } else if (gridSizeY > maxGridSize) {
    numRows = max(minRows, floor(document.documentElement.scrollHeight / maxGridSize));
  }

  gridSizeX = windowWidth / numCols;
  gridSizeY = document.documentElement.scrollHeight / numRows;
}

function windowResized() {
  resizeCanvas(windowWidth, document.documentElement.scrollHeight);
  adjustGridSize();
  adjustLogoSize();
  adjustButtonPositions();
  adjustHeroContainerPosition();
  redraw(); // Trigger redraw after resizing
}

function adjustLogoSize() {
  let logo = select('#logo');
  let logoWidth = gridSizeX * 2; // Ensure logo takes up 3 grid cells
  logo.size(logoWidth, 'auto');
  let logoX = (windowWidth / 2) - (logoWidth / 2); // Center the logo
  let logoY = gridSizeY - (gridSizeY * 0.265);
  logo.position(logoX, logoY);
}

function adjustButtonPositions() {
  let buttonTop = gridSizeY - (gridSizeY * 0.325);

  let aboutButton = select('#about-button');
  let instagramButton = select('#instagram-button');
  let contactButton = select('#contact-button');

  aboutButton.position(calcGridPos(1) * 0.8, buttonTop);
  instagramButton.position(calcGridPos(2) * 0.898, buttonTop);
  contactButton.position(calcGridPos(numCols - 2) * 0.987, buttonTop);
}

function adjustHeroContainerPosition() {
  let heroContainer = document.querySelector('.hero-container');

  if (heroContainer) {
      let gridSizeX = windowWidth / numCols;
      let gridSizeY = document.documentElement.scrollHeight / numRows;

      if (windowWidth > BREAKPOINT) {
          let secondVerticalGridline = calcGridPos(1);
          let fourthHorizontalGridline = gridSizeY * 3.2; // Adjusted for more downward shift

          heroContainer.style.position = 'absolute';
          heroContainer.style.left = `${secondVerticalGridline}px`;
          heroContainer.style.top = `${fourthHorizontalGridline}px`;
          heroContainer.style.width = `${gridSizeX * 6.5}px`; // Adjusted to make it a bit narrower
      } else {
          let firstVerticalGridline = gridSizeX;
          let secondHorizontalGridline = gridSizeY * 2.09; // Adjusted for a lower position on mobile
          let lastVerticalGridline = gridSizeX * (numCols - 2); // Align to the first vertical gridline from the right

          heroContainer.style.position = 'absolute';
          heroContainer.style.left = `${firstVerticalGridline}px`;
          heroContainer.style.top = `${secondHorizontalGridline}px`;
          heroContainer.style.width = `calc(100% - ${2 * firstVerticalGridline}px)`; // Reduced width for alignment
          heroContainer.style.paddingBottom = '20px'; // Add padding to the bottom to avoid text ending at the window edge
      }
  }
}

// Recalculate position on window resize
window.addEventListener("resize", () => {
  adjustHeroContainerPosition();
});

// Initial setup to set positions
adjustHeroContainerPosition();

function drawAlignedGrid() {
  stroke(240, 240, 240);
  for (let col = 1; col < numCols; col++) {
    let x = col * gridSizeX;
    line(x, 0, x, document.documentElement.scrollHeight); // Extend vertical lines to full document height
  }

  for (let row = 1; row < numRows; row++) {
    let y = row * gridSizeY;
    line(0, y, width, y);
  }
}

function applyNoiseLayer() {
  noStroke();
  for (let x = 0; x <= width; x += 20) {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 20) {
      let noiseValue = noise(x * noiseScale, y * noiseScale, time);
      let alpha = map(noiseValue, 0, 1, -100, 255);
      let invertedAlpha = 255 - alpha;
      fill(255, 255, 255, invertedAlpha);
      rect(x, y, 40, 40);
    }
  }
  time += 0.0053;
}

function calcGridPos(gridUnits) {
  return gridSizeX * gridUnits;
}
