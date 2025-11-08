// Course data array
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 110,
        title: 'Programming Building Blocks',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 212,
        title: 'Programming with Data Structures',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Web Frontend Development I',
        credits: 2,
        completed: false
    }
];

// DOM elements
const courseCardsContainer = document.querySelector('.course-cards');
const totalCreditsSpan = document.getElementById('total-credits');
const allCoursesBtn = document.getElementById('all-courses');
const wddCoursesBtn = document.getElementById('wdd-courses');
const cseCoursesBtn = document.getElementById('cse-courses');

// Filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// Function to display courses
function displayCourses(filter = 'all') {
    // Clear current courses
    courseCardsContainer.innerHTML = '';

    // Filter courses based on selection
    let filteredCourses = courses;
    if (filter === 'wdd') {
        filteredCourses = courses.filter(course => course.subject === 'WDD');
    } else if (filter === 'cse') {
        filteredCourses = courses.filter(course => course.subject === 'CSE');
    }

    // Calculate total credits
    const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
    totalCreditsSpan.textContent = totalCredits;

    // Create course cards
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;

        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <div class="course-meta">
                <span>${course.credits} credits</span>
                <span>${course.completed ? 'Completed' : 'In Progress'}</span>
            </div>
        `;

        courseCardsContainer.appendChild(card);
    });
}

// Event listeners for filter buttons
allCoursesBtn.addEventListener('click', () => {
    setActiveButton(allCoursesBtn);
    displayCourses('all');
});

wddCoursesBtn.addEventListener('click', () => {
    setActiveButton(wddCoursesBtn);
    displayCourses('wdd');
});

cseCoursesBtn.addEventListener('click', () => {
    setActiveButton(cseCoursesBtn);
    displayCourses('cse');
});

// Function to set active button
function setActiveButton(activeButton) {
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Initialize with all courses displayed
displayCourses('all');