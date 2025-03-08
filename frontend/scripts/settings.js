import { volume, setVolume } from './state.js'

const volumeElmmt = document.getElementById('volume');

// volumeElmmt?.value = volume();

volumeElmmt?.addEventListener("change", (e) => {
    setVolume(e.target.value)
})

