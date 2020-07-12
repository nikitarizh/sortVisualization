// Audio class

class Audio {

    constructor() {
        this.context = new AudioContext();
    }

    // create an oscillator with sine wave form (by default)
    createOscillator(waveForm = 'sine') {
        let osc = this.context.createOscillator();
        osc.connect(this.context.destination);
        osc.type = waveForm;
        osc.start(0);
        return osc;
    }

    // normalize arr[i] in range [200; 270] (to get high freq based on value of array element)
    static getHighFreq(arr, x) {
        let minMax = arr.minMax();
        
        let mn = minMax.mn;
        let mx = minMax.mx;
        
        let range = mx - mn;

        return (x - mn) / range * 70 + 200;
    }

    // normalize arr[i] in range [100; 150] (to get low freq based on value of array element)
    static getLowFreq(arr, x) {
        let minMax = arr.minMax();
        
        let mn = minMax.mn;
        let mx = minMax.mx;
        
        let range = mx - mn;

        return (x - mn) / range * 50 + 100;
    }
}