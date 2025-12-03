// Get current year for copyright
const currentYear = new Date().getFullYear();

// Get last modified date and time
const lastModified = new Date(document.lastModified);

// Format the date and time
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};
const formattedDate = lastModified.toLocaleDateString('en-US', options);

// Update copyright paragraph
document.getElementById('copyright').textContent = `© ${currentYear} Cassien Habyarimana | Rwanda`;

// Update last modified paragraph
document.getElementById('lastModified').textContent = `Last Modified: ${formattedDate}`;