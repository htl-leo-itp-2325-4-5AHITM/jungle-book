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
        // Build the routes with checkpoint names and unique classes
        for (const route in routes) {
            const routeInfo = routes[route];
            const checkpointNames = routeInfo.slice(1).map((id, index) => {
                const checkpointName = checkpointMap[id] || `Unknown ID: ${id}`;
                // Use route and checkpoint index to form a unique ID for each checkpoint
                const checkpointId = `route${route}_checkpoint${index + 1}`;
                return `<div onclick="redirectToRoute('${checkpointId}')" class="details" id="${checkpointId}"><p>${checkpointName}</p></div>`;
            });

            routesHTML += `
                <div class="routes" id="route${route}" onclick="toggleDetails(${route})">
                    <div class="routeName"><span>${routeInfo[0]}</span></div>
                    <div class="detailBox" id="details${route}" style="display: none;">
                        ${checkpointNames.join("")}
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
        detailsElement.style.display = "block";
    } else {
        detailsElement.style.display = "none"; 
    }
}

function redirectToRoute(checkpointId) {
    const [routeId, checkpoint] = checkpointId.split('_').map(item => item.replace(/\D/g, ''));
    window.location.href = `home-new.html?route=${routeId}&checkpoint=${checkpoint}`;
}


document.addEventListener("DOMContentLoaded", loadRoutes);
