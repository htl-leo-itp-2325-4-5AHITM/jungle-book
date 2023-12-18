let latitude;
let longitude;
let accuracy;
let txt = "";
let coords;
let iframe = "";

function getLocation() {
    iframe = document.getElementById('mapIframe');

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(succsess, error);
    } 
    else {
        document.getElementById("mapIframe").innerHTML = "error";
    }
}
function error(error) {
    document.getElementById("mapIframe").innerHTML = error.message;
    
}

function succsess(position) {
    coords = position.coords;  
    latitude = coords.latitude;
    longitude = coords.longitude;
    accuracy = coords.accuracy;
    
    var newURL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2655.789794695176!2d' +
    longitude + '!3d' + latitude +
    '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477396fb96f68367%3A0xf2b265395a736637!2sHTL%20Leonding!5e0!3m2!1sde!2sat!4v1700938059421!5m2!1sde!2sat';
    iframe.src = newURL; 
}
