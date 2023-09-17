var canvas;
var game;
var anim;


const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;

function draw() {
    var context = canvas.getContext('2d');
    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw middle line
        // context.strokeStyle = 'white';
        // context.beginPath();
        // context.moveTo(canvas.width / 2, 0);
        // context.lineTo(canvas.width / 2, canvas.height);
        // context.stroke();
    // Draw players
    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
}

function play() {
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
        draw();
        computerMove();
        ballMove();
        anim = requestAnimationFrame(play);
}

function playerMove(event) {
    // Get the mouse location in the canvas
    var canvasPos = canvas.getBoundingClientRect();
    var mousePos = event.clientY - canvasPos.y;
    if (mousePos < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
    } else if (mousePos > canvas.height - PLAYER_HEIGHT / 2) {
        game.player.y = canvas.height - PLAYER_HEIGHT;
    } else {
        game.player.y = mousePos - PLAYER_HEIGHT / 2;
    }
}

function computerMove() { // FIX LES MOUVEMENTS DU BOT

        game.computer.y += game.ball.speed.y * 0.85;
    // if(game.ball.speed.y > 0)
    //     game.computer.y += 1;
    // else
    //     game.computer.y -= 1;
    // if (game.computer.y > canvas.height - PLAYER_HEIGHT / 2) {
    //     game.computer.y = canvas.height - PLAYER_HEIGHT;
    // }
}

function collide(player) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
        // Set ball and players to the center
        // var canvas = document.getElementById('canvas'); Tout à check tranquillement
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
        game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
        //reset speed
        draw();
        game.ball.speed.x = 2;
        if (player == game.player) {
            game.computer.score++;
            document.querySelector('#computer-score').textContent = game.computer.score;
        } else {
            game.player.score++;
            document.querySelector('#player-score').textContent = game.player.score;
        }
        sleep(20);

    } else {
        // Increase speed and change direction
        game.ball.speed.x *= -1.2;
        //changeDirection(player.y);
    }
}

function ballMove() {
    //ça touche les bords du haut et du bas, on swap le sens
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }
    //On arrive à l'abscisse d'un des deux joueurs, on vérifie et repart si nécessaire, sinon autorefresh de page
    if (game.ball.x > canvas.width - PLAYER_WIDTH) {
        collide(game.computer);
    } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.player);
    }
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function stop() {
    cancelAnimationFrame(anim);
    // Set ball and players to the center
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    // Reset speed
    game.ball.speed.x = 0.5;
    game.ball.speed.y = 0.5;
    // Init score
    game.computer.score = 0;
    game.player.score = 0;
    document.querySelector('#computer-score').textContent = game.computer.score;
    document.querySelector('#player-score').textContent = game.player.score;
    draw();
}

document.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('canvas');
    game = {
        player: {
            y: canvas.height / 2 - PLAYER_HEIGHT / 2,
            score: 0,
        },
        computer: {
            y: canvas.height / 2 - PLAYER_HEIGHT / 2,
            score: 0,
        },
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: 5,
            speed: {
                x: 0.5,
                y: 0.5
            },
        }
    }
    draw();
    canvas.addEventListener('mousemove', playerMove);
    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);
    // Mouse move event
});



        // // Set font properties dessiner
        // context.font = '24px Arial'; // Font size and style
        // context.fillStyle = 'white'; // Text color
        // // Position and text to write
        // var x = 50; // X-coordinate
        // var y = 100; // Y-coordinate
        // var text = 'Hello, Canvas!';

        // // Write the text on the canvas
        // context.fillText(text, x, y);