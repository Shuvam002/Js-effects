const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;


class Cell {
    constructor(effect, x, y, index) {
        this.effect = effect;
        this.x = x;
        this.y = y;
        this.index = index;
        this.positionX = this.effect.width;
        this.positionY = this.effect.height;
        this.speedX;
        this.speedY;
        this.width = this.effect.cellWidth;
        this.height = this.effect.cellHeight;
        this.image = document.getElementById('projectimage');
        this.sildeX = 0;
        this.slideY = 0;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.1;
        this.friction = 0.8;
        this.randomize = Math.random() * 50 + 2;
        setTimeout(() => {
            this.start();
        }, this.index * 10);

    }
    draw(context) {
        context.drawImage(this.image, this.x + this.sildeX, this.y + this.slideY, this.width, this.height, this.x, this.y/*change these two this.x and this.y to positionX and positionY for emerging effect*/, this.width, this.height);
        // context.strokeRect(this.positionX,this.positionY,this.width,this.height);
    }
    start() {
        this.speedX = (this.x - this.positionX) / this.randomize;
        this.speedY = (this.y - this.positionY) / this.randomize;
    }
    update() {
        this.sildeX=Math.random()*10; //these two are for glitch effect
        this.slideY=Math.random()*10;
        if (Math.abs(this.speedX) > 0.001 || Math.abs(this.speedY) > 0.001) {
            this.speedX = (this.x - this.positionX) / this.randomize;
            this.speedY = (this.y - this.positionY) / this.randomize;
            this.positionX += this.speedX;
            this.positionY += this.speedY;
        }
        // this.speedX = (this.x - this.positionX) / this.randomize;
        //     this.speedY = (this.y - this.positionY) / this.randomize;
        //     this.positionX += this.speedX;
        //     this.positionY += this.speedY;

        const dx = this.effect.mouse.x - this.x;
        const dy = this.effect.mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < this.effect.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = 10 * distance / this.effect.mouse.radius;
            //swap sin and cos for alternate effect
            this.vx = force * Math.sin(angle);
            this.vy = force * Math.cos(angle);
        }
        this.sildeX += (this.vx *= this.friction) - this.sildeX * this.ease;
        this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
    }
}


class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cellWidth = this.width / 120;
        this.cellHeight = this.height / 120;
        this.imageGrid = [];
        this.createGrid();
        this.mouse = {
            x: undefined,
            y: undefined,
            radius: 80,
        }
        this.addEventListeners();
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        })
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        })
        this.canvas.addEventListener('touchmove', e => {
            let touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        })
        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        })
    }

    createGrid() {
        for (let y = 0; y < this.height; y += this.cellHeight) {
            for (let x = 0; x < this.width; x += this.cellWidth) {
                this.imageGrid.unshift(new Cell(this, x, y));
            }
        }
    }

    render(context) {
        this.imageGrid.forEach(cell => {
            cell.update();
            cell.draw(context);
        })
    }
}


const effect = new Effect(canvas);
effect.render(ctx);

function animate() {
    // ctx.clearRect(0,0,canvas.width,canvas.height); //this is for linear effect, try it if you have place this.position variable in the aforesaid
    effect.render(ctx);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
