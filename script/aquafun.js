// Fish-tank project by Ivanova Natalia
// version 2:  ES5, prototype inheritance, Tank, Fish, GoldFish and Catfish constructors, ui script is separated 

var tank = new Tank(document.querySelector(".container"));
var tankWidth = parseInt(window.getComputedStyle(document.querySelector(".container")).width, 10);
var tankHeight = parseInt(window.getComputedStyle(document.querySelector(".container")).height, 10);
var $modal = document.querySelector(".modal-background");
var goldMax = 3;
var catMax = 7;

function Fish (imageUrl, $container) {
    var $fishImg = document.createElement("img");
    $fishImg.setAttribute("src", imageUrl);
    $fishImg.className = 'fish';
    $fishImg.style.width = "80px"; 
    $fishImg.style.height = "80px"; 
    $container.appendChild($fishImg);

    this.$fishImg = $fishImg;
    this.$container = $container;
}

Fish.prototype.swim = function() {
    this.$fishImg.style.top = this.topOffset;
    this.$fishImg.style.right = this.rightOffset; 
    var fishSpeed = Math.floor(Math.random() * (this.maxSpeed - 1)) + 1;

    function move () {
        var right = parseInt(this.$fishImg.style.right, 10);

        if (right >= (tankWidth-(parseInt(this.$fishImg.style.width,10))) && this.$fishImg.className === 'fish') {
            this.$fishImg.className = 'fish-back';
        } else if (right <= 50 && this.$fishImg.className === 'fish-back') {
            this.$fishImg.className = 'fish';
        } else if (this.$fishImg.className.includes('fish-dead')) {
            return;
        }

        if (this.$fishImg.className === 'fish-back') {
            this.$fishImg.style.right = (right - fishSpeed) + "px";
        } else {
            this.$fishImg.style.right = (right + fishSpeed) + "px";
        }
    }

    var moveFish = move.bind(this);
            
    setInterval( function () {
        moveFish()
    },50);   

}

Fish.prototype.die = function () {
    this.$fishImg.classList.add("fish-dead");
    function remove () {
        this.$container.removeChild(this.$fishImg);  
    }

    var removeFish = remove.bind(this);

    setTimeout(function(){ 
        removeFish()
    }, 6000);
}

Fish.prototype.eat = function () {
    var width = parseInt(this.$fishImg.style.width,10);
    var height = parseInt(this.$fishImg.style.height,10);
    var top = parseInt(this.$fishImg.style.top, 10);
    if (width < 160) {
        this.$fishImg.style.width = (width + 20) + "px";
        this.$fishImg.style.height = (height + 20) + "px";
        this.$fishImg.style.top = (top - this.shiftTop) + "px";
    }
}

function GoldFish(imageUrl, $container) {
    var maxTop = tankHeight - 160 - 5; // tank's height - max fish height - padding;
    this.topOffset = Math.floor(Math.random() * (maxTop - 50 + 1)) + 50 + "px";
    this.rightOffset = "50px";
    this.maxSpeed = 20;
    this.shiftTop = 0;
    Fish.apply(this, arguments);
    this.swim();
}

function Catfish(imageUrl, $container) {
    var maxTop = tankHeight - 80; // tank's height - max catfish height;
    this.topOffset = maxTop + "px";
    this.rightOffset = Math.floor(Math.random() * ((tankWidth - 80 - 10) + 1)) + "px"; // tank's width -  catfish width - padding;
    this.maxSpeed = 5;
    this.shiftTop = 12;
    Fish.apply(this, arguments);
    this.swim();
}

GoldFish.prototype = Object.create(Fish.prototype);
Catfish.prototype = Object.create(Fish.prototype);

function Tank ($container) {
    fishArr = [];
    catfishArr = [];
    var styleEl = document.createElement('style');
    var styleSheet;

    document.head.appendChild(styleEl);
    var styleSheet = styleEl.sheet;
    styleSheet.insertRule('.container:after {opacity:0.05;}', 0);
    var opacity = parseFloat(window.getComputedStyle(document.querySelector('.container'), ':after').getPropertyValue('opacity')); 

    this.addFishFunc = function(event) {
        var fishType = event.currentTarget.className;
        try {
            tank.checkFishType(fishType);
        } catch (e) {
            tank.displayModal(e.message);
        }
    }

    this.checkFishType = function (fishType) {
        if (fishType.includes('add-btn')) {
            fishType = 'img/babelfish.png';
            this.addFish(fishType);
        } else {
            fishType = 'img/catfish.png';
            this.addCatfish(fishType);
        }
    }

    this.addFish = function (fishType) {
        if (fishArr.length % 3 == 0 && fishArr.length/catfishArr.length > 3 && fishArr.length) {
            throw new Error("There are too many Goldfish in the tank. Please, add a Catfish.");
        } else {
            var fish = new GoldFish(fishType, $container);   
            fishArr.push(fish);
        }
    }

    this.addCatfish = function (fishType) {
        var count = catfishArr.length / fishArr.length;
        if ( count >= catMax - 1) {
            throw new Error("There are too many Catfish in the tank. Please, add a Goldfish.");
        } else {
            var catfish = new Catfish(fishType, $container);   
            catfishArr.push(catfish);
        }
    }

    this.displayModal = function (e) {
        var $error = document.querySelector(".error-msg");
        $modal.style.display = "block";
        $error.textContent = e;
    }

    this.closeModal = function () {
        $modal.style.display = "";
    }

    this.feed = function () {
        var deadArr = [];
        var deadCatfishArr = [];

        for (var i = fishArr.length-1; i >= 0; i--) {
            if (i >= (fishArr.length-goldMax)) {
                fishArr[i].eat();
                this.dirt();
            } else {
                deadArr.push(fishArr[i]);
                fishArr[i].die();
            }
        }
        fishArr.splice(0, deadArr.length);

        for (var i = catfishArr.length-1; i >= 0; i--) {
            if (opacity >  0.05) {
                catfishArr[i].eat();
                this.clearing();
            } else {
                deadCatfishArr.push(catfishArr[i]);
                catfishArr[i].die();
            }
        }
        catfishArr.splice(0, deadCatfishArr.length);
    }

    this.dirt = function () {
        if (opacity >= 0.8) {
            this.displayModal("Your tank is too much dirty. All fish are dead. The game is over.");
            while ($container.firstChild) {
                $container.removeChild($container.firstChild);
            }
            fishArr = [];
            catfishArr = [];
            $addGold.removeEventListener("click", addFishFunc);
            $addCat.removeEventListener("click", addFishFunc);
            $feed.addEventListener("click", function() {
                tank.feed();
            })
        } else {
            opacity = Math.round((opacity + 0.01)*100)/100; 
            styleSheet.cssRules[0].style.opacity = opacity;
        }
    }

    this.clearing = function () {
        opacity = Math.round((opacity - 0.01)*100)/100; 
        styleSheet.cssRules[0].style.opacity = opacity;
    }
}


