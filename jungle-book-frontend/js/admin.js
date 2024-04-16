function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

document.getElementById('downloada').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
        alert('Die ausgewählte Datei ist: ' + file.name);
    } else {
        alert('Bitte wählen Sie eine CSV-Datei aus.');
    }
});


async function removeCheckpoint(id) {
    const response = await fetch(`/remove-checkpoint?id=${id}`, {
        method: 'GET'
    });

    if (response.ok) {
        console.log(`Checkpoint with ID ${id} successfully removed.`);
    } else {
        console.error('Failed to remove checkpoint.');
    }
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