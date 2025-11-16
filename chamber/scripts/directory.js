// Set copyright year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// View toggle functionality
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const directoryContainer = document.getElementById('directory-container');

gridViewBtn.addEventListener('click', () => {
    directoryContainer.classList.remove('list-view');
    directoryContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    directoryContainer.classList.remove('grid-view');
    directoryContainer.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

// Fetch and display members
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching members:', error);
        directoryContainer.innerHTML = '<p style="text-align: center; color: red;">Error loading member data. Please try again later.</p>';
    }
}

// Display members on the page
function displayMembers(members) {
    directoryContainer.innerHTML = '';

    members.forEach(member => {
        const memberCard = createMemberCard(member);
        directoryContainer.appendChild(memberCard);
    });
}

// Create individual member card
function createMemberCard(member) {
    const card = document.createElement('div');
    card.classList.add('member-card');

    // Determine membership level badge
    const membershipLevels = {
        1: { class: 'membership-member', text: 'Member' },
        2: { class: 'membership-silver', text: 'Silver' },
        3: { class: 'membership-gold', text: 'Gold' }
    };

    const membershipInfo = membershipLevels[member.membershipLevel] || membershipLevels[1];

    card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p class="category">${member.category}</p>
            <p class="description">${member.description}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Visit Site</a></p>
        </div>
        <span class="membership-badge ${membershipInfo.class}">${membershipInfo.text}</span>
    `;

    return card;
}

// Initialize the page
getMembers();