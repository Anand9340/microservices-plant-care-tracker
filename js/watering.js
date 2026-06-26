// ======================================
// Plant Care System
// watering.js
// ======================================

// Load schedules from LocalStorage
let wateringList = JSON.parse(localStorage.getItem("watering")) || [];

// Store editing record ID
let editId = null;

// Load page
window.onload = function () {
    displayWatering();
};

// ======================================
// Add / Update Watering Schedule
// ======================================

function addWatering() {

    const plantName = document.getElementById("plantName").value.trim();
    const wateringDate = document.getElementById("wateringDate").value;
    const status = document.getElementById("status").value;

    if (plantName === "" || wateringDate === "") {
        alert("Please fill all fields.");
        return;
    }

    if (editId === null) {

        wateringList.push({
            id: Date.now(),
            plantName,
            wateringDate,
            status
        });

        alert("Watering Schedule Added Successfully.");

    } else {

        wateringList.forEach(function (item) {

            if (item.id === editId) {

                item.plantName = plantName;
                item.wateringDate = wateringDate;
                item.status = status;

            }

        });

        editId = null;

        document.querySelector(".form-container button").innerHTML =
            '<i class="fa-solid fa-plus"></i> Save Schedule';

        alert("Watering Schedule Updated.");

    }

    saveWatering();

    clearForm();

    displayWatering();

}

// ======================================
// Display Watering
// ======================================

function displayWatering() {

    const table = document.getElementById("wateringTable");

    table.innerHTML = "";

    if (wateringList.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="5">
                No watering schedules found.
            </td>
        </tr>
        `;

        document.getElementById("wateringCount").innerHTML = 0;

        return;

    }

    wateringList.forEach(function (item, index) {

        let badge =
            item.status === "Completed"
                ? '<span class="badge green">Completed</span>'
                : '<span class="badge orange">Pending</span>';

        table.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.plantName}</td>

            <td>${item.wateringDate}</td>

            <td>${badge}</td>

            <td>

                <button onclick="editWatering(${item.id})">

                    ✏ Edit

                </button>

                <button onclick="deleteWatering(${item.id})">

                    🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("wateringCount").innerHTML =
        wateringList.length;

}

// ======================================
// Edit
// ======================================

function editWatering(id) {

    const item = wateringList.find(function (water) {

        return water.id === id;

    });

    document.getElementById("plantName").value =
        item.plantName;

    document.getElementById("wateringDate").value =
        item.wateringDate;

    document.getElementById("status").value =
        item.status;

    editId = id;

    document.querySelector(".form-container button").innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Schedule';

}

// ======================================
// Delete
// ======================================

function deleteWatering(id) {

    if (!confirm("Delete this schedule?")) {

        return;

    }

    wateringList = wateringList.filter(function (item) {

        return item.id !== id;

    });

    saveWatering();

    displayWatering();

}

// ======================================
// Search
// ======================================

function searchWatering() {

    const keyword = document
        .getElementById("searchWatering")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#wateringTable tr");

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

function saveWatering() {

    localStorage.setItem(
        "watering",
        JSON.stringify(wateringList)
    );

}

// ======================================
// Clear Form
// ======================================

function clearForm() {

    document.getElementById("plantName").value = "";

    document.getElementById("wateringDate").value = "";

    document.getElementById("status").selectedIndex = 0;

}