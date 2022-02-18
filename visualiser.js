const main = () => {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight


    class Bar {
        constructor() {


        }
        update() {

        }

        draw() {

        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // generate audio samples from mic
        // animate bars based on mic data
        requestAnimationFrame(animate);
    }

    animate();
}