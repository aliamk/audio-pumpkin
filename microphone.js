class Microphone {
    constructor() {
        this.initialized = false;
        navigator.mediaDevices.getUserMedia({ audio: true })  // provides access to mics / cameras / screensharing... getUserMedia returns a promise containing mic data
            .then((stream) => {
                this.audioContext = new AudioContext()         // Web Audio API is like the canvas for sound
                this.microphone = this.audioContext.createMediaStreamSource(stream);    // convert raw audio data into audio nodes
                this.analyser = this.audioContext.createAnalyser()  // create an analyser node that can analyse the audio nodes (time + frequency data)
                this.analyser.fftSize = 512;  // create audio samples (also called 'bins') - must be power of 2 (32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768)
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength)   // store audio samples and convert them into integers between 0 and 255
                this.microphone.connect(this.analyser) // connect multiple audio nodes together
                this.initialized = true
            }).catch((err) => {
                console.log(err)
            })
    }
    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray)       // add current waveform data into Uint8Array array
        let normSamples = [...this.dataArray].map((e) => e / 128 - 1)   // spread values from dataArray to convert them from Uint8Array to normal array + then map (produces values -1 to 1)
        return normSamples
    }
    // Produce a single value to control volume
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray)
        let normSamples = [...this.dataArray].map((e) => e / 128 - 1)
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}

const microphone = new Microphone()
console.log(microphone)