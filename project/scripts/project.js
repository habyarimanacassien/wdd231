// Course data objects
const courses = {
    nonparametric: {
        name: "Nonparametric Methods",
        weeks: 14,
        lectures: [
            "Introduction to Nonparametric Statistics",
            "Order Statistics and Ranks",
            "The Sign Test",
            "Wilcoxon Signed-Rank Test",
            "Mann-Whitney U Test",
            "Kruskal-Wallis Test",
            "Friedman Test",
            "Spearman's Rank Correlation",
            "Kendall's Tau",
            "Bootstrap Methods",
            "Permutation Tests",
            "Density Estimation",
            "Nonparametric Regression",
            "Review and Applications"
        ],
        assignments: Array(14).fill().map((_, i) => {
            const week = i + 1;
            if (week === 5) return 'Assignment 1';
            if (week === 9) return 'Assignment 2';
            if (week === 13) return 'Assignment 3';
            return 'No assignment this week';
        }),
        quizzes: [4, 7, 10, 13],
        cats: [7, 14]
    },
    ict: {
        name: "ICT Skills",
        weeks: 14,
        lectures: [
            "Introduction to ICT in Scientific Research",
            "Word Processing for Scientific Documents",
            "Spreadsheets for Data Analysis",
            "Presentation Software",
            "Introduction to Programming Concepts",
            "Data Management with Databases",
            "Statistical Software Overview",
            "Data Visualization Techniques",
            "Scientific Computing with Python/R",
            "Web Technologies for Scientists",
            "Collaboration Tools and Version Control",
            "Data Security and Ethics",
            "Emerging Technologies in Science",
            "Project Development and Presentation"
        ],
        assignments: Array(14).fill().map((_, i) => {
            const week = i + 1;
            if (week === 5) return 'ICT Assignment 1';
            if (week === 9) return 'ICT Assignment 2';
            if (week === 13) return 'ICT Assignment 3';
            return 'No assignment this week';
        }),
        quizzes: [4, 7, 10, 13],
        cats: [7, 14]
    }
};

// State management
let studyResources = [];

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const exploreCoursesBtn = document.getElementById('exploreCourses');
const viewCourseBtns = document.querySelectorAll('.view-course-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const announcementForm = document.getElementById('announcement-form');
const announcementsList = document.getElementById('announcements-list');
const contactForm = document.getElementById('contact-form');
const currentYearElement = document.getElementById('current-year');
const lastModifiedElement = document.getElementById('last-modified');

// Initialize the application
function init() {
    setFooterInfo();
    setupEventListeners();
    initializeSchedule('nonparametric');
    loadAnnouncements();
    setupFormHandlers();
    createModal();
    fetchStudyResources();
    loadUserPreferences();
}

// Fetch study resources from API
async function fetchStudyResources() {
    try {
        const response = await fetch('https://openlibrary.org/subjects/statistics.json?limit=20');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        studyResources = data.works.map((work, index) => ({
            id: index + 1,
            title: work.title,
            author: work.authors?.[0]?.name || 'Unknown Author',
            subject: work.subject?.[0] || 'Statistics',
            year: work.first_publish_year || 'N/A',
            coverUrl: work.cover_id ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` : null,
            key: work.key
        }));

        displayStudyResources(studyResources);
    } catch (error) {
        console.error('Error fetching study resources:', error);
        displayErrorMessage('Unable to load study resources. Please try again later.');
    }
}

// Display study resources
function displayStudyResources(resources) {
    const resourcesSection = document.querySelector('.resources-section');

    // Create or get books container
    let booksContainer = document.querySelector('.books-container');
    if (!booksContainer) {
        booksContainer = document.createElement('div');
        booksContainer.className = 'books-container';

        const heading = document.createElement('h3');
        heading.textContent = 'Recommended Statistics Books';
        heading.style.marginTop = '2rem';
        heading.style.marginBottom = '1rem';

        resourcesSection.appendChild(heading);
        resourcesSection.appendChild(booksContainer);
    }

    booksContainer.innerHTML = '';

    // Filter to show at least 15 items with valid data
    const validResources = resources.filter(resource =>
        resource.title && resource.author && resource.subject
    ).slice(0, 15);

    validResources.forEach(resource => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            ${resource.coverUrl ? `<img src="${resource.coverUrl}" alt="${resource.title}" loading="lazy">` : '<div class="no-cover">No Cover</div>'}
            <div class="book-info">
                <h4>${resource.title}</h4>
                <p><strong>Author:</strong> ${resource.author}</p>
                <p><strong>Subject:</strong> ${resource.subject}</p>
                <p><strong>Year:</strong> ${resource.year}</p>
                <button class="view-details-btn" data-id="${resource.id}">View Details</button>
            </div>
        `;
        booksContainer.appendChild(bookCard);
    });

    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const bookId = parseInt(this.getAttribute('data-id'));
            const book = studyResources.find(r => r.id === bookId);
            if (book) {
                showBookModal(book);
            }
        });
    });
}

// Display error message
function displayErrorMessage(message) {
    const resourcesSection = document.querySelector('.resources-section');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'background-color: #fee; color: #c33; padding: 1rem; border-radius: 8px; margin-top: 1rem;';
    errorDiv.textContent = message;
    resourcesSection.appendChild(errorDiv);
}

// Create modal structure
function createModal() {
    const modalHTML = `
        <div id="bookModal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="modal-body"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('bookModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show book details in modal
function showBookModal(book) {
    const modal = document.getElementById('bookModal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>${book.title}</h2>
        ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title}" style="max-width: 200px; margin: 1rem 0;">` : ''}
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Subject:</strong> ${book.subject}</p>
        <p><strong>First Published:</strong> ${book.year}</p>
        <p><strong>Resource ID:</strong> ${book.id}</p>
        <button id="add-to-favorites" class="cta-button">Add to My Library</button>
    `;

    modal.style.display = 'block';

    document.getElementById('add-to-favorites').addEventListener('click', () => {
        addToFavorites(book);
        modal.style.display = 'none';
    });
}

// Add book to favorites using localStorage
function addToFavorites(book) {
    let favorites = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');

    if (!favorites.find(fav => fav.id === book.id)) {
        favorites.push(book);
        localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
        alert(`"${book.title}" has been added to your library!`);
    } else {
        alert('This book is already in your library.');
    }
}

// Load user preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

    if (preferences.defaultCourse) {
        switchTab(preferences.defaultCourse);
    }
}

// Save user preference
function saveUserPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Set footer information
function setFooterInfo() {
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = currentYear;

    const lastModified = new Date(document.lastModified);
    lastModifiedElement.textContent = lastModified.toLocaleDateString();
}

// Set up all event listeners
function setupEventListeners() {
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (exploreCoursesBtn) {
        exploreCoursesBtn.addEventListener('click', scrollToCourses);
    }

    viewCourseBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const course = this.getAttribute('data-course');
            switchTab(course);
            scrollToSchedule();
            saveUserPreference('defaultCourse', course);
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            saveUserPreference('defaultCourse', tab);
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    mainNav.classList.toggle('active');

    const spans = menuToggle.querySelectorAll('span');
    if (mainNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Scroll functions
function scrollToCourses() {
    document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
}

function scrollToSchedule() {
    document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' });
}

// Switch between tabs
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
            initializeSchedule(tabName);
        } else {
            content.classList.remove('active');
        }
    });
}

// Initialize schedule for a course
function initializeSchedule(courseId) {
    const course = courses[courseId];
    const activeTab = document.querySelector('.tab-content.active');

    const weekSelect = activeTab.querySelector('.week-select');
    const weekTitle = activeTab.querySelector('.week-title');
    const lectureContent = activeTab.querySelector('.lecture-content');
    const assignmentList = activeTab.querySelector('.assignment-list');
    const assessmentInfo = activeTab.querySelector('.assessment-info');

    if (weekSelect) {
        weekSelect.innerHTML = '';

        for (let i = 1; i <= course.weeks; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Week ${i}`;
            weekSelect.appendChild(option);
        }

        weekSelect.addEventListener('change', function () {
            updateWeekContent(courseId, activeTab);
        });

        updateWeekContent(courseId, activeTab);
    }
}

// Update week content
function updateWeekContent(courseId, activeTab) {
    const course = courses[courseId];
    const weekSelect = activeTab.querySelector('.week-select');
    const weekTitle = activeTab.querySelector('.week-title');
    const lectureContent = activeTab.querySelector('.lecture-content');
    const assignmentList = activeTab.querySelector('.assignment-list');
    const assessmentInfo = activeTab.querySelector('.assessment-info');

    if (weekSelect && weekTitle && lectureContent && assignmentList && assessmentInfo) {
        const selectedWeek = parseInt(weekSelect.value);

        weekTitle.textContent = `Week ${selectedWeek}`;
        lectureContent.textContent = course.lectures[selectedWeek - 1];

        assignmentList.innerHTML = '';
        const assignmentItem = document.createElement('li');
        const assignmentText = course.assignments[selectedWeek - 1];
        assignmentItem.textContent = assignmentText;

        if (assignmentText === 'No assignment this week') {
            assignmentItem.classList.add('no-assignment');
        }

        assignmentList.appendChild(assignmentItem);

        assessmentInfo.innerHTML = '';

        if (course.quizzes.includes(selectedWeek)) {
            const quizInfo = document.createElement('p');
            quizInfo.innerHTML = `<strong>Quiz:</strong> Quiz ${course.quizzes.indexOf(selectedWeek) + 1} this week`;
            assessmentInfo.appendChild(quizInfo);
        }

        if (course.cats.includes(selectedWeek)) {
            const catInfo = document.createElement('p');
            catInfo.innerHTML = `<strong>CAT:</strong> Continuous Assessment Test ${course.cats.indexOf(selectedWeek) + 1} this week`;
            assessmentInfo.appendChild(catInfo);
        }

        if (assessmentInfo.children.length === 0) {
            const noAssessment = document.createElement('p');
            noAssessment.textContent = 'No assessments scheduled for this week';
            assessmentInfo.appendChild(noAssessment);
        }
    }
}

// Set up form handlers
function setupFormHandlers() {
    if (announcementForm) {
        announcementForm.addEventListener('submit', handleAnnouncementSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle announcement submission
function handleAnnouncementSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    const course = document.getElementById('announcement-course').value;

    const announcement = {
        id: Date.now(),
        title,
        content,
        course,
        date: new Date().toLocaleDateString()
    };

    saveAnnouncement(announcement);
    announcementForm.reset();
    loadAnnouncements();
}

// Announcement management functions
function saveAnnouncement(announcement) {
    let announcements = getAnnouncements();
    announcements.unshift(announcement);
    localStorage.setItem('course-announcements', JSON.stringify(announcements));
}

function getAnnouncements() {
    const stored = localStorage.getItem('course-announcements');
    return stored ? JSON.parse(stored) : [];
}

function loadAnnouncements() {
    const announcements = getAnnouncements();
    if (announcementsList) {
        announcementsList.innerHTML = '';

        if (announcements.length === 0) {
            announcementsList.innerHTML = '<p>No announcements yet.</p>';
            return;
        }

        announcements.forEach(announcement => {
            const announcementElement = createAnnouncementElement(announcement);
            announcementsList.appendChild(announcementElement);
        });
    }
}

function createAnnouncementElement(announcement) {
    const div = document.createElement('div');
    div.className = 'announcement-item';
    div.innerHTML = `
        <div class="announcement-meta">
            <span>${announcement.date}</span>
            <span>${announcement.course === 'all' ? 'All Courses' : courses[announcement.course].name}</span>
            <button class="delete-announcement" data-id="${announcement.id}">Delete</button>
        </div>
        <h4>${announcement.title}</h4>
        <p>${announcement.content}</p>
    `;

    const deleteBtn = div.querySelector('.delete-announcement');
    deleteBtn.addEventListener('click', function () {
        deleteAnnouncement(announcement.id);
    });

    return div;
}

function deleteAnnouncement(id) {
    let announcements = getAnnouncements();
    announcements = announcements.filter(ann => ann.id !== id);
    localStorage.setItem('course-announcements', JSON.stringify(announcements));
    loadAnnouncements();
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const course = document.getElementById('course').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const contactMessage = {
        id: Date.now(),
        name,
        email,
        course,
        subject,
        message,
        date: new Date().toLocaleString()
    };

    saveContactMessage(contactMessage);
    alert('Thank you for your message! You will get feedback soon.');
    contactForm.reset();
}

function saveContactMessage(message) {
    let messages = getContactMessages();
    messages.unshift(message);
    localStorage.setItem('course-contact-messages', JSON.stringify(messages));
}

function getContactMessages() {
    const stored = localStorage.getItem('course-contact-messages');
    return stored ? JSON.parse(stored) : [];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);