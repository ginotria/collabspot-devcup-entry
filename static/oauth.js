var API_KEY = "AIzaSyAYAU2X6Oh0dNTxOmWZxokMRU84cZKiv0E";
var CLIENT_ID = '790634197261.apps.googleusercontent.com';
var ALL_SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive.file'
];
function auth(immediate) {
    if (immediate === undefined) {
        immediate = true;
    }
    // Visit https://code.google.com/apis/console?api=plus to generate your
    // oauth2 client id and simple api key.
    var config = {
        client_id: CLIENT_ID,
        scope: ALL_SCOPES,
        immediate: immediate
    };
    gapi.client.setApiKey(API_KEY);
    window.setTimeout(function() {
        console.log('Checking User Authorizations...');
        gapi.auth.authorize(config, handleAuthResult);
    }, 1);
}

function handleAuthResult(authResult) {
    var gapiConnectPanel = document.getElementById('gapi-connect');
    var mainPanel = document.getElementById('main-container');
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
        gapiConnectPanel.style.visibility = 'hidden';
        mainPanel.style.visibility = '';
        var authTimeout = (authResult.expires_in - 5 * 60) * 1000;
        setTimeout(auth, authTimeout);
        console.log("User Authorized.");
        loadScript("/static/app.js", function(){});
    } else {
        gapiConnectPanel.style.visibility = '';
        mainPanel.style.visibility = 'hidden';
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    auth(false);
}

auth(true);