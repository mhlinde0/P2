
/**
 * Securely gets a html INPUT element
 * @param {string} id 
 * @returns {HTMLInputElement}
 */
export function getInputElement(id) {
    const elmnt = document.getElementById(id);

    if (!(elmnt instanceof HTMLInputElement)) {
        throw new Error(`Element ${id} couldn't be found or is not input`)
    }

    return elmnt;
}

/**
 * Securely gets a html element
 * @param {string} id 
 * @returns {HTMLElement}
 */
export function getElementById(id) {
    const elmnt = (document.getElementById(id));

    if (!elmnt) {
        throw new Error(`Element ${id} couldn't be found`)
    }
    return elmnt;
}