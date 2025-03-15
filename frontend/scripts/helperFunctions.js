/** @module helperFunctions */

/**
 * Securely gets a html INPUT element by id
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
 * Securely gets a html element by id
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

/**
 * Securely gets a collection of elements with the querySelector
 * @param {string} query
 * @returns {Array<HTMLElement>}
 */
export function querySelectorAll(query) {
    const nodeList = document.querySelectorAll(query);

    if (nodeList.length === 0) {
        throw new Error(`Elements found with selector ${query} are not HTMLElements`);
    }
    const elements = Array.from(nodeList).filter((node) => node instanceof HTMLElement);

    return elements;
}