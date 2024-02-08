var canvas;
var canvasSelected = false;
var startButtonClicked = false;
var game;
var anim;
var gameOver = true;        // -------------------------------------------------------------------------------------------------ajout
var hitEffect = false;
var colorsArrows = {
    i : 0,
    Value : ['white', 'red', 'green', 'yellow']
};


const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;

function draw() {
    var context = canvas.getContext('2d');
    // Canva terrain
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Trait de délimitation
        // context.strokeStyle = 'white';
        // context.beginPath();
        // context.moveTo(canvas.width / 2, 0);
        // context.lineTo(canvas.width / 2, canvas.height);
        // context.stroke();
    // Joueur et mur (remplacé l'IA par un mur en attendant de fix)
    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width / 2 - PLAYER_WIDTH / 2, game.thirdPlayer.y, PLAYER_WIDTH, PLAYER_HEIGHT); // ---------------------------------------------THIRDPLAYER
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    //context.fillRect(canvas.width - PLAYER_WIDTH, 0, PLAYER_WIDTH, canvas.height);
    // Balle
    context.beginPath();
    context.fillStyle = colorsArrows.Value[colorsArrows.i];
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
}

function play() {
    if (game.startButtonClicked == true) {
        gameOver = false;
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
        draw();
        computerMove(); //A remettre quand 2eme joueur rajouté, IA remplacée par un mur
        ballMove();
        anim = requestAnimationFrame(play);
    }
}

function playerMove(event) {
    // Récupère les infos du Canvas, et on compare la position de la souris par rapport à la position du canva
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

function thirdPlayer(event) { // ---------------------------------------------------------------------------------------AJOUT {
        // Vérifiez si la touche appuyée est la flèche du haut
        if (event.key === "ArrowUp") {
            // Code à exécuter lorsque la flèche du haut est pressée
            if(game.thirdPlayer.y - game.thirdPlayer.speed > 0) // A GERER EN FONCTION
                game.thirdPlayer.y -= game.thirdPlayer.speed;
            else
                game.thirdPlayer.y = 0;
        }
        else if (event.key === "ArrowDown") {
            // Code à exécuter lorsque la flèche du bas est pressée
            if(game.thirdPlayer.y + game.thirdPlayer.speed < canvas.height - PLAYER_HEIGHT)
                game.thirdPlayer.y += game.thirdPlayer.speed;
            else
                game.thirdPlayer.y = canvas.height - PLAYER_HEIGHT;
        }
}

function computerMove() { // FIX LES MOUVEMENTS DU BOT

    game.computer.y += game.ball.speed.y * 0.85;
    if(game.ball.speed.y > 0)
        game.computer.y += 1;
    else
        game.computer.y -= 1;
    if (game.computer.y > canvas.height - PLAYER_HEIGHT / 2) {
        game.computer.y = canvas.height - PLAYER_HEIGHT;
    }
}

function collide(player) {
    // Si la balle est loupée
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT && player.y != -1) {
        // var canvas = document.getElementById('canvas'); Tout à check tranquillement
        // var context = canvas.getContext('2d');
        // context.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(anim);
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
        game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
        game.thirdPlayer.y = canvas.height / 2 - PLAYER_HEIGHT * 3 / 2; //Mis en commentaire pour éviter l'altération du comp -1
        //reset de tout le canva (au dessus) + reset de la speed 
        colorsArrows.i = 0; // reset par la couleur par défaut
        draw();
        game.ball.speed.x = 1;
        // Evenement précedent (du player) correspond au joueur, +1 point à l'ordinateur
        if (player == game.player) {
            game.computer.score++;
            document.querySelector('#computer-score').textContent = game.computer.score;
        } else {
            game.player.score++;
            document.querySelector('#player-score').textContent = game.player.score;
        }
        game.startButtonClicked = false;
        gameOver = true;        // -------------------------------------------------------------------------------------------------ajout
    } else {
        //rajout d'un changement de couleur lorsque la balle touche (Optionnel mais funz)
        if(colorsArrows.i + 1 < colorsArrows.Value.length)
            colorsArrows.i++;
        else
            colorsArrows.i = 0;
        //si la balle est hit, on augmente la speed (Option FUNZ)
        game.ball.speed.x *= -1; // Enlevé le -1.1 pour les tests
        //changeDirection(player.y); //A decommenter pour mettre une vitesse random cf fonction plus bas
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
    if  (game.ball.x >= canvas.width / 2 - PLAYER_WIDTH / 2 && // THIRDPLAYER VALUES A MODIFIER SI TAILLE MODIFIEE
        game.ball.x <= canvas.width / 2 + PLAYER_WIDTH / 2 &&
        game.ball.y <= game.thirdPlayer.y + PLAYER_HEIGHT &&
        game.ball.y >= game.thirdPlayer.y) {

        game.ball.speed.x *= -1;
        // if(game.ball.x >= canvas.width / 2 + PLAYER_WIDTH / 2 && game.ball.speed.x < 0)
        //         game.ball.speed.x *= -1;
        // else if(game.ball.x <= canvas.width / 2 - PLAYER_WIDTH / 2 && game.ball.speed.x > 0)
        //         game.ball.speed.x *= -1;
        if(game.ball.y <= game.thirdPlayer.y + PLAYER_HEIGHT / 2 && game.ball.speed.y > 0)
            game.ball.speed.y *= -1;
        else if(game.ball.y >= game.thirdPlayer.y + PLAYER_HEIGHT / 2 && game.ball.speed.y < 0)
            game.ball.speed.y *= -1;
    }
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function stop() {
    //stop de l'animation
    cancelAnimationFrame(anim);
    gameOver = true;
    // Reset de tout à l'emplacement par défaut
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2; // remplacement du comp à -1 pour faire une condition mur dans les collisions
    game.ball.speed.x = 1;
    game.ball.speed.y = 1;

    colorsArrows.i = 0; // reset par la couleur par défaut
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
        thirdPlayer:{
            y : canvas.height / 2 - PLAYER_HEIGHT * 3 / 2 ,
            speed : 20,
        },
        player: {
            y: canvas.height / 2 - PLAYER_HEIGHT / 2,
            score: 0,
        },
        computer: {
            y: canvas.height / 2 - PLAYER_HEIGHT / 2, // remplacement du comp à -1 pour faire une condition mur dans les collisions
            score: 0,
        },
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: 5,
            speed: {
                x: 1,
                y: 1
            },
        startButtonClicked : false,
        }
    }
    draw();
    canvas.addEventListener('click', function () {
        canvasSelected = true;
        canvas.focus(); // Donne le focus au canvas
    });
    canvas.addEventListener('mouseleave', function () {
        canvasSelected = false;
    });
    canvas.addEventListener('keydown', function (event) {
        if (canvasSelected) {
            event.preventDefault(); // Empêche le comportement par défaut lié aux touches
            thirdPlayer(event);
        }
    });
    canvas.addEventListener("keydown", thirdPlayer);
    canvas.addEventListener('mousemove', playerMove); // mettre des mouvements pour chacun des joueurs en fonction des sockets reçus
    document.querySelector('#start-game').addEventListener('click', function () {    
        canvasSelected = true;
        game.startButtonClicked = true;
        canvas.focus(); // Donne le focus au canvas    // -------------------------------------------------------------------------------------------------ajout
        if(gameOver == true)
            play();        // -------------------------------------------------------------------------------------------------ajout
        else
            console.log("Erreur");        // -------------------------------------------------------------------------------------------------ajout
    });
    document.querySelector('#stop-game').addEventListener('click', stop);
    // Mouse move event
});

//GESTION DES SOCKETS
const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    // Mettez à jour le jeu en fonction des données reçues du serveur
    // ...
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
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258