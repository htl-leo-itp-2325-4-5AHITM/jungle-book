let latitude;
let longitude;
let accuracy;
let coords;
let iframe = "";
let isInRange = false;
const konstanteAbweichung = 50;

function getLocationAwait() {
    return new Promise((resolve, reject) => {
        let iframe = document.getElementById('mapIframe');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("Got position!", position)
                    resolve(position.coords);
                    coords = position.coords;  
                    latitude = coords.latitude;
                    longitude = coords.longitude;
                    
                    var newURL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2655.789794695176!2d' +
                    longitude + '!3d' + latitude +
                    '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477396fb96f68367%3A0xf2b265395a736637!2sHTL%20Leonding!5e0!3m2!1sde!2sat!4v1700938059421!5m2!1sde!2sat';
                    iframe.src = newURL;
                },
                error => {
                    console.error("oops", error)
                    reject(error);
                    document.getElementById("mapIframe").innerHTML = error.message;
                }
            );
        } else {
            reject(new Error('Geolocation is not supported.'));
        }
    });
}

async function getLocation() {
    let coords = "";
    try {
        coords = await getLocationAwait();
        console.log(coords);
    } catch (error) {
        console.error(error);
    }
    return coords;
}

const jsonDateiPfad = '/data/checkpoints.json';

async function checkLocation() {
    let coords = "";    
    coords = await getLocation();

    accuracy = coords.accuracy;
    latitude = coords.latitude; 
    longitude = coords.longitude;
    console.log(latitude, longitude, accuracy);
    await compareCoordinates(latitude, longitude, accuracy);
    return isInRange;
}

async function compareCoordinates(lat, lon, acc) {
    let checkpoints = await fetch(jsonDateiPfad)
        .catch(console.error)
        .then(res => res.json());

    for (let i = 0; i < checkpoints.length; i++) {
        let lat2 = checkpoints[i].latitude;
        let lon2 = checkpoints[i].longitude;
        const distance = await haversine(lat, lon, lat2, lon2);
        let maxAbweichung = konstanteAbweichung + acc;
        console.log(distance + " abstand");
        if (distance <= maxAbweichung) {
            console.log("checkpoint found: " + checkpoints[i].name);
            let result = "Checkpoint Found: " + checkpoints[i].name + "<br> Abweichung: " + Math.round(distance * 100) / 100 + " Meter";
            document.getElementById("resultMap").innerHTML = result;
            isInRange = true;
            return distance <= maxAbweichung;
        } else {
            isInRange = false;
            console.log("no checkpoint found");
        }
    }
}

async function haversine(lat1, lon1, lat2, lon2) {
    // Konvertiere Grad in Radian
    function toRadians(deg) {
        return deg * (Math.PI / 180);
    }

    console.log(lat1 + " " + lon1 + " " + lat2 + " " + lon2);

    // Haversine-Formel
    const R = 6371; // Radius der Erde in Kilometern
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Entfernung in Kilometern

    return distance * 1000; // Entfernung in Metern
}
