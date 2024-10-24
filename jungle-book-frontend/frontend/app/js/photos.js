const ipAddress = "https://it200247.cloud.htl-leonding.ac.at";

console.log("uploadImage loaded")

addEventListenerToButton();
addEventListenerToButtonsAndInputField();

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

async function uploadImage() {
    console.log("upload Image");
    console.log(window.checkLocation)
    if(await window.checkLocation() == true) {  
        console.log("drinnen")
        let canvas = document.getElementById("canvas");
        const dataURL = canvas.toDataURL("image/jpg");
        let imageName = document.getElementById("nameInput").value;
        // Remove the prefix from the dataUrl
        const base64Data = dataURL.replace('data:image/png;base64,', '');

        // Convert base64 to raw binary data held in a string
        const byteCharacters = atob(base64Data);
        
        // Convert raw binary to an array of 8-bit unsigned integers
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        console.log(imageName);

        // Convert the array to a Blob
        const blob = new Blob([new Uint8Array(byteNumbers)], {type: 'image/jpg'});
        let formData = new FormData();
        formData.append("file", blob);
        formData.append("filename", imageName);

        console.log(formData);
        console.log(blob);


        // Send the Blob to the server
        fetch(ipAddress + '/api/journal/upload-photo', {
        method: 'POST',
        body: formData
        });

        canvas.style.display = "none";
        document.getElementById("nameInput").value = "";
    } else {
        return;
    }
}
    
async function getAllImageNames() {
    try {
        let response = await fetch('https://it200247.cloud.htl-leonding.ac.at/api/journal/list');
        if (!response.ok) {
            throw new Error('Failed to fetch image names');
        }
        let imageList = await response.json(); // Hier wird die Liste von Journals erwartet
        console.log(imageList);
        return imageList; // Liste aller Journals, inklusive der Bildnamen
    } catch (error) {
        console.error('Error fetching image names:', error);
    }
}

// Funktion um ein Bild anhand seines Namens zu holen
async function getImageByID(id) {
    try {
        let response = await fetch(`https://it200247.cloud.htl-leonding.ac.at/api/image/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        
        // Bild als Blob erhalten und URL erstellen
        let imageBlob = await response.blob();
        let imageURL = URL.createObjectURL(imageBlob);

        return imageURL;  // Gebe die Bild-URL zurück
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

// Funktion um alle Bilder anzuzeigen
async function displayAllImages() {
    console.log("get images");
    let imageList = await getAllImageNames();  // Hole  die Bildnamen
    const gallery = document.getElementById('imageGallery');

    if (imageList && imageList.length > 0) {
        for (let journal of imageList) {
            let id = journal.id; // Verwende jetzt 'imageName' anstelle von 'imageId'
            console.log(id);
            let imageURL = await getImageByID(id); // Hole das Bild mit dem Namen

            // Erstelle ein <img> Element für jedes Bild und füge es zur Galerie hinzu
            if (imageURL) {
                let imgElement = document.createElement('img');
                imgElement.src = imageURL;
                imgElement.alt = imageName;  // Alt-Text ist jetzt der Bildname
                gallery.appendChild(imgElement); // Füge das Bild in die Galerie ein
            }
        }
    } else {
        // Wenn keine Bilder vorhanden sind, zeige eine Nachricht an
        gallery.innerHTML = '<p>No images found.</p>';
    }
}