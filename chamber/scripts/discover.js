// discover.js
import attractions from './attractions.mjs';

// Set copyright year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Display visit message based on localStorage
function displayVisitMessage() {
    const visitMessageDiv = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();

    if (!lastVisit) {
        // First visit
        visitMessageDiv.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDiff = now - lastVisitTime;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            // Less than a day
            visitMessageDiv.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            // Exactly 1 day
            visitMessageDiv.textContent = "You last visited 1 day ago.";
        } else {
            // More than 1 day
            visitMessageDiv.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }

    // Store current visit time
    localStorage.setItem('lastVisit', now.toString());
}

// Display attractions
function displayAttractions() {
    const container = document.getElementById('attractions-container');
    container.innerHTML = '';

    attractions.forEach((attraction) => {
        const card = createAttractionCard(attraction);
        container.appendChild(card);
    });
}

// Create attraction card
function createAttractionCard(attraction) {
    const card = document.createElement('div');
    card.classList.add('attraction-card');

    card.innerHTML = `
        <h2>${attraction.name}</h2>
        <figure>
            <img src="images/${attraction.image}" 
                 alt="${attraction.name}" 
                 loading="lazy"
                 width="300"
                 height="200">
        </figure>
        <address>${attraction.address}</address>
        <p>${attraction.description}</p>
        <button class="learn-more-btn">Learn More</button>
    `;

    return card;
}

// Initialize page
function initializePage() {
    displayVisitMessage();
    displayAttractions();
}

// Run initialization when page loads
initializePage();