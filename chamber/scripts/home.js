// Set copyright year and last modified date
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Weather API Configuration - Using OpenWeatherMap API
const WEATHER_API_KEY = '94f7044be7e3b382005afd120e01a26d'; // Your OpenWeatherMap API key
const KIGALI_LAT = -1.9536;
const KIGALI_LON = 30.0606;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${KIGALI_LAT}&lon=${KIGALI_LON}&units=metric&appid=${WEATHER_API_KEY}`;
const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${KIGALI_LAT}&lon=${KIGALI_LON}&units=metric&appid=${WEATHER_API_KEY}`;

// Fetch current weather
async function getCurrentWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Weather API Error:', errorData);

            if (response.status === 401) {
                throw new Error('API key not activated yet. Please wait 10-120 minutes after creation.');
            } else {
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
        }

        const data = await response.json();
        console.log('Weather data received:', data);
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        document.getElementById('current-weather-content').innerHTML =
            `<p style="color: red; font-size: 0.9rem;">⚠️ ${error.message}<br><br>If you just created your API key, please wait up to 2 hours for activation.</p>`;
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const weatherHTML = `
        <div class="weather-info">
            <div class="temperature">${temp}°C</div>
            <div class="description">${description}</div>
            <div class="details">
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
            </div>
        </div>
    `;

    document.getElementById('current-weather-content').innerHTML = weatherHTML;
}

// Fetch 3-day forecast
async function getForecast() {
    try {
        const response = await fetch(FORECAST_API_URL);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Forecast API Error:', errorData);

            if (response.status === 401) {
                throw new Error('API key not activated yet. Please wait 10-120 minutes after creation.');
            } else {
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
        }

        const data = await response.json();
        console.log('Forecast data received:', data);
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        document.getElementById('forecast-content').innerHTML =
            `<p style="color: red; font-size: 0.9rem;">⚠️ ${error.message}<br><br>If you just created your API key, please wait up to 2 hours for activation.</p>`;
    }
}

// Display 3-day forecast
function displayForecast(data) {
    // Get forecast for the next 3 days at noon
    const dailyForecasts = [];
    const processedDays = new Set();

    // Filter to get one forecast per day (prefer midday forecasts)
    data.list.forEach(item => {
        const forecastDate = new Date(item.dt * 1000);
        const dateString = forecastDate.toDateString();

        // Skip if we already have this day or have 3 days
        if (!processedDays.has(dateString) && dailyForecasts.length < 3) {
            // Prefer forecasts around noon (10 AM - 2 PM)
            const hour = forecastDate.getHours();
            if (hour >= 10 && hour <= 14) {
                dailyForecasts.push(item);
                processedDays.add(dateString);
            }
        }
    });

    // If we don't have 3 forecasts yet, add any remaining days
    if (dailyForecasts.length < 3) {
        data.list.forEach(item => {
            const forecastDate = new Date(item.dt * 1000);
            const dateString = forecastDate.toDateString();

            if (!processedDays.has(dateString) && dailyForecasts.length < 3) {
                dailyForecasts.push(item);
                processedDays.add(dateString);
            }
        });
    }

    let forecastHTML = '<div class="forecast-grid">';

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;

        forecastHTML += `
            <div class="forecast-day">
                <div class="day-name">${dayName}</div>
                <div class="day-temp">${temp}°C</div>
                <div class="day-desc">${description}</div>
            </div>
        `;
    });

    forecastHTML += '</div>';
    document.getElementById('forecast-content').innerHTML = forecastHTML;
}

// Fetch and display member spotlights
async function getMemberSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displaySpotlights(data.members);
    } catch (error) {
        console.error('Error fetching members:', error);
        document.getElementById('spotlights-container').innerHTML =
            '<p style="text-align: center; color: red;">Error loading spotlights. Please try again later.</p>';
    }
}

// Display random gold or silver member spotlights
function displaySpotlights(members) {
    // Filter for gold (3) and silver (2) members only
    const qualifiedMembers = members.filter(member =>
        member.membershipLevel === 2 || member.membershipLevel === 3
    );

    // Randomly select 2-3 members
    const numberOfSpotlights = Math.random() > 0.5 ? 3 : 2;
    const selectedMembers = getRandomMembers(qualifiedMembers, numberOfSpotlights);

    const spotlightsContainer = document.getElementById('spotlights-container');
    spotlightsContainer.innerHTML = '';

    selectedMembers.forEach(member => {
        const spotlightCard = createSpotlightCard(member);
        spotlightsContainer.appendChild(spotlightCard);
    });
}

// Get random members from array
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Create spotlight card
function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.classList.add('spotlight-card');

    // Determine membership level badge
    const membershipLevels = {
        2: { class: 'membership-silver', text: 'Silver Member' },
        3: { class: 'membership-gold', text: 'Gold Member' }
    };

    const membershipInfo = membershipLevels[member.membershipLevel];

    card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
        <h3>${member.name}</h3>
        <p class="category">${member.category}</p>
        <p class="description">${member.description}</p>
        <div class="contact-info">
            <p><strong>📍</strong> ${member.address}</p>
            <p><strong>📞</strong> ${member.phone}</p>
            <p><strong>🌐</strong> <a href="${member.website}" target="_blank">Visit Website</a></p>
        </div>
        <span class="membership-badge ${membershipInfo.class}">${membershipInfo.text}</span>
    `;

    return card;
}

// Initialize page
async function initializePage() {
    await getCurrentWeather();
    await getForecast();
    await getMemberSpotlights();
}

// Run initialization when page loads
initializePage();