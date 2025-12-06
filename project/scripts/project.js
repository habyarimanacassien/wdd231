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
    // Set current year and last modified date
    setFooterInfo();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize schedule for default course
    initializeSchedule('nonparametric');
    
    // Load announcements from localStorage
    loadAnnouncements();
    
    // Set up form submission handlers
    setupFormHandlers();
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
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Explore courses button
    if (exploreCoursesBtn) {
        exploreCoursesBtn.addEventListener('click', scrollToCourses);
    }
    
    // View course buttons
    viewCourseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const course = this.getAttribute('data-course');
            switchTab(course);
            scrollToSchedule();
        });
    });
    
    // Schedule tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    
    // Animate hamburger icon
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

// Scroll to courses section
function scrollToCourses() {
    document.getElementById('courses').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Scroll to schedule section
function scrollToSchedule() {
    document.getElementById('schedule').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab contents
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
            // Initialize schedule for this course
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
    
    // Get elements specific to this tab
    const weekSelect = activeTab.querySelector('.week-select');
    const weekTitle = activeTab.querySelector('.week-title');
    const lectureContent = activeTab.querySelector('.lecture-content');
    const assignmentList = activeTab.querySelector('.assignment-list');
    const assessmentInfo = activeTab.querySelector('.assessment-info');
    
    // Clear week selector
    if (weekSelect) {
        weekSelect.innerHTML = '';
        
        // Populate week selector
        for (let i = 1; i <= course.weeks; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Week ${i}`;
            weekSelect.appendChild(option);
        }
        
        // Add event listener to week selector for this specific tab
        weekSelect.addEventListener('change', function() {
            updateWeekContent(courseId, activeTab);
        });
        
        // Set initial week content
        updateWeekContent(courseId, activeTab);
    }
}

// Update week content based on selection
function updateWeekContent(courseId, activeTab) {
    const course = courses[courseId];
    
    // Get elements specific to this tab
    const weekSelect = activeTab.querySelector('.week-select');
    const weekTitle = activeTab.querySelector('.week-title');
    const lectureContent = activeTab.querySelector('.lecture-content');
    const assignmentList = activeTab.querySelector('.assignment-list');
    const assessmentInfo = activeTab.querySelector('.assessment-info');
    
    if (weekSelect && weekTitle && lectureContent && assignmentList && assessmentInfo) {
        const selectedWeek = parseInt(weekSelect.value);
        
        // Update week title
        weekTitle.textContent = `Week ${selectedWeek}`;
        
        // Update lecture content
        lectureContent.textContent = course.lectures[selectedWeek - 1];
        
        // Update assignments
        assignmentList.innerHTML = '';
        const assignmentItem = document.createElement('li');
        
        // Check if there's an assignment this week
        const assignmentText = course.assignments[selectedWeek - 1];
        assignmentItem.textContent = assignmentText;
        
        // Add a class for styling if there's no assignment
        if (assignmentText === 'No assignment this week') {
            assignmentItem.classList.add('no-assignment');
        }
        
        assignmentList.appendChild(assignmentItem);
        
        // Update assessment info
        assessmentInfo.innerHTML = '';
        
        // Check if this week has a quiz
        if (course.quizzes.includes(selectedWeek)) {
            const quizInfo = document.createElement('p');
            quizInfo.innerHTML = `<strong>Quiz:</strong> Quiz ${course.quizzes.indexOf(selectedWeek) + 1} this week`;
            assessmentInfo.appendChild(quizInfo);
        }
        
        // Check if this week has a CAT
        if (course.cats.includes(selectedWeek)) {
            const catInfo = document.createElement('p');
            catInfo.innerHTML = `<strong>CAT:</strong> Continuous Assessment Test ${course.cats.indexOf(selectedWeek) + 1} this week`;
            assessmentInfo.appendChild(catInfo);
        }
        
        // If no assessments this week
        if (assessmentInfo.children.length === 0) {
            const noAssessment = document.createElement('p');
            noAssessment.textContent = 'No assessments scheduled for this week';
            assessmentInfo.appendChild(noAssessment);
        }
    }
}

// Set up form submission handlers
function setupFormHandlers() {
    // Announcement form
    if (announcementForm) {
        announcementForm.addEventListener('submit', handleAnnouncementSubmit);
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle announcement form submission
function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    const course = document.getElementById('announcement-course').value;
    
    // Create announcement object
    const announcement = {
        id: Date.now(),
        title,
        content,
        course,
        date: new Date().toLocaleDateString()
    };
    
    // Save announcement
    saveAnnouncement(announcement);
    
    // Reset form
    announcementForm.reset();
    
    // Reload announcements
    loadAnnouncements();
}

// Save announcement to localStorage
function saveAnnouncement(announcement) {
    let announcements = getAnnouncements();
    announcements.unshift(announcement);
    localStorage.setItem('course-announcements', JSON.stringify(announcements));
}

// Get announcements from localStorage
function getAnnouncements() {
    const stored = localStorage.getItem('course-announcements');
    return stored ? JSON.parse(stored) : [];
}

// Load and display announcements
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

// Create announcement element
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
    
    // Add event listener to delete button
    const deleteBtn = div.querySelector('.delete-announcement');
    deleteBtn.addEventListener('click', function() {
        deleteAnnouncement(announcement.id);
    });
    
    return div;
}

// Delete announcement
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
    
    // Create message object
    const contactMessage = {
        id: Date.now(),
        name,
        email,
        course,
        subject,
        message,
        date: new Date().toLocaleString()
    };
    
    // Save message to localStorage
    saveContactMessage(contactMessage);
    
    // Show success message
    alert('Thank you for your message! You will get feedback soon.');
    
    // Reset form
    contactForm.reset();
}

// Save contact message to localStorage
function saveContactMessage(message) {
    let messages = getContactMessages();
    messages.unshift(message);
    localStorage.setItem('course-contact-messages', JSON.stringify(messages));
}

// Get contact messages from localStorage
function getContactMessages() {
    const stored = localStorage.getItem('course-contact-messages');
    return stored ? JSON.parse(stored) : [];
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);