const keycloak = new Keycloak({
    url: "http://localhost:8085", // Ensure the correct Keycloak auth URL
    realm: "JungleBook",
    clientId: "app"
});

function initKeycloak() {
    if (localStorage.getItem("keycloak") == null) {
        keycloak.init({ onLoad: 'login-required' })
                .then(authenticated => {
                    if (authenticated) {
                        console.log('User is authenticated');
                        console.log('Token:', keycloak.token);
                        localStorage.setItem("keycloak", keycloak);
                    } else {
                        console.log('User is not authenticated');
                    }
                })
                .catch(error => {
                    console.error('Failed to initialize Keycloak:', error);
                });
    }   
}

document.addEventListener("DOMContentLoaded", initKeycloak);
