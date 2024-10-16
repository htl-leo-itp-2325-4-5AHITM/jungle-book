let latitude;
let longitude;
let accuracy;
let coords;
let iframe = "";
let isInRange = false;
const constantDeviation = 150;
const ipAddress = "https://it200247.cloud.htl-leonding.ac.at";
window.checkLocation = checkLocation;

//todo: positionsüberprüfung mit checkpoints aus der datenbank

function getLocationAwait() {
  return new Promise((resolve, reject) => {
    let iframe = document.getElementById("mapIframe");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got position!", position);
          resolve(position.coords);
          coords = position.coords;
          latitude = coords.latitude;
          longitude = coords.longitude;

          var newURL = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;

          iframe.src = newURL;
        },
        (error) => {
          console.error("oops", error);
          reject(error);
          document.getElementById("mapIframe").innerHTML = error.message;
        }
      );
    } else {
      reject(new Error("Geolocation is not supported."));
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

async function checkLocation() {
  let coords = "";
  coords = await getLocation();

  accuracy = coords.accuracy;
  latitude = coords.latitude;
  longitude = coords.longitude;
  console.log("coordinates checkLocation: ", latitude, longitude, accuracy);
  await compareCoordinates(latitude, longitude, accuracy);
  return isInRange;
}

async function getAllCheckpoints() {
  try {
      const response = await fetch(ipAddress + '/api/checkpoint/list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      const checkpoints = await response.json();  // Wandelt die JSON-Antwort in ein Array um
      return checkpoints;  // Das Array mit den Checkpoints wird zurückgegeben
  } catch (error) {
      console.error('Error fetching checkpoints:', error);
  }
}


async function compareCoordinates(lat, lon, acc) {
  getAllCheckpoints().then(async checkpoints => {
    console.log(checkpoints);  
    for (let i = 0; i < checkpoints.length; i++) {
      let lat2 = checkpoints[i].latitude;
      let lon2 = checkpoints[i].longitude;
      const distance = await haversine(lat, lon, lat2, lon2);
      let maxDeviation = constantDeviation + acc;
      console.log(distance + " abstand");
      if (distance <= maxDeviation) {
        console.log("checkpoint found: " + checkpoints[i].name);
        let result =
        "<p>Checkpoint Found: " + checkpoints[i].name + " </p><p>Abweichung: " + Math.round(distance * 100) / 100 + " Meter</p>";
        document.getElementById("resultMap").innerHTML = result;
        isInRange = true;
        return distance <= maxDeviation;
      } else {
        isInRange = false;
        console.log("no checkpoint found");
      }
    }
  });
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

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Entfernung in Kilometern


  return distance * 1000; // Entfernung in Metern
}