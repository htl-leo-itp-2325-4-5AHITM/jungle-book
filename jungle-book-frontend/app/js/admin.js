const ipAddress = "http://138.2.138.238:8000";

window.addEventListener('load', () => {
    reload();
});

function reload() {
    getAllCheckpoints().then(r => displayCheckpoints(r));
}

async function getAllCheckpoints() {
    try {
        const response = await fetch(`${ipAddress}/api/checkpoint/list`, {
            method: 'GET'
        });

        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the checkpoints:', error);
    }
}

async function deleteCheckpoint(id) {
    console.log(id);
    const response = await fetch(`${ipAddress}/api/checkpoint/remove-checkpoint/${id}`, {
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
    checkpointTable.innerHTML = '<tr><th>ID</th><th>Name</th><th>Längengrad</th><th>Breitengrad</th><th>Löschen</th></tr>';

    const start = currentPage * CheckpointsPerPage;
    const end = start + CheckpointsPerPage;

    for (let i = start; i < end; i++) {
        const checkpoint = checkpoints[i];
        checkpointTable.innerHTML += `<tr><td>${checkpoint.id}</td><td>${checkpoint.name}</td><td>${checkpoint.longitude}</td><td>${checkpoint.latitude}</td><td><button onclick='deleteCheckpoint("${checkpoint.id}")'>Löschen</button></td></tr>`;
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