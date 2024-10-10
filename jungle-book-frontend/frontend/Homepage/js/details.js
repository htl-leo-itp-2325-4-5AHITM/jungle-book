window.addEventListener('load', () => {
    reload();
});

const ipAddress = "https://it200247.cloud.htl-leonding.ac.at";

function reload() {
    const id = new URLSearchParams(window.location.search).get("id");
    getOneCheckpoint(id).then(r => displayDetails(r));
}

async function getOneCheckpoint(id) {
    try {
        const response = await fetch(`${ipAddress}/api/checkpoint/` + id, {
            method: 'GET'
        });
        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the checkpoints:', error);
    }
}

function displayDetails(checkpoint) {
    console.log("test");
    const contentWrapper = document.getElementById('contentWrapper');
    contentWrapper.innerHTML = '<div id="content"><div class="info" id="name">' + checkpoint.name + '</div>' +
    '<div class="info" id="latitude">' + checkpoint.latitude + '</div>' +
    '<div class="info" id="longitude">' + checkpoint.longitude + '</div>' +
    '<div class="info" id="comment">' + checkpoint.comment + '</div>' +
    '<div class="info" id="remark">' + checkpoint.note + '</div>' +
    '<div class="info" id="button"><a class="buttonBox" href="./jungles.html"><button class="button">Zurück</button></a></div></div>';
    '<div id="map"><div style="width: 90%"><iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=de&amp;q=' + checkpoint.latitude + ',%20' + checkpoint.longitude + '+('+ checkpoint.name +')&amp;t=k&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/marine-gps/">boat gps</a></iframe></div></div>';
}
