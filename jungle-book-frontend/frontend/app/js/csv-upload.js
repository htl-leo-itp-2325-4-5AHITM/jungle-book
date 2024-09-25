document.getElementById('file-upload').addEventListener('change', function() {
    const filePath = this.value;
    const allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(filePath)) {
        document.getElementById('message').innerText = 'Please choose a valid CSV file.';
        this.value = '';
        return false;
    } else {
        document.getElementById('message').innerText = '';
    }
});

document.getElementById('upload-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('file-upload');
    
    if (fileInput.files.length === 0) {
        document.getElementById('message').innerText = 'Please select a csv file.';
        return;
    }

    const file = fileInput.files[0];
    console.log("UPLOAD PROZESS...");

    const formData = new FormData();
    formData.append('file', file);

    fetch('WHAT URL FOR BACKEND??', { 
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Successfully uploaded:', data);
        document.getElementById('message').innerText = 'File successfully uploaded!';
    })
    .catch((error) => {
        console.error('Error during upload:', error);
        document.getElementById('message').innerText = 'Error uploading the file.';
    }); 
});
