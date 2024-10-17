let numCols = 17;
let numRows = 10;
let gridSizeX;
let gridSizeY;
const minCols = 7;
const minGridSize = 70;
const maxGridSize = 100;
const BREAKPOINT = 768;
let noiseScale = 0.003;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  
  // After 3 seconds (1 second for fade-out), completely hide the preloader
  setTimeout(() => {
    preloader.classList.add('hidden'); // Ensure it is removed after fade-out
  }, 1000); // Total 3 seconds: 2s delay + 1s fade-out
}

function draw() {
  background(45, 47, 48);
  drawAlignedGrid();
  applyNoiseLayer();
}

function adjustGridSize() {
  gridSizeX = windowWidth / numCols;
  gridSizeY = windowHeight / numRows;

  if (gridSizeX < minGridSize) {
    numCols = max(minCols, floor(windowWidth / minGridSize));
  } else if (gridSizeX > maxGridSize) {
    numCols = max(minCols, floor(windowWidth / maxGridSize));
  }

  if (gridSizeY < minGridSize) {
    numRows = max(1, floor(windowHeight / minGridSize));
  } else if (gridSizeY > maxGridSize) {
    numRows = max(1, floor(windowHeight / maxGridSize));
  }

  gridSizeX = windowWidth / numCols;
  gridSizeY = windowHeight / numRows;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  adjustGridSize();
  adjustLogoSize();
  adjustButtonPositions();
  adjustHeroContainerPosition();
}

function adjustLogoSize() {
  let logo = select('#logo');
  let logoWidth = gridSizeX * 3;
  logo.size(logoWidth, 'auto');
  let logoX = (windowWidth / 2) - (logoWidth / 2);
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
    let gridSizeX = windowWidth / numCols; // Calculate grid size based on columns
    let gridSizeY = windowHeight / numRows; // Calculate grid size based on rows

    // Desktop-specific positioning (above the BREAKPOINT)
    if (windowWidth > BREAKPOINT) {
      let secondVerticalGridline = calcGridPos(1); // Align to the second vertical gridline from the left
      let fourthHorizontalGridline = gridSizeY * 3; // Align to the fourth horizontal gridline from the top

      // Align hero container for desktop
      heroContainer.style.position = 'absolute';
      heroContainer.style.left = `${secondVerticalGridline}px`; // Align to second vertical gridline
      heroContainer.style.top = `${fourthHorizontalGridline}px`; // Align to fourth horizontal gridline
      heroContainer.style.width = `${gridSizeX * 6}px`; // Span across a few grid columns
      heroContainer.style.overflowY = ''; // No overflow required on desktop
      heroContainer.style.maxHeight = ''; // Reset max height
    }
    // Mobile-specific positioning (below or equal to the BREAKPOINT)
    else {
      let firstVerticalGridline = gridSizeX; // Align to the first vertical gridline
      let secondHorizontalGridline = gridSizeY * 1.9; // Align to the second horizontal gridline from the top
      let lastVerticalGridline = gridSizeX * (numCols - 1); // Align to the last vertical gridline
      let lastHorizontalGridline = gridSizeY * (numRows - 1); // Align to the first horizontal gridline from the bottom

      heroContainer.style.position = 'absolute';
      heroContainer.style.left = `${firstVerticalGridline}px`; // Align to first vertical gridline
      heroContainer.style.right = `${windowWidth - lastVerticalGridline}px`; // Align to the last vertical gridline
      heroContainer.style.top = `${secondHorizontalGridline + gridSizeY * 0.1}px`; // Slightly below second horizontal gridline
      heroContainer.style.bottom = `${windowHeight - lastHorizontalGridline}px`; // Align to the first horizontal gridline from the bottom
      heroContainer.style.overflowY = 'auto'; // Enable scrolling for mobile
      heroContainer.style.maxHeight = `${lastHorizontalGridline - secondHorizontalGridline}px`; // Set max height between the gridlines
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
  stroke(145, 145, 145);
  for (let col = 1; col < numCols; col++) {
    let x = col * gridSizeX;
    line(x, 0, x, height);
  }

  for (let row = 1; row < numRows; row++) {
    let y = row * gridSizeY;
    line(0, y, width, y);
  }
}

function applyNoiseLayer() {
  noStroke();
  for (let x = 0; x <= width; x += 20) {
    for (let y = 0; y <= height; y += 20) {
      let noiseValue = noise(x * noiseScale, y * noiseScale, time);
      let alpha = map(noiseValue, 0, 1, -100, 255);
      let invertedAlpha = 255 - alpha;
      fill(45, 47, 48, invertedAlpha);
      rect(x, y, 40, 40);
    }
  }
  time += 0.0053;
}

function calcGridPos(gridUnits) {
  return gridSizeX * gridUnits;
}
