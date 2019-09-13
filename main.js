const boids = [];
let alignSlider, cohesionSlider, separationSlider;
function setup() {
    alignSlider = createSlider(0, 2, 1.5, 0.1);
    cohesionSlider = createSlider(0, 2, 1, 0.1);
    separationSlider = createSlider(0, 2, 2, 0.1);
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 100; i++) {
        boids.push(new Boid());
    }
    console.log(boids);
}

function draw() {
    background(0);
    for (boid of boids) {
        boid.show();
        boid.border();
        boid.update(boids);
    }
}