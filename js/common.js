// =====================================
// Plant Care System
// common.js
// =====================================

// Load Dashboard Statistics
function loadDashboard() {

    const plants =
        JSON.parse(localStorage.getItem("plants")) || [];

    const watering =
        JSON.parse(localStorage.getItem("watering")) || [];

    const reminders =
        JSON.parse(localStorage.getItem("reminders")) || [];

    // Dashboard Cards

    const plantCard =
        document.getElementById("totalPlants");

    if (plantCard) {

        plantCard.innerHTML = plants.length;

    }

    const wateringCard =
        document.getElementById("totalWatering");

    if (wateringCard) {

        wateringCard.innerHTML = watering.length;

    }

    const reminderCard =
        document.getElementById("totalReminders");

    if (reminderCard) {

        reminderCard.innerHTML = reminders.length;

    }

}

// =====================================
// Today's Date
// =====================================

function showTodayDate() {

    const dateElement =
        document.getElementById("todayDate");

    if (!dateElement) return;

    const today = new Date();

    dateElement.innerHTML =
        today.toDateString();

}

// =====================================
// Greeting Message
// =====================================

function greeting() {

    const greet =
        document.getElementById("greeting");

    if (!greet) return;

    const hour = new Date().getHours();

    if (hour < 12) {

        greet.innerHTML =
            "🌞 Good Morning";

    }

    else if (hour < 17) {

        greet.innerHTML =
            "🌤 Good Afternoon";

    }

    else {

        greet.innerHTML =
            "🌙 Good Evening";

    }

}

// =====================================
// Recent Activity
// =====================================

function loadActivity() {

    const activity =
        document.getElementById("recentActivity");

    if (!activity) return;

    activity.innerHTML = "";

    const plants =
        JSON.parse(localStorage.getItem("plants")) || [];

    plants.slice(-5).reverse().forEach(function (plant) {

        activity.innerHTML += `

        <li>

        🌿 ${plant.name} added

        </li>

        `;

    });

}

// =====================================
// Confirm Delete
// =====================================

function confirmDelete(message) {

    return confirm(message);

}

// =====================================
// Initialize Dashboard
// =====================================

window.onload = function () {

    loadDashboard();

    showTodayDate();

    greeting();

    loadActivity();

};