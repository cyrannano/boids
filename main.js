const boids = [];
function setup() {
    let lol = createVector(1, 3);
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        boids.push(new Boid());
    }
    console.log(boids);
}

function draw() {
    background(0);
    for (boid of boids) {
        boid.show();
        boid.update();
        boid.border();
    }
}