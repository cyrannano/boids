let boids = [], accelerationColor, velocityColor;
let clusters = [], clusterSize;
let perception = 60;

function setup() {
    createCanvas(4260, 2900);
    createClusters(width, height);
    for (let i = 0; i < 500; i++) {
        boids.push(new Boid());
    }
    accelerationColor = color(200,200,20);
    velocityColor = color(255,0,0);
}

function draw() {
    background(0);
    textSize(20);
    noStroke();
    // drawClusters();
    // drawClustersAmnt();
    fill(accelerationColor);
    text('Acceleration',0,20);
    fill(velocityColor);
    text('Velocity',0,50);
    for ([i, boid] of boids.entries()) {
        boid.checkCluster(i);
        boid.show();
        boid.border();
        boid.update();
        boid.flock(boids);
    }
}