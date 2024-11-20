const routes = {
    1: ["Leonding", 101, 151],
    2: ["Europa", 110, 111],
    3: ["Bodendorf", 152]
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
        let routesHTML = "";
    
    // Loop through each route
    for (const route in routes) {
        const routeInfo = routes[route];
        const routeName = routeInfo[0];
        
        // Generate checkpoints HTML
        const checkpointNames = routeInfo.slice(1).map((id, index) => {
            const checkpointName = checkpointMap[id] || `Unknown ID: ${id}`;
            
            // Generate unique checkpointId
            const checkpointId = `route${route}_checkpoint${id}`; // Using `id` directly as it is the actual checkpoint ID
            
            // Return HTML for the checkpoint
            return `<div onclick="redirectToRoute(${route}, ${id})" class="details" id="${checkpointId}">
                        <p>${checkpointName}</p>
                    </div>`;
        });

        // Add the route and its checkpoints to the HTML
        routesHTML += `
            <div class="routes" id="route${route}" onclick="toggleDetails(${route})">
                <div class="routeName"><span>${routeName}</span></div>
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

function redirectToRoute(routeId, checkpointId) {
    window.location.href = `home-new.html?route=${routeId}&id=${checkpointId}`;
}


document.addEventListener("DOMContentLoaded", loadRoutes);
