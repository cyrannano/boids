class Boid {
    constructor() {
        this.maxForce = 0.2;
        this.perception = 50;
        this.r = 5;
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.position = createVector(random(width), random(height));
        this.maxSpeed = 5;
        this.acceleration = createVector();
    }

    show() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.r);
    }
    
    border() {
        if (this.position.x > width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = height;
    }

    applyRules(boids) {
        let avg_v = createVector(0, 0),
        avg_c = 0;
        let avg_p = createVector(0, 0);
        for (boid of boids) {
            let distance = dist(boid.position.x, boid.position.y, this.position.x, this.position.y);
            if (boid != this && distance < this.perception) {
                avg_v.add(boid.velocity);
                avg_p.add(boid.position);
                avg_c++;
            }
        }
        if (avg_c != 0) {
            avg_p.div(avg_c);
            avg_p.sub(this.position);
            avg_p.setMag(this.maxSpeed);
            avg_p.sub(this.velocity);
            avg_v.div(avg_c);
            avg_v.setMag(this.maxSpeed);
            avg_v.sub(this.velocity)
        }
        return [avg_v.limit(this.maxForce), avg_p.limit(this.maxForce)];
    }
    
    separation() {
        let avg_s = createVector(0, 0);
        avg_s.setMag(separationSlider.value());
        for (boid of boids) {
            let distance = dist(boid.position.x, boid.position.y, this.position.x, this.position.y);
            if (boid != this && distance < this.perception) {
                avg_s.add(createVector(boid.position.x - this.position.x, boid.position.y - this.position.y).div(distance));
            }
        }
        return avg_s.limit(this.maxForce);
    }
    
    update(boids) {
        let rules = this.applyRules(boids);
        let separation = this.separation(boids);

        rules[0].mult(alignSlider.value());
        rules[1].mult(cohesionSlider.value());
        separation.mult(separationSlider.value());
        this.acceleration.add(rules[0],rules[1],separation);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
}