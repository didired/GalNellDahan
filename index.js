window.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById("hamburger-menu");
    const hamburgerContainer = document.querySelector(".hamburger-container");
    const lines = hamburgerButton.querySelectorAll(".line"); // Get lines of hamburger button
    const heroHeader = document.querySelector('.hero-container h1');
    const heroParagraph = document.querySelector('.hero-container p1');
    const logo = document.getElementById("logo");
    const aboutButton = document.getElementById('about-button');
    const aboutButtonMobile = document.getElementById('about-button-mobile');
    const BREAKPOINT = 768;

    let headerInterval;
    let paragraphInterval;
    let isAboutPage = false; // Track if currently on "About" page

    function adjustHamburgerContainer() {
        hamburgerContainer.style.width = `${window.innerWidth}px`;
        hamburgerContainer.style.height = `${window.innerHeight}px`;
        hamburgerContainer.style.zIndex = "998"; // Set z-index below X button
    }

    function toggleMenu() {
        hamburgerButton.classList.toggle("open");
        if (hamburgerContainer.classList.contains("active")) {
            hamburgerContainer.classList.remove("active");
            setTimeout(() => {
                hamburgerContainer.style.visibility = 'hidden'; // Hide after fade-out
            }, 400);
        } else {
            hamburgerContainer.style.visibility = 'visible'; // Show before fade-in
            hamburgerContainer.classList.add("active");
        }

        lines.forEach(line => line.classList.toggle("change-color"));
        hamburgerButton.style.zIndex = "1007";
        adjustHamburgerContainer();
    }

    hamburgerButton.addEventListener("click", toggleMenu);

    // Helper function for simultaneous text transition with stop functionality
    function animateSimultaneousTransition(element, newText, useHTML = false) {
        const currentText = element.textContent;
        const maxLength = Math.max(currentText.length, newText.length);
        let currentCharIndex = 0;

        if (element === heroHeader) {
            clearInterval(headerInterval);
        } else if (element === heroParagraph) {
            clearInterval(paragraphInterval);
        }

        const transitionInterval = setInterval(() => {
            let updatedText = '';

            for (let i = 0; i < maxLength; i++) {
                const currentChar = currentText[i] || '';
                const newChar = newText[i] || '';

                if (i < currentCharIndex) {
                    updatedText += newChar; // Replace with new character
                } else {
                    updatedText += currentChar; // Keep old character until transition occurs
                }
            }

            // Apply the new text with or without HTML
            if (useHTML) {
                element.innerHTML = updatedText; // Use innerHTML for HTML content like <br>
            } else {
                element.textContent = updatedText; // Use textContent for plain text
            }

            currentCharIndex++;

            if (currentCharIndex > maxLength) {
                clearInterval(transitionInterval); // Stop the transition when done
                updateCanvasAndGrid(); // Update canvas and grid after transition
            }
        }, 4);

        if (element === heroHeader) {
            headerInterval = transitionInterval;
        } else if (element === heroParagraph) {
            paragraphInterval = transitionInterval;
        }
    }

    // Handle "About" button click to change the hero text
    function handleAboutClick() {
        const newHeader = "About";
        const newParagraph = `
        Gal Nell Dahan was founded by Gal Nell Dahan in 2024, drawing its inspiration from the intersection of Middle Eastern and European heritages, fusing these cultural influences into modern menswear. Fashion is an art form — a tool for self-expression to convey individuality that transcends time. Curiously exploring classic silhouettes while challenging them with modern takeoffs, Gal Nell Dahan aims to change the conventional perspective on men’s fashion, catering to men who seek both style and substance, understanding that true elegance lies in the details and expert craftsmanship.<br><br>
        
        By emphasizing quality over quantity and focusing on meticulously crafted pieces, Gal Nell Dahan collaborates with skilled artisans, committed to high-quality craftsmanship. This ensures each piece is as durable in essence as it is in form. This insistence on sustainable production not only brings the brand’s refined vision to life but also aligns with core values of environmental responsibility and ethical labor.
    `;
        // Simultaneously transition header and paragraph
        animateSimultaneousTransition(heroHeader, newHeader);
        animateSimultaneousTransition(heroParagraph, newParagraph, true); // Use innerHTML for paragraph

        // Change button text to "Back" on desktop
        aboutButton.textContent = "Back";
        aboutButton.style.fontWeight = "700"; // Make it bold
        aboutButtonMobile.textContent = "Back"; // Change mobile button text to "Back"
        isAboutPage = true;
    }

    // Handle "Back" button click to restore original hero text
    function handleBackClick() {
        const originalHeader = "Autumn / Winter 25'";
        const originalParagraph = `
        The A/W 2025 debut collection will be unveiled this upcoming January. Drawing inspiration from the art of subtle transformation, merging takeoffs on classic silhouettes with modern subtleties and refined craftsmanship. Designed for the seekers of individuality within understated elegance, each piece invites a closer inspection of the details that defines it.
        `;

        animateSimultaneousTransition(heroHeader, originalHeader);
        animateSimultaneousTransition(heroParagraph, originalParagraph);

        // Change button text back to "About"
        aboutButton.textContent = "About";
        aboutButton.style.fontWeight = "500"; // Normal weight
        aboutButtonMobile.textContent = "About"; // Change mobile button back to "About"
        isAboutPage = false;
    }

    function updateCanvasAndGrid() {
        const newHeight = document.querySelector('.hero-container').offsetHeight + document.querySelector('#header').offsetHeight;
        document.body.style.height = `${newHeight}px`;
        resizeCanvas(window.innerWidth, newHeight);
        adjustGridSize();
        adjustLogoSize();
        adjustButtonPositions();
        adjustHeroContainerPosition();
        document.body.style.overflowY = newHeight > window.innerHeight ? 'auto' : 'hidden';
        redraw();
    }

    // Handle desktop About/Back toggle
    aboutButton.addEventListener('click', () => {
        if (isAboutPage) {
            handleBackClick();
        } else {
            handleAboutClick();
        }
    });

    // Handle mobile About/Back toggle and close menu
    aboutButtonMobile.addEventListener('click', () => {
        if (isAboutPage) {
            handleBackClick();
        } else {
            handleAboutClick();
        }
        toggleMenu(); // Close the hamburger menu
    });

    // Logo click restores original text
    logo.addEventListener('click', handleBackClick);

    function checkWindowSize() {
        if (window.innerWidth > BREAKPOINT && hamburgerContainer.classList.contains("active")) {
            hamburgerContainer.classList.remove("active");
            hamburgerButton.classList.remove("open");
            lines.forEach(line => line.classList.remove("change-color"));
            setTimeout(() => {
                hamburgerContainer.style.visibility = 'hidden';
            }, 400);
        }
        adjustHamburgerContainer();
        updateCanvasAndGrid(); // Adjust canvas and grid when window size changes
    }

    window.addEventListener("resize", () => {
        checkWindowSize();
    });

    checkWindowSize();
    adjustHamburgerContainer();
    updateCanvasAndGrid(); // Ensure initial adjustment of canvas and grid
});
