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
        const base64Data = dataURL.replace('data:image/png;base64,', '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([new Uint8Array(byteNumbers)], {type: 'image/jpg'});
        let formData = new FormData();
        formData.append("file", blob);
        formData.append("filename", imageName);

        console.log(formData);
        console.log(blob);

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
        let response = await fetch(`${ipAddress}/api/journal/list`);
        if (!response.ok) {
            throw new Error('Failed to fetch image names');
        }
        let imageList = await response.json();
        console.log(imageList);
        return imageList; 
    } catch (error) {
        console.error('Error fetching image names:', error);
    }
}

async function getImageByID(id) {
    try {
        let response = await fetch(`${ipAddress}/api/image/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        
        let imageBlob = await response.blob();
        let imageURL = URL.createObjectURL(imageBlob);

        return imageURL; 
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

async function displayImagesByRoute() {
    console.log("Fetching and displaying images grouped by routes...");
    let imageList = await getAllImageNames(); 
    const gallery = document.getElementById('imageGallery');

    if (imageList && imageList.length > 0) {
        const routeImagesMap = {};
        for (let journal of imageList) {
            const imageName = journal.name; 
            const idMatch = imageName.match(/::(\d+)$/); 
            if (!idMatch) continue; 

            const checkpointId = parseInt(idMatch[1]); 

            for (const route in routes) {
                if (routes[route].includes(checkpointId)) {
                    const routeName = routes[route][0];
                    if (!routeImagesMap[routeName]) {
                        routeImagesMap[routeName] = [];
                    }
                    routeImagesMap[routeName].push({
                        checkpointId, 
                        imageId: journal.id,
                        imageName: journal.name
                    });
                    break;
                }
            }
        }

        for (const routeName in routeImagesMap) {
            const routeHeader = document.createElement('h2');
            routeHeader.textContent = routeName;
            gallery.appendChild(routeHeader);
        
            for (const image of routeImagesMap[routeName]) {
                console.log("Image ID:", image.imageId); 
                const imageURL = await getImageByID(image.imageId);
                if (imageURL) {
                    const imgElement = document.createElement('img');
                    imgElement.src = imageURL;
                    imgElement.alt = image.imageName;
                    imgElement.classList.add('image-container');
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
                imgElement.classList.add('image-container');
                gallery.appendChild(imgElement); 
            }
        }
    } else {
        gallery.innerHTML = '<p>No images found.</p>';
    }
}

function exportToPDF() {
    let pdfBox = document.getElementById("imageGallery");

    if (!pdfBox) {
        console.error("Das HTML-Element mit der ID 'imageGallery' wurde nicht gefunden.");
        return;
    }

    let startPage = document.createElement("div");
    startPage.style.position = "relative";
    startPage.style.textAlign = "center";
    startPage.style.margin = "0";
    startPage.style.padding = "50px";
    startPage.style.height = "297mm"; 
    startPage.style.width = "210mm"; 
    startPage.style.backgroundImage = "url('../pics/background.jpg')";
    startPage.style.backgroundSize = "cover";
    startPage.style.backgroundPosition = "center";
    startPage.style.backgroundRepeat = "no-repeat";
    startPage.style.color = "white !important"; 
    startPage.style.display = "flex";
    startPage.style.flexDirection = "column";
    startPage.style.alignItems = "center";
    startPage.style.justifyContent = "flex-end"; 

    startPage.innerHTML = 
        `<h1 style="font-size: 128px; margin-top: 50px; color: white !important;">Fotobuch</h1>
         <p style="font-size: 40px; color: white; margin-bottom: 10px;">Willkommen zu meinem Junglebuch!</p>
         <p style="font-size: 14px; color: white; margin-bottom: 10px;">Erstellt am: ${new Date().toLocaleDateString()}</p>`;

    let images = pdfBox.querySelectorAll("img");
    let loadedPromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = reject;
            }
        });
    });

    Promise.all(loadedPromises).then(() => {
        let combinedContent = document.createElement("div");
        combinedContent.appendChild(startPage);
        combinedContent.appendChild(pdfBox.cloneNode(true));

        let options = {
            margin: [0, 0, 0, 0],
            filename: "Fotobuch.pdf",
            image: { type: "jpg", quality: 1 },
            html2canvas: {
                scale: 3,  
                useCORS: true 
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: {
                mode: ['avoid-all'] 
            }
        };

        html2pdf().set(options).from(combinedContent).save();
    }).catch(error => {
        console.error("Einige Bilder konnten nicht geladen werden:", error);
    });
}

async function getPdf() {
    try {
        const response = await fetch(`${ipAddress}/api/journal/get-pdf`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const pdfBlob = await response.blob();

        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'fotobuch.pdf';
        link.click();
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
        console.error('Error fetching or opening the PDF:', error);
    }
}

function set3Columns () {
    const allImageContainers = document.getElementsByClassName("image-container");
    for (let i = 0; i < allImageContainers.length; i++) {
        allImageContainers[i].style.flexBasis = "33.3%";  
    }
}
  
function set2Columns () {
    const allImageContainers = document.getElementsByClassName("image-container");
    for (let i = 0; i < allImageContainers.length; i++) {
        allImageContainers[i].style.flexBasis = "50%";  
    }
}
  