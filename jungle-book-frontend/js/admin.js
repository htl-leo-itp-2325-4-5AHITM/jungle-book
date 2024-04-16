
    function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

    function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

    document.getElementById('downloada').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

    document.getElementById('fileInput').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
    alert('Die ausgewählte Datei ist: ' + file.name);
} else {
    alert('Bitte wählen Sie eine CSV-Datei aus.');
}
});