class Boid {
    constructor() {
        this.position = createVector(random(width - 10), random(height - 10));
        this.r = 10;
        this.velocity = createVector(random(0,4), random(0,4));
        this.maxSpeed = 4;
        this.maxForce = .3;
        this.acceleration = createVector(0, 0);
        this.prevCluster = null;
        this.prevClusterIndex = null;
    }

    flock(boids) {
        this.acceleration.add(this.separation(boids));
        let cohalRes = this.alignCoh(boids);
        this.acceleration.add(cohalRes[0]);
        this.acceleration.add(cohalRes[1]);
    }

    show() {
        strokeWeight(2);
        stroke(0);
        fill(255);
        noStroke();
        ellipse(this.position.x, this.position.y, this.r);
        stroke(255,0,0);
        push();
        translate(this.position.x, this.position.y);
        line(0, 0, this.velocity.x * 5, this.velocity.y * 5);
        pop();
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    separation() {
        let escapeForce = createVector();
        let localboids = this.getNearBoids();
        for (boid of localboids) {
            let total = 0;
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && d < 20) {
                let diff = p5.Vector.sub(this.position, createVector(boid.position.x, boid.position.y));
                diff.div(d*d);
                escapeForce.add(diff);
                escapeForce.setMag(this.maxSpeed);
                escapeForce.sub(this.velocity);
                total++;
            }
            if (total > 0) {
                escapeForce.div(total);
                // push();
                // translate(this.position.x, this.position.y)
                // stroke(200,200,20);
                // line(0,0, escapeForce.x * 10, escapeForce.y * 10);
                // pop();
                escapeForce.limit(this.maxForce);
            }
        }

        return escapeForce;
    }

    alignCoh() {
        let alignForce = createVector();
        let cohForce = createVector();
        let localboids = this.getNearBoids();
        for (boid of localboids) {
            let total = 0;
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && d < perception) {
                alignForce.add(boid.velocity);
                cohForce.add(boid.position);
                
                total++;
            }
            if (total > 0) {
                // alignForce.sub(this.position);
                cohForce.sub(this.position);
                alignForce.setMag(this.maxSpeed);
                alignForce.div(total);
                alignForce.limit(this.maxForce);
                cohForce.setMag(this.maxSpeed);
                cohForce.div(total);
                cohForce.limit(0.05);
            }
        }

        return [alignForce, cohForce];
    }

    border() {
        if (this.position.x > width) {this.position.x = 0;}
        else if (this.position.x < 0) {this.position.x = width}
        if (this.position.y > height) {this.position.y = 0}
        else if (this.position.y < 0) {this.position.y = height}
    }

    checkCluster(i) {
        let y = this.position.y;
        let x = this.position.x;
        if (x < 0) x*=-1;
        if (y < 0) y*=-1;
        let clusterRow = Math.floor(Math.floor(y) / clusterSize); 
        let clusterCol = Math.floor(Math.floor(x) / clusterSize);
        clusterRow = clusterRow >= height/clusterSize ? clusterRow - 1 : clusterRow;
        clusterCol = clusterCol >= width/clusterSize ? clusterCol - 1 : clusterCol;
        if (i in clusters[clusterRow][clusterCol]) {
            return true;
        }
        else {
            if (this.prevCluster) {
                clusters[this.prevCluster[0]][this.prevCluster[1]].splice(this.prevClusterIndex);
            } 
            this.prevClusterIndex = clusters[clusterRow][clusterCol].push(i) - 1;
            this.prevCluster = [clusterRow,clusterCol];
        }
    }

    getNearBoids(i) {
        let localboids = [];
        if (this.prevCluster[0] == 0 && this.prevCluster[1] == 0) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[0] == height/clusterSize - 1 && this.prevCluster[1] == width/clusterSize - 1) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[0] == 0 && this.prevCluster[1] == width/clusterSize - 1) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[0] == height/clusterSize - 1 && this.prevCluster[1] == 0) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[0] == 0 && this.prevCluster[1] != width/clusterSize - 1) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[1] == 0 && this.prevCluster[0] != width/clusterSize - 1) {
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[0] == height/clusterSize - 1 && this.prevCluster[1] != 0) {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }else if (this.prevCluster[1] == width/clusterSize - 1 && this.prevCluster[0] != 0) {
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
        }else {
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0]][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] + 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] - 1]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1]]) localboids.push(boids[boid]);
            for (boid of clusters[this.prevCluster[0] - 1][this.prevCluster[1] + 1]) localboids.push(boids[boid]);
        }
        return localboids;
    }
}

function biggestSquare(x,y) {
    if (x == y) return y;
    // if (x == y || y < perception + 300 && y > perception) return y;
    return x > y ? biggestSquare(x-y, y) : biggestSquare(y-x, x);
    // return 200;
}

function createClusters(x,y) {
    clusterSize = biggestSquare(x,y);
    let cols = x/clusterSize;
    let rows = y/clusterSize;
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push([]);
        }
        clusters.push(row);
    }
}

function drawClusters() {
    for (let i = clusterSize; i < width; i+=clusterSize) {
        stroke(255);
        line(i,0,i,height);
    }
    for (let i = clusterSize; i < height; i+=clusterSize) {
        line(0,i,width,i);
    }
    noStroke();
}

function drawClustersAmnt() {
    for (let i = 0; i < height/clusterSize; i++) {
        for (let j = 0; j < width/clusterSize; j++) {
            text(clusters[i][j].length, j*clusterSize + clusterSize/2, i*clusterSize + clusterSize/2);
            fill(255);
        }
    }
}