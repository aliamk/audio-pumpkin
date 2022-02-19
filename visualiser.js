const main = () => {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Bar {
        constructor(x, y, width, height, color, index) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput) {
            // this.height = micInput * 1000
            const sound = micInput * 500;
            if (sound > this.height) {
                this.height = sound;
            } else {
                this.height -= this.height * 0.03
            }

        }

        draw(context, volume) {
            // context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.save()
            // context.fillRect(this.x, this.y, this.width, this.height)
            context.translate(0, 0)
            context.rotate(this.index * 0.03)
            context.scale(1 + volume * 0.2, 1 + volume * 0.2)
            context.beginPath(); // Need this to stop bars forming one big shape
            //context.moveTo(this.x, this.height); // starting coordinates of the bar 
            context.moveTo(this.x, this.y);
            context.lineTo(this.y, this.height); // ending coordinates of the bar
            context.bezierCurveTo(0, 0, this.height, this.height, this.x, this.y)
            context.stroke()
            // Add rectangles
            context.rotate(this.index * 0.02)
            context.strokeRect(this.y, this.index * 1.5, this.height, this.height * 0.5, this.height)
            context.beginPath();
            context.arc(this.x, this.index * 2.5, this.y, this.height * 0.5, 0, Math.PI * 2)
            context.stroke()
            context.restore()
        }
    }

    const fftSize = 512;

    const microphone = new Microphone(fftSize);

    let bars = []
    let barWidth = canvas.width / (fftSize * 0.5);
    // Create an instance of a bar for each audio sample
    const createBars = () => {
        for (let i = 0; i < (fftSize * 0.5); i++) {
            // let color = 'hsl(0, 100%, 50%)'
            let color = 'hsl(' + i * 2 + ', 100%, 50%)';
            bars.push(new Bar(0, i * 1.5, 5, 50, color, i))
        }
    }
    createBars()

    let angle = 0;

    const animate = () => {
        if (microphone.initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // generate audio samples from mic
            const samples = microphone.getSamples();
            const volume = microphone.getVolume();
            // animate bars based on mic data
            angle -= 0.0001 + (volume * 0.05);
            ctx.save();
            ctx.translate(canvas.width * 0.5, canvas.height * 0.5)
            ctx.rotate(angle)
            bars.forEach((bar, i) => {
                bar.update(samples[i])
                bar.draw(ctx, volume)
            })
            ctx.restore()
        }
        requestAnimationFrame(animate);
    }

    animate();
}