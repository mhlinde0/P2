
/**
 * Securely gets a html element
 * @param {string} id 
 * @returns {HTMLInputElement}
 */
export function getInputElement(id) {
    const elmnt = document.getElementById(id);

    if (!elmnt || elmnt.nodeName !=="INPUT") {
        throw new Error(`Element ${id} couldn't be found or is not input`)
    } 
    return elmnt;
}

export function getElementById(id) {
    const elmnt = document.getElementById(id);

    if (!elmnt) {
        throw new Error(`Element ${id} couldn't be found`)
    } 
    return elmnt;
}