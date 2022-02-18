const main = () => {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Bar {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }
        update(micInput) {
            this.height = micInput * 8000
        }

        draw(context) {
            // context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height)
            context.beginPath(); // Need this to stop bars forming one big shape
            context.moveTo(this.x, this.height); // starting coordinates of the bar 
            context.lineTo(this.x, this.y); // ending coordinates of the bar
            context.stroke()
        }
    }

    const microphone = new Microphone();

    let bars = []
    let barWidth = canvas.width / 256
    // Create an instance of a bar for each audio sample
    const createBars = () => {
        for (let i = 0; i < 256; i++) {
            // let color = 'hsl(0, 100%, 50%)'
            let color = 'hsl(' + i * 2 + ', 100%, 50%)';
            bars.push(new Bar(i * barWidth, canvas.height / 2, 1, 100, color))
        }
    }
    console.log(bars)
    createBars()

    const animate = () => {
        if (microphone.initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // generate audio samples from mic
            const samples = microphone.getSamples();
            // animate bars based on mic data
            bars.forEach((bar, i) => {
                bar.update(samples[i])
                bar.draw(ctx)
            })
        }
        requestAnimationFrame(animate);
    }

    animate();
}