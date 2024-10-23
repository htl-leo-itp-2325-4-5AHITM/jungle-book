const ipAddress4 = "https://it200247.cloud.htl-leonding.ac.at";

window.addEventListener('load', () => {
    reload();
});

function reload() {
    getAllCheckpoints().then(r => displayCheckpoints(r));
}

async function getAllCheckpoints() {
    try {
        const response = await fetch(`${ipAddress4}/api/checkpoint/list`, {
            method: 'GET'
        });

        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the checkpoints:', error);
    }
}

async function deleteCheckpoint(id) {
    console.log(id);
    const response = await fetch(`${ipAddress4}/api/checkpoint/remove-checkpoint/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Checkpoint with ID ${id} successfully removed.`);
    } else {
        console.error('Failed to remove checkpoint.');
    }
    reload();
}

async function editCheckpoint(checkpoint) {
    const response = await fetch('/edit-checkpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: checkpoint
    });

    if (response.ok) {
        console.log('Checkpoint successfully edited.');
    } else {
        console.error('Failed to edit checkpoint.');
    }
}
async function addMultipleCheckpoints() {
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            addCheckpoint(contents);
        };
        reader.readAsText(file);
    }, false);
}
async function addCheckpoint(checkpoints) {
    const response = await fetch('/add-checkpoints', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: checkpoints
    });

    if (response.ok) {
        console.log('Checkpoints successfully added.');
    } else {
        console.error('Failed to add checkpoints.');
    }
}

let currentPage = 0;
const CheckpointsPerPage = 5;
let totalCheckpoints = 0;

function displayCheckpoints(checkpoints) {
    totalCheckpoints = checkpoints.length;

    const checkpointTable = document.getElementById('checkpointTable');
    checkpointTable.innerHTML = '<tr><th class="col1">ID</th> <th class="col2">Name</th> <th class="col3">Längengrad</th> <th class="col4">Breitengrad</th> <th class="col5"><img src="../pics/mulleimer.png"></th></tr>';

    const start = currentPage * CheckpointsPerPage;
    const end = start + CheckpointsPerPage;

    for (let i = start; i < end; i++) {
        const checkpoint = checkpoints[i];
        checkpointTable.innerHTML += `<tr><td class="col1">${checkpoint.id}</td><td class="col2">${checkpoint.name}</td><td class="col3">${checkpoint.longitude}</td><td class="col4">${checkpoint.latitude}</td><td class="col5"><button onclick='deleteCheckpoint("${checkpoint.id}")'><img src="../pics/delete.svg" width="16px"></button></td></tr>`;
    }
}

function changePage(direction) {
    const nextPage = currentPage + direction;
    let maxPage = Math.ceil(totalCheckpoints / CheckpointsPerPage) - 1;
    if (nextPage >= 0 && nextPage <= maxPage) {
        currentPage = nextPage;
        reload();
    }
}
