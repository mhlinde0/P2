import { volume, setVolume } from './state.js'
import { getInputElement } from './helperFunctions.js';

const volumeElmmt = getInputElement('volume');

volumeElmmt.value = volume() ?? "0.5"; // 0.5 is default volume


volumeElmmt.addEventListener("change", handleVolumeChange);

/**
 * Handles the volume change event.
 * @param {Event} e - The event object.
 */
function handleVolumeChange(e) {
    const target = e.target;
    if (target instanceof (HTMLInputElement)) {
        setVolume(target.value)
    }
}

