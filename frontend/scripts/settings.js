import { volume, setVolume } from './state.js'

const volumeInput = document.getElementById('volume');

volumeInput.value = volume();

volumeInput.addEventListener("change", (e) => {
    setVolume(e.target.value)
})

