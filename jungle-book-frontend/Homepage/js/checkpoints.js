window.addEventListener('load', () => {
    reload();
});

function reload() {
    getAllCheckpoints().then(r => displayCheckpoints(r));
}

async function getAllCheckpoints() {
    try {
        const response = await fetch('https://student.cloud.htl-leonding.ac.at/m.schablinger/api/checkpoint/list', {
            method: 'GET'
        });

        return response.json();
    } catch (error) {
        console.error('There was a problem fetching the checkpoints:', error);
    }
}

function displayCheckpoints(checkpoints) {
    const checkpointTable = document.getElementById('contentBody');
    for (let i = 0; i < checkpoints.length; i++) {
        console.log(i);
        checkpointTable.innerHTML += 
        '<a class="cardLink" href="details.html?id=' + checkpoints[i].id + '">' +
              '<div class="card">' +
                '<div class="imgCard"><img src="../pics/wald' + i + '.jpg" class="img"></div>' +
                '<div class="contentCard">' +
                  '<div class="name">' + checkpoints[i].name + '</div>' +
                  '</div></div></a>';
    }
}