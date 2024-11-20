const routes = {
    1: ["Leonding", 101, 151],
    2: ["Europa", 110, 111]
};

async function loadRoutes() {
    const routesContainer = document.getElementById("routesList");
    let routesHTML = "";

    try {
        // Fetch all checkpoints
        const checkpoints = await getAllCheckpoints();

        // Create a mapping of checkpoint IDs to names for easy lookup
        const checkpointMap = {};
        checkpoints.forEach(checkpoint => {
            checkpointMap[checkpoint.id] = checkpoint.name;
            console.log(checkpoint.name)
        });

        // Build the routes list with checkpoint names
        for (const route in routes) {
            const routeInfo = routes[route];
            const checkpointNames = routeInfo.slice(1).map(id => checkpointMap[id] || `Unknown ID: ${id}`);

            routesHTML += `
                <div class="routes" id="route${route}" onclick="toggleDetails(${route})">
                    <div class="routeName"><span>${routeInfo[0]}</span></div>
                    <div class="detailBox" id="details${route}" style="display: none;">
                        ${checkpointNames.map(name => `<div class="details"><p>${name}</p></div>`).join("")}
                    </div>
                </div>
            `;
        }

        routesContainer.innerHTML = routesHTML;
    } catch (error) {
        console.error("Error loading routes:", error);
    }
}

function toggleDetails(route) {
    const detailsElement = document.getElementById(`details${route}`);
    if (detailsElement.style.display === "none") {
        detailsElement.style.display = "block"; // Show details
    } else {
        detailsElement.style.display = "none"; // Hide details
    }
}

document.addEventListener("DOMContentLoaded", loadRoutes);
