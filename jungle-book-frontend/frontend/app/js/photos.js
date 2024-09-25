const ipAddress = "http://138.2.138.238:8000";

function addEventListenerToButton() {
    document.getElementById('nameInput').addEventListener('keyup', function() {
        let inputValue = this.value;
        let submitButton = document.getElementById('usePhotoButton');
        if (inputValue && inputValue.trim() !== "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
        console.log("added event listener");
    }); 
}

function addEventListenerToButtonsAndInputField() {
    let canvas = document.getElementById('canvas');
    let button1 = document.getElementById('usePhotoButton');
    let button2 = document.getElementById('dontUsePhotoButton');
    let input = document.getElementById('nameInput');

    const observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            const isCanvasHidden = window.getComputedStyle(canvas).display === 'none';
            const isCanvasEmpty = canvas.children.length === 0;
            console.log(isCanvasEmpty, isCanvasHidden);
            if (!isCanvasHidden || !isCanvasEmpty) {
                button2.disabled = false;
                input.disabled = false;
                addEventListenerToButton();
            } else {
                button1.disabled = true;
                button2.disabled = true;
                input.disabled = true;
            }
        });
    });
    observer.observe(canvas, { attributes: true, childList: true, subtree: true });
    console.log("added event listener2");
}

async function getAllPhotos() {
    try {
        const response = await fetch(`${ipAddress}/api/image`, {
            method: 'GET'
        });
        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the photos:', error);
    }
}

function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]); // Decode the base64 string
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]; // Get the MIME type
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

async function uploadImage() {
    let canvas = document.getElementById('canvas');
    let imageData = canvas.toDataURL("image/jpg");

    let imageName = document.getElementById('nameInput').value.trim().toLowerCase();

    if (!imageName) {
        alert('Please provide an image name.');
        return;
    }

    let imageBlob = dataURLtoBlob(imageData);

    let formData = new FormData();
    formData.append('name', imageName);  
    formData.append('image', imageBlob, `${imageName}.jpg`);  

    try {
        let response = await fetch(ipAddress + `/journal/upload-photo`, {
            method: 'POST',
            headers: {'Content-Type': 'multipart/form-data'},
            body: formData 
        });
        console.log(response)
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(`Image uploaded successfully: ${jsonResponse.message}`);
        } else {
            console.log(`Failed to upload image: ${response.statusText}`);
        }
    } catch (error) {
        console.log('Error uploading image:', error);
    }
}