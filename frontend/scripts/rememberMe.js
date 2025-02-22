document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const rememberMeBox = document.getElementById("rememberMe");

    if (document.cookie.includes("rememberMe=true")) {
        const username = getCookie("username");
        const password = getCookie("password");

        document.getElementById("username").value = username;
        document.getElementById("password").value = password;

        rememberMeBox.checked = true;
    }

    loginForm?.addEventListener("submit", function(event) {
        event?.preventDefault();

        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        if (rememberMeBox.checked) {
            setCookie("username", username, 5);
            setCookie("password", password, 5);
            setCookie("rememberMe", true, 7);
        } else {
            setCookie("username", "", -1);
            setCookie("password", "", -1);
            setCookie("rememberMe", "", -1);
        }

        // Her skal selve login ske
        console.log("Username", username);
        console.log("Password", password);
    })

    // Function to set a cookie
    function setCookie(name, value, days) {
        const date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies [i];

            while (cookie.charAt(0)  === ' ') {
                cookie = cookie.substring(1)
            }

            if (cookie.indexOf(name + "=") === 0) {
                return cookie.substring(name.length + 1);
            }
        }
    return '';
    }
})
