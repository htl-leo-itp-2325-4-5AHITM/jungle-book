function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function startLoadingAndRedirect() {
    var button = document.getElementById('button');
    var loadingBar = document.getElementById('loading-bar');

    loadingBar.style.display = 'block';
    button.style.display = 'none';

    setTimeout(function() {
        window.location.href = 'admin.html';

    }, 400);
}