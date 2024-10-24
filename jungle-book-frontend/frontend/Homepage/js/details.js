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
    '<div class="info" id="button"><a class="buttonBox" href="./jungles.html"><button class="button">Zurück</button></a></div></div>' +
    '<iframe id="mapIframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13524.156812879364!2d133.7751366022174!3d-25.274398741981396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2cc0bf3b780966a3%3A0xf5dd4fc65b05e9f2!2sSydney%2C%20New%20South%20Wales!5e0!3m2!1sde!2sau!4v1709403819195!5m2!1sde!2sau"' +
    'width="320" height="240" style="border: 0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

    let iframe = document.getElementById("mapIframe");
    var newURL = `https://www.google.com/maps?q=${checkpoint.latitude},${checkpoint.longitude}&hl=es;z=14&output=embed`;
    iframe.src = newURL;

}
