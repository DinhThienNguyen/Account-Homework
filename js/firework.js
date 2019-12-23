function updateFirework() {
    let requestId = 0;
    update();
    paint();
    if (continueFirework) {
        requestId = window.requestAnimationFrame(updateFirework);
    } else {
        ctx.clearRect(0, 0, winnerEffectCanvasWidth, winnerEffectCanvasHeight);
        window.cancelAnimationFrame(requestId);
    }
}

function update() {
    if (particles.length < 500 && Math.random() < probability) {
        createFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
            alive.push(particles[i]);
        }
    }
    particles = alive;
}

function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, winnerEffectCanvasWidth, winnerEffectCanvasHeight);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}

function createFirework() {
    xPoint = Math.random() * (winnerEffectCanvasWidth - 200) + 100;
    yPoint = Math.random() * (winnerEffectCanvasHeight - 200) + 100;
    var nFire = Math.random() * 50 + 100;
    var c = "rgb(" + (~~(Math.random() * 200 + 55)) + "," +
        (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (var i = 0; i < nFire; i++) {
        var particle = new Particle();
        particle.color = c;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 4 + 1;

    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;

    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;

    this.alpha = Math.random() * .5 + .5;

    this.color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (this.x <= -this.w || this.x >= screen.width ||
            this.y >= screen.height ||
            this.alpha <= 0) {
            return false;
        }
        return true;
    },
    draw: function (c) {
        c.save();
        c.beginPath();

        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;

        c.closePath();
        c.fill();
        c.restore();
    }
}