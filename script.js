// eslint-disable-next-line no-undef
window.onload = function() {

    var canvasWidth = 1300;
    var canvasHeight = 600;
    var blockSize = 10;
    var ctx;
    var delay = 100;
    var snakee;
    
    init();

    function init () { // met en place le 'canvas' (le plateau sur lequel on joue)
        
        // eslint-disable-next-line no-undef
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        // eslint-disable-next-line no-undef
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4], [5,4], [4,4]], "right"); // création du serpent snakee avec 3 blocs
        refreshCanvas();        
    }

    function refreshCanvas() { // pour avoir cette sensation de déplacement on efface tout le canvas et on redessine le serpent un bloc plus loin
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.advance();
        snakee.draw();
        setTimeout(refreshCanvas,delay);        
    }

    function drawBlock(ctx, position) { // on dessine le serpent à la bonne place

        var x = position[0] * blockSize; // sur quelle colonne (on reprend le tableau new snake [[6,4], [5,4], [4,4]]) le [0] reprend la première valeur de chaque bloc qui correspond au x
        var y = position[1] * blockSize; // sur quelle ligne (on reprend le tableau new snake [[6,4], [5,4], [4,4]]) le [1] reprend la deuxième valeur de chaque bloc qui correspond au y
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) { // l'usine à fabrication de serpent
        this.body = body;
        this.direction = direction;
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
            this.body.pop();
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
        default:
            return;
        }
        snakee.setDirection(newDirection);
    };
};
