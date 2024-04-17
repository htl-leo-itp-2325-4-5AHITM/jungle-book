async function getAllCheckpoints() {
    try {
        const response = await fetch('/get-checkpoints', {
            method: 'GET'
        });

        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the checkpoints:', error);
    }
}

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