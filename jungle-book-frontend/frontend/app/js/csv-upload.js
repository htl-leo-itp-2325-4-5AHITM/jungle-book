function loadCsvFile () {
    document.getElementById('file-upload').addEventListener('change', function() {
        const filePath = this.value;
        const allowedExtensions = /(\.csv)$/i;

        if (!allowedExtensions.exec(filePath)) {
            document.getElementById('message').innerText = 'Bitte wähle eine gültige CSV-Datei.';
            this.value = '';
            return false;
        } else {
            document.getElementById('message').innerText = '';
        }
    });

    document.getElementById('upload-btn').addEventListener('click', function() {
        const fileInput = document.getElementById('file-upload');

        if (fileInput.files.length === 0) {
            document.getElementById('message').innerText = 'Bitte wähle eine CSV-Datei aus.';
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function(event) {
            const csvData = event.target.result;

            console.log("CSV-Daten:", csvData);

            try {
                await fetch('https://it200247.cloud.htl-leonding.ac.at/api/checkpoint/add-checkpoints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: csvData
                })
                .then(data => {
                    console.log('Erfolgreich hochgeladen:', data);
                    document.getElementById('message').innerText = 'Datei erfolgreich hochgeladen!';
                })
            } catch(error) {
                console.error('Fehler beim Hochladen:', error);
                document.getElementById('message').innerText = 'Fehler beim Hochladen der Datei.';
            }
        };

        reader.onerror = function() {
            document.getElementById('message').innerText = 'Fehler beim Lesen der Datei.';
        };

        reader.readAsText(file);
    });
}
