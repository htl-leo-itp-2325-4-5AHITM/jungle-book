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
        let canvas = document.getElementById("canvas");
        const dataURL = canvas.toDataURL("image/jpg");
        let imageName = document.getElementById("nameInput").value;
        
        const urlParams = new URLSearchParams(window.location.search);
        const checkpointId = urlParams.get('id'); 

        imageName += "::" + checkpointId;
        console.log("imageName:" + imageName);

        // Remove the prefix from the dataUrl
        const base64Data = dataURL.replace('data:image/png;base64,', '');

        // Convert base64 to raw binary data held in a string
        const byteCharacters = atob(base64Data);
        
        // Convert raw binary to an array of 8-bit unsigned integers
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

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

async function displayImagesByRoute() {
    console.log("Fetching and displaying images grouped by routes...");
    let imageList = await getAllImageNames(); // Fetch all images
    const gallery = document.getElementById('imageGallery');

    if (imageList && imageList.length > 0) {
        // Create a map to group images by route
        const routeImagesMap = {};

        // Extract IDs from image names and match them to routes
        for (let journal of imageList) {
            const imageName = journal.name; // Assuming `journal.name` contains the name of the image
            const idMatch = imageName.match(/::(\d+)$/); // Match "::id" at the end of the image name
            if (!idMatch) continue; // Skip if no ID is found

            const checkpointId = parseInt(idMatch[1]); // Extract the checkpoint ID as a number

            // Find the route name that contains this checkpoint ID
            for (const route in routes) {
                if (routes[route].includes(checkpointId)) {
                    const routeName = routes[route][0]; // The first item is the route name
                    if (!routeImagesMap[routeName]) {
                        routeImagesMap[routeName] = [];
                    }
                    routeImagesMap[routeName].push({
                        checkpointId, 
                        imageId: journal.id, // Use the image's ID from the server
                        imageName: journal.name
                    });
                    break;
                }
            }
        }

        // Display images grouped by route
        for (const routeName in routeImagesMap) {
            // Add a header for the route name
            const routeHeader = document.createElement('h2');
            routeHeader.textContent = routeName;
        
            // Style the header to span the full grid width
            routeHeader.style.gridColumn = 'span 2';
            gallery.appendChild(routeHeader);
        
            // Add images for the route
            for (const image of routeImagesMap[routeName]) {
                console.log("Image ID:", image.imageId); // Log the image ID for debugging
                const imageURL = await getImageByID(image.imageId); // Fetch image using the server ID
                if (imageURL) {
                    const imgElement = document.createElement('img');
                    imgElement.src = imageURL;
                    imgElement.alt = image.imageName; // Optional: Set the alt attribute
                    gallery.appendChild(imgElement);
                }
            }
        }
        
    } else {
        gallery.innerHTML = '<p>No images found.</p>';
    }
}




async function displayAllImages() {
    console.log("get images");
    let imageList = await getAllImageNames();  
    const gallery = document.getElementById('imageGallery');

    if (imageList && imageList.length > 0) {
        for (let journal of imageList) {
            let id = journal.id; 
            console.log(id);
            let imageURL = await getImageByID(id);

            if (imageURL) {
                let imgElement = document.createElement('img');
                imgElement.src = imageURL;
                //imgElement.alt = imageName;  
                gallery.appendChild(imgElement); 
            }
        }
    } else {
        gallery.innerHTML = '<p>No images found.</p>';
    }
}