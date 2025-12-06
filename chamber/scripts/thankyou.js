// Set copyright year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Get URL parameters and display form data
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const summaryContent = document.getElementById('summary-content');

    // Create array of required fields to display
    const fieldsToDisplay = [
        { param: 'first-name', label: 'First Name' },
        { param: 'last-name', label: 'Last Name' },
        { param: 'email', label: 'Email Address' },
        { param: 'mobile', label: 'Mobile Phone' },
        { param: 'business-name', label: 'Business/Organization' },
        { param: 'timestamp', label: 'Submitted On' }
    ];

    // Create summary items
    fieldsToDisplay.forEach(field => {
        let value = urlParams.get(field.param);

        // Format timestamp if it's the timestamp field
        if (field.param === 'timestamp' && value) {
            const date = new Date(value);
            value = date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Only display if value exists
        if (value) {
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            summaryItem.innerHTML = `
                <strong>${field.label}:</strong>
                <span>${value}</span>
            `;
            summaryContent.appendChild(summaryItem);
        }
    });

    // If no data was found, show a message
    if (summaryContent.children.length === 0) {
        summaryContent.innerHTML = '<p style="text-align: center; color: #666;">No application data found.</p>';
    }
}

// Call the function when page loads
displayFormData();