window.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById("hamburger-menu");
    const hamburgerContainer = document.querySelector(".hamburger-container");
    const lines = hamburgerButton.querySelectorAll(".line");
    const heroHeader = document.querySelector('.hero-container h1');
    const heroParagraph = document.querySelector('.hero-container p');
    const logo = document.getElementById("logo");
    const aboutButton = document.getElementById('about-button');
    const aboutButtonMobile = document.getElementById('about-button-mobile');
    const BREAKPOINT = 768;

    let headerInterval;
    let paragraphInterval;
    let isAboutPage = false;

    function adjustHamburgerContainer() {
        hamburgerContainer.style.width = `${window.innerWidth}px`;
        hamburgerContainer.style.height = `${window.innerHeight}px`;
        hamburgerContainer.style.zIndex = "998";
    }

    function toggleMenu() {
        hamburgerButton.classList.toggle("open");
        if (hamburgerContainer.classList.contains("active")) {
            hamburgerContainer.classList.remove("active");
            setTimeout(() => {
                hamburgerContainer.style.visibility = 'hidden';
            }, 400);
        } else {
            hamburgerContainer.style.visibility = 'visible';
            hamburgerContainer.classList.add("active");
        }
        lines.forEach(line => line.classList.toggle("change-color"));
        hamburgerButton.style.zIndex = "1007";
        adjustHamburgerContainer();
    }

    hamburgerButton.addEventListener("click", toggleMenu);

    // Text transition helper
    function animateSimultaneousTransition(element, newText, useHTML = false) {
        const currentText = element.textContent;
        const maxLength = Math.max(currentText.length, newText.length);
        let currentCharIndex = 0;

        if (element === heroHeader) clearInterval(headerInterval);
        if (element === heroParagraph) clearInterval(paragraphInterval);

        const transitionInterval = setInterval(() => {
            let updatedText = '';
            for (let i = 0; i < maxLength; i++) {
                const currentChar = currentText[i] || '';
                const newChar = newText[i] || '';
                updatedText += i < currentCharIndex ? newChar : currentChar;
            }

            if (useHTML) {
                element.innerHTML = updatedText;
            } else {
                element.textContent = updatedText;
            }

            currentCharIndex++;

            if (currentCharIndex > maxLength) {
                clearInterval(transitionInterval);
                updateCanvasAndGrid();
            }
        }, 4);

        if (element === heroHeader) headerInterval = transitionInterval;
        if (element === heroParagraph) paragraphInterval = transitionInterval;
    }

    // "About" click
    function handleAboutClick() {
        const newHeader = "About";
        const newParagraph = `
Gal Nell Dahan was founded by Gal Nell Dahan in 2024, drawing its inspiration from the intersection of Middle Eastern and European heritages, fusing these cultural influences into modern menswear. Fashion is an art form — a tool for self-expression to convey individuality that transcends time. Curiously exploring classic silhouettes while challenging them with modern takeoffs, Gal Nell Dahan aims to change the conventional perspective on men’s fashion, catering to men who seek both style and substance, understanding that true elegance lies in the details and expert craftsmanship.<br><br>

By emphasizing quality over quantity and focusing on meticulously crafted pieces, Gal Nell Dahan collaborates with skilled artisans, committed to high-quality craftsmanship. This ensures each piece is as durable in essence as it is in form. This insistence on sustainable production not only brings the brand’s refined vision to life but also aligns with core values of environmental responsibility and ethical labor.
        `;
        animateSimultaneousTransition(heroHeader, newHeader);
        animateSimultaneousTransition(heroParagraph, newParagraph, true); // innerHTML enabled

        aboutButton.textContent = "Back";
        aboutButton.style.fontWeight = "700";
        aboutButtonMobile.textContent = "Back";
        isAboutPage = true;
    }

    // "Back" click
    function handleBackClick() {
        const originalHeader = "Autumn / Winter 26'";
        const originalParagraph = `
The AW26 collection, which will be unveiled this January, is inspired by the Hustler — the person who keeps moving, creating, and carving out their own place in the world. Living between the street and elevation, between the margins and the center, forever pushing forward with quiet confidence.<br><br>

This season explores what power looks like today: not loud, but steady; not defined by rules, but by momentum. AW26 captures the energy of those who work relentlessly, break limits, and shape their own reality.<br><br>

With sharp contrasts, tactile fabrics, and clean, elevated silhouettes, the collection continues to reflect GAL NELL DAHAN’s core values: constant curiosity, sophistication, elegance, and a deep belief in human drive.
        `;
        animateSimultaneousTransition(heroHeader, originalHeader);
        animateSimultaneousTransition(heroParagraph, originalParagraph, true); // innerHTML enabled

        aboutButton.textContent = "About";
        aboutButton.style.fontWeight = "500";
        aboutButtonMobile.textContent = "About";
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

    aboutButton.addEventListener('click', () => {
        if (isAboutPage) handleBackClick();
        else handleAboutClick();
    });

    aboutButtonMobile.addEventListener('click', () => {
        if (isAboutPage) handleBackClick();
        else handleAboutClick();
        toggleMenu();
    });

    logo.addEventListener('click', handleBackClick);

    function checkWindowSize() {
        if (window.innerWidth > BREAKPOINT && hamburgerContainer.classList.contains("active")) {
            hamburgerContainer.classList.remove("active");
            hamburgerButton.classList.remove("open");
            lines.forEach(line => line.classList.remove("change-color"));
            setTimeout(() => { hamburgerContainer.style.visibility = 'hidden'; }, 400);
        }
        adjustHamburgerContainer();
        updateCanvasAndGrid();
    }

    window.addEventListener("resize", checkWindowSize);

    checkWindowSize();
    adjustHamburgerContainer();
    updateCanvasAndGrid();
});
