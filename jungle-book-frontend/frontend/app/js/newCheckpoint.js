const nameCheckpoint = document.getElementById('name');
const longitude = document.getElementById('longitude');
const latitude = document.getElementById('latitude');
const comment = document.getElementById('comment');
const note = document.getElementById('note');
const ipAddress = "http://138.2.138.238:8000";

const ERROR_STYLE = { border: '2px solid darkred', boxShadow: '0px 0px 8px rgba(0,0,0,0.5)' };
const NORMAL_STYLE = { border: '2px solid #ccc', boxShadow: '0px 0px 8px rgba(0,0,0,0.1)' };

async function addCheckpoint() {
    let checkpointData;
    checkpointData = {
            name: nameCheckpoint.value, 
            longitude: longitude.value,
            latitudet: latitude.value,
            comment: comment.value,
            note: note.value
    };        

    // check if all fields are filled
    if (!checkInputFields()) {
        applyErrorStyle([nameCheckpoint, longitude, latitude, comment, note]);
        console.log(toggleErrorMessage('error-message', true));

        [nameCheckpoint, longitude, latitude, comment, note].forEach((element, idx) => {
            // add event listener to each input field
            addInputListener(element, 'error-message', idx === 1 ? 'focus' : 'input');
        });

        return;
    }
    if (!nameCheckpoint.value || !longitude.value || !latitude.value || !comment.value || !note.value) {
        applyErrorStyle([
            !nameCheckpoint.value ? nameCheckpoint : null, 
            !longitude.value ? longitude : null,
            !latitude.value ? latitude : null,
            !comment.value ? comment : null,
            !note.value ? note : null,].filter(Boolean));
        toggleErrorMessage('checkpoint-error-message', true);

        if (!nameCheckpoint.value) addInputListener(heading, 'checkpoint-error-message', 'input');
        if (!longitude.value) addInputListener(longitude, 'checkpoint-error-message', 'input');
        if (!latitude.value) addInputListener(latitude, 'checkpoint-error-message', 'input');
        if (!comment.value) addInputListener(comment, 'checkpoint-error-message', 'input');
        if (!note.value) addInputListener(note, 'checkpoint-error-message', 'input');

        return;
    }

    if (confirm('Checkpoint hinzufügen?')) try {
        let string = nameCheckpoint.value + ';' + longitude.value + ';' + latitude.value + ';' + comment.value + ';' + note.value;
        const response = await fetch(ipAddress + '/api/checkpoint/add-checkpoints', 
        {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: string
        } 
    )    
    clearForm();
    window.location.href='adminpage-new.html'
    } catch (error) {
        console.error('Error during adding:', error.message);
    }
}

function clearForm() {
    nameCheckpoint.value = '';
    longitude.value = '';
    latitude.value = '';
    comment.value = '';
    note.value = '';
}

function checkInputFields() {
    return nameCheckpoint.value || longitude.value || latitude.value || comment.value || note.value > 0;
}

function addInputListener(element, errorElementId, eventType) {
    element.addEventListener(eventType, () => {
        toggleErrorMessage(errorElementId, false);
        applyNormalStyle([element]);
    });
}

function toggleErrorMessage(elementId, show) {
    document.getElementById(elementId).style.display = show ? 'block' : 'none';
}

function setStyle(element, style) {
    element.style.transition = 'border 0.5s, box-shadow 0.5s';
    element.style.border = style.border;
    element.style.boxShadow = style.boxShadow;
}

function applyErrorStyle(elements) {
    elements.forEach(el => setStyle(el, ERROR_STYLE));

    setTimeout(() => {
        elements.forEach(el => setStyle(el, NORMAL_STYLE));
    }, 1500);
}

function applyNormalStyle(elements) {
    elements.forEach(el => setStyle(el, NORMAL_STYLE));
}
