// ======================================
// Plant Care System
// plants.js
// ======================================

// Load plants
let plants = JSON.parse(localStorage.getItem("plants")) || [];

// Editing ID
let editId = null;

// Load page
window.onload = function () {
    displayPlants();
};

// ==============================
// Add / Update Plant
// ==============================

function addPlant() {

    const name = document.getElementById("plantName").value.trim();
    const type = document.getElementById("plantType").value;
    const location = document.getElementById("plantLocation").value.trim();

    if (name === "" || location === "") {
        alert("Please fill all fields.");
        return;
    }

    if (editId === null) {

        plants.push({

            id: Date.now(),

            name,

            type,

            location

        });

        alert("Plant Added Successfully.");

    } else {

        plants.forEach(function (plant) {

            if (plant.id === editId) {

                plant.name = name;
                plant.type = type;
                plant.location = location;

            }

        });

        editId = null;

        document.querySelector("button").innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Plant';

        alert("Plant Updated Successfully.");

    }

    savePlants();

    clearForm();

    displayPlants();

}

// ==============================
// Display Plants
// ==============================

function displayPlants() {

    const table = document.getElementById("plantTable");

    table.innerHTML = "";

    if (plants.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="5">

                No plants found.

            </td>

        </tr>

        `;

        document.getElementById("plantCount").innerHTML = 0;

        return;

    }

    plants.forEach(function (plant, index) {

        table.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${plant.name}</td>

            <td>${plant.type}</td>

            <td>${plant.location}</td>

            <td>

                <button onclick="editPlant(${plant.id})">

                    ✏ Edit

                </button>

                <button onclick="deletePlant(${plant.id})">

                    🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("plantCount").innerHTML = plants.length;

}

// ==============================
// Edit Plant
// ==============================

function editPlant(id) {

    const plant = plants.find(p => p.id === id);

    document.getElementById("plantName").value = plant.name;

    document.getElementById("plantType").value = plant.type;

    document.getElementById("plantLocation").value = plant.location;

    editId = id;

    document.querySelector("button").innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Plant';

}

// ==============================
// Delete Plant
// ==============================

function deletePlant(id) {

    if (!confirm("Delete this plant?")) {

        return;

    }

    plants = plants.filter(function (plant) {

        return plant.id !== id;

    });

    savePlants();

    displayPlants();

}

// ==============================
// Search
// ==============================

function searchPlant() {

    const keyword = document
        .getElementById("searchPlant")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#plantTable tr");

    rows.forEach(function (row) {

        row.style.display = row.innerText
            .toLowerCase()
            .includes(keyword)
            ? ""
            : "none";

    });

}

// ==============================
// Save
// ==============================

function savePlants() {

    localStorage.setItem(

        "plants",

        JSON.stringify(plants)

    );

}

// ==============================
// Clear Form
// ==============================

function clearForm() {

    document.getElementById("plantName").value = "";

    document.getElementById("plantType").selectedIndex = 0;

    document.getElementById("plantLocation").value = "";

}