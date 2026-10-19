const fishImages = [
    "fish1.png",
    "fish2.png",
    "fish3.png",
    "fish4.png",
    "fish5.png"
];

const tank = document.getElementById("tank");
const tankWidth = tank.clientWidth;
const tankHeight = tank.clientHeight;
const fishSize = 100; // 100px

// We use a Class to define fish and their behavior
class Fish {
    constructor() {
        this.element = document.createElement("img");
        this.element.className = "fish";
        
        // Random Image out of 5 options
        let randImgIndex = Math.floor(Math.random() * fishImages.length);
        this.element.src = fishImages[randImgIndex];

        // Random Initial Location within Tank bounds
        this.x = Math.floor(Math.random() * (tankWidth - fishSize));
        this.y = Math.floor(Math.random() * (tankHeight - fishSize));
        
        // Base Speed and Direction
        this.baseSpeed = 1.5;
        this.currentSpeedMultipler = 1;
        
        // Initial random direction (-1 or 1 for x and y)
        this.dx = (Math.random() < 0.5 ? 1 : -1);
        this.dy = (Math.random() < 0.5 ? 1 : -1);

        // Apply starting position
        this.updateElementPosition();
        tank.appendChild(this.element);

        // Tapping event: Click to speed up
        this.element.addEventListener("click", () => this.speedUp());

        // Independent Direction Change Timer (Every 2-8 seconds)
        this.setRandomDirectionChange();
    }

    updateElementPosition() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        
        // Optional: flip image if moving left
        if (this.dx < 0) {
            this.element.style.transform = "scaleX(-1)";
        } else {
            this.element.style.transform = "scaleX(1)";
        }
    }

    move() {
        // Calculate new position
        let actualSpeed = this.baseSpeed * this.currentSpeedMultipler;
        this.x += this.dx * actualSpeed;
        this.y += this.dy * actualSpeed;

        // Requirement: Remain Within Tank Limits
        // Bounce off right/left walls
        if (this.x <= 0) {
            this.x = 0;
            this.dx *= -1; // Reverse horizontal direction
        } else if (this.x >= tankWidth - fishSize) {
            this.x = tankWidth - fishSize;
            this.dx *= -1;
        }

        // Bounce off top/bottom walls
        if (this.y <= 0) {
            this.y = 0;
            this.dy *= -1; // Reverse vertical direction
        } else if (this.y >= tankHeight - fishSize) {
            this.y = tankHeight - fishSize;
            this.dy *= -1;
        }

        this.updateElementPosition();
    }

    // Randomized Direction Changes every 2 to 8 seconds
    setRandomDirectionChange() {
        // Math.random() * 6000 gives 0 to 6000. Add 2000 to get 2000ms to 8000ms (2-8 seconds)
        let randomTime = Math.floor(Math.random() * 6000) + 2000;
        
        setTimeout(() => {
            // Randomize direction again
            this.dx = (Math.random() < 0.5 ? 1 : -1);
            this.dy = (Math.random() < 0.5 ? 1 : -1);
            
            // Loop the timer independently
            this.setRandomDirectionChange();
        }, randomTime);
    }

    speedUp() {
        // Requirement: No Cumulative Speed Change
        if (this.currentSpeedMultipler > 1) return; // If already sped up, ignore click
        
        this.currentSpeedMultipler = 4; // Move 4x faster

        // Requirement: 3 seconds of Speed
        setTimeout(() => {
            this.currentSpeedMultipler = 1; // Return to normal speed
        }, 3000);
    }
}

// Requirement: Tank has 7 Fish on load
const allFish = [];
for (let i = 0; i < 7; i++) {
    allFish.push(new Fish());
}

// Constant Movement Animation Loop
function animateTank() {
    for (let i = 0; i < allFish.length; i++) {
        allFish[i].move();
    }
    // Tells the browser to run this function constantly before the next screen repaint
    requestAnimationFrame(animateTank);
}

// Start the animation
animateTank();
