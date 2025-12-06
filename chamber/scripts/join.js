// Set copyright year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Set timestamp when form loads
document.getElementById('timestamp').value = new Date().toISOString();

// Modal functionality
const modals = document.querySelectorAll('.modal');
const learnMoreLinks = document.querySelectorAll('.learn-more');
const closeButtons = document.querySelectorAll('.close');

// Open modal when "Learn More" is clicked
learnMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = link.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal when X is clicked
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Form validation enhancement
const form = document.getElementById('membership-form');

form.addEventListener('submit', (e) => {
    // Update timestamp right before submission
    document.getElementById('timestamp').value = new Date().toISOString();
});