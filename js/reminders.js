// ======================================
// Plant Care System
// reminders.js
// ======================================

// Load reminders from LocalStorage
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Editing ID
let editId = null;

// Load page
window.onload = function () {
    displayReminders();
};

// ======================================
// Add / Update Reminder
// ======================================

function addReminder() {

    const plantName = document.getElementById("plantName").value.trim();
    const reminderType = document.getElementById("reminderType").value;
    const reminderDate = document.getElementById("reminderDate").value;

    if (plantName === "" || reminderDate === "") {

        alert("Please fill all fields.");

        return;

    }

    if (editId === null) {

        reminders.push({

            id: Date.now(),

            plantName: plantName,

            reminderType: reminderType,

            reminderDate: reminderDate

        });

        alert("Reminder Added Successfully.");

    } else {

        reminders.forEach(function (item) {

            if (item.id === editId) {

                item.plantName = plantName;

                item.reminderType = reminderType;

                item.reminderDate = reminderDate;

            }

        });

        editId = null;

        document.querySelector(".form-container button").innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Reminder';

        alert("Reminder Updated Successfully.");

    }

    saveReminders();

    clearForm();

    displayReminders();

}

// ======================================
// Display Reminders
// ======================================

function displayReminders() {

    const table = document.getElementById("reminderTable");

    table.innerHTML = "";

    if (reminders.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="5">
                No reminders found.
            </td>
        </tr>
        `;

        document.getElementById("reminderCount").innerHTML = 0;

        return;

    }

    reminders.forEach(function (item, index) {

        let badge = "";

        switch (item.reminderType) {

            case "Watering":
                badge = '<span class="badge green">Watering</span>';
                break;

            case "Fertilizing":
                badge = '<span class="badge orange">Fertilizing</span>';
                break;

            case "Pruning":
                badge = '<span class="badge red">Pruning</span>';
                break;

            case "Sunlight":
                badge = '<span class="badge green">Sunlight</span>';
                break;

            default:
                badge = '<span class="badge orange">Repotting</span>';

        }

        table.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.plantName}</td>

            <td>${badge}</td>

            <td>${item.reminderDate}</td>

            <td>

                <button onclick="editReminder(${item.id})">

                    ✏ Edit

                </button>

                <button onclick="deleteReminder(${item.id})">

                    🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("reminderCount").innerHTML = reminders.length;

}

// ======================================
// Edit Reminder
// ======================================

function editReminder(id) {

    const item = reminders.find(function (reminder) {

        return reminder.id === id;

    });

    document.getElementById("plantName").value = item.plantName;

    document.getElementById("reminderType").value = item.reminderType;

    document.getElementById("reminderDate").value = item.reminderDate;

    editId = id;

    document.querySelector(".form-container button").innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Reminder';

}

// ======================================
// Delete Reminder
// ======================================

function deleteReminder(id) {

    if (!confirm("Delete this reminder?")) {

        return;

    }

    reminders = reminders.filter(function (item) {

        return item.id !== id;

    });

    saveReminders();

    displayReminders();

}

// ======================================
// Search Reminder
// ======================================

function searchReminder() {

    const keyword = document
        .getElementById("searchReminder")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#reminderTable tr");

    rows.forEach(function (row) {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

    });

}

// ======================================
// Save LocalStorage
// ======================================

function saveReminders() {

    localStorage.setItem(

        "reminders",

        JSON.stringify(reminders)

    );

}

// ======================================
// Clear Form
// ======================================

function clearForm() {

    document.getElementById("plantName").value = "";

    document.getElementById("reminderType").selectedIndex = 0;

    document.getElementById("reminderDate").value = "";

}