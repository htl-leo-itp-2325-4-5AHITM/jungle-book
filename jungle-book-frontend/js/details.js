function startLoadingAndRedirect() {
    var button = document.getElementById('button');
    var loadingBar = document.getElementById('loading-bar');

    loadingBar.style.display = 'block';
    button.style.display = 'none';

    setTimeout(function() {
        window.location.href = 'admin.html';

    }, 400);
}