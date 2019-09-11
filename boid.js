class Boid {
    constructor() {
        this.speed = 1;
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.position = createVector(random(windowWidth), random(windowHeight));
    }
    
    show() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, 5);
    }

    update() {
        this.position.add(this.velocity)
    }

    border() {
        if (this.position.x > windowWidth) this.position.x = 0;
        if (this.position.x < 0) this.position.x = windowWidth;
        if (this.position.y > windowHeight) this.position.y = 0;
        if (this.position.y < 0) this.position.y = windowHeight;
    }

    alignment(boids) {
        for (boid of boids) {
            
        }
    }
}