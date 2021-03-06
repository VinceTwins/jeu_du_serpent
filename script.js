// eslint-disable-next-line no-undef
window.onload = function() {

    var canvasWidth = 1100;
    var canvasHeight = 400;
    var blockSize = 10;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlock = canvasWidth / blockSize;
    var heightInBlock = canvasHeight / blockSize;
    var score;
    var timeOut;



    
    init();

    function init () { // met en place le 'canvas' (le plateau sur lequel on joue)
        
        // eslint-disable-next-line no-undef
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid grey";
        canvas.style.display = "block";
        canvas.style.margin = "50px auto";
        canvas.style.backgroundColor = "black";
        // eslint-disable-next-line no-undef
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4], [5,4], [4,4]], "right"); // création du serpent snakee avec 3 blocs
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();        
    }

    function refreshCanvas() { // pour avoir cette sensation de déplacement on efface tout le canvas et on redessine le serpent un bloc plus loin
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score ++;
                snakee.eatApple = true;
                do {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
        }
                
    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.strokeText("Defonce la barre d'espace avec gentillesse si tu veux rejouer", centreX, centreY - 130);
        ctx.fillText("Defonce la barre d'espace avec gentillesse si tu veux rejouer", centreX, centreY - 130);
        ctx.restore();
    }

    function restart() {
        snakee = new Snake([[6,4], [5,4], [4,4]], "right"); // création du serpent snakee avec 3 blocs
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY );
        ctx.restore();
    }

    function drawBlock(ctx, position) { // on dessine le serpent à la bonne place

        var x = position[0] * blockSize; // sur quelle colonne (on reprend le tableau new snake [[6,4], [5,4], [4,4]]) le [0] reprend la première valeur de chaque bloc qui correspond au x
        var y = position[1] * blockSize; // sur quelle ligne (on reprend le tableau new snake [[6,4], [5,4], [4,4]]) le [1] reprend la deuxième valeur de chaque bloc qui correspond au y
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) { // l'usine à fabrication de serpent
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function () { // fonction pour dessiner les blocs du serpent
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() { // fonction qui donne la direction du serpent
            var nextPosition = this.body[0].slice();
            switch(this.direction) {
            case "left" :
                nextPosition[0] -= 1;
                break;
            case "right" :
                nextPosition[0] += 1;
                break;
            case "up" :
                nextPosition[1] -= 1;
                break;
            case "down" :
                nextPosition[1] += 1;
                break;
            default:
                throw("invalid direction");   
            }

            this.body.unshift(nextPosition);
            if (!this.eatApple)
                this.body.pop();
            else
                this.eatApple = false;
        };

        this.setDirection = function(newDirection) {
            var allowDirections;
            switch(this.direction) {
            case "left" :
            case "right" :
                allowDirections = ["up", "down"];
                break;
            case "up" :
            case "down" :
                allowDirections = ["left", "right"];
                break;
            default:
                throw("invalid direction");
            }
            if (allowDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var stillNotInsideCanvasX = snakeX < minX || snakeX > maxX;
            var stillNotInsideCanvasY = snakeY < minY || snakeY > maxY;
            
            if (stillNotInsideCanvasX || stillNotInsideCanvasY) {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };


    }

    function Apple(position) {
        this.position = position;
        this.draw = function() { // fonction pour dessiner le bloc de la pomme
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };

    }

    // eslint-disable-next-line no-undef
    document.onkeydown = function handleKeydown(e) { // pour donner une direction au serpent
        var key = e.keyCode;
        // eslint-disable-next-line no-unused-vars
        var newDirection;
        switch(key) {
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        case 32:
            restart();
            return;
        default:
            return;
        }
        snakee.setDirection(newDirection);
    };
};
