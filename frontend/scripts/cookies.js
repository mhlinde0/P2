/** @module cookies */



/**
 * @function
 * @param {string} name 
 * @param {any} value 
 * @param {number} days 
 */
export const setCookie = (name, value, days) => {
    const date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
};

/**
 * @function
 * @param {string} name 
 * @returns {any} - the cookie value
*/
export const getCookie = (name) => {
    return document.cookie
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(name + "="))
        ?.split('=')[1] || "";
};




