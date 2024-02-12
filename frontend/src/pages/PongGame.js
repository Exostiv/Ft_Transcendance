import React, { useEffect, useRef, useState } from 'react';
import "./pongGame.css"
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;
var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};

const PongGame = () => {
  const canvasRef = useRef(null);
  const [game, setGame] = useState({
    feature: {
      on: true,
    },
    player: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: "Marco",
    },
    computer: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: "Jeannot",
    },
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      r: 5,
      speed: {
        x: 6,
        y: 6,
      },
    },
  });

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0,0, context.canvas.width, context.canvas.height)
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'purple';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.beginPath();
    if(game.feature.on == false)
    {
      context.fillStyle = 'white';
      context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
      context.fill();
    }
    else
    {
      context.fillStyle = colorsArrows.Value[colorsArrows.i];
      context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
      context.fill();
    }
  };

  let animId


  // JOUEUR MOVE

  // const player2Move = (event) => {
  //   const canvas = canvasRef.current;
  //   const canvasPos = canvas.getBoundingClientRect();
    
  // };


// MOUSE MOVE 

  // const playerMove = (event) => {
  //   const canvas = canvasRef.current;
  //   const canvasPos = canvas.getBoundingClientRect();
  //   const mousePos = event.clientY - canvasPos.y;

  //   if (mousePos < 0) {
  //     setGame((prevGame) => ({
  //       ...prevGame,
  //       player: {
  //         ...prevGame.player,
  //         y: 0,
  //       },
  //     }));
  //   } else if (mousePos > CANVAS_HEIGHT - PLAYER_HEIGHT) {
  //     setGame((prevGame) => ({
  //       ...prevGame,
  //       player: {
  //         ...prevGame.player,
  //         y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
  //       },
  //     }));
  //   } else {
  //     setGame((prevGame) => ({
  //       ...prevGame,
  //       player: {
  //         ...prevGame.player,
  //         y: mousePos,
  //       },
  //     }));
  //   }
  // };

  const ballMove = () => {
    const canvas = canvasRef.current;
    const { ball } = game;
    if (game.ball.y + game.ball.r >= CANVAS_HEIGHT || ball.y - ball.r < 0){
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            y: ball.speed.y * -1,
          },
        },
      }));
    }
    setGame((prevGame) => ({
      ...prevGame,
      ball: {
        ...prevGame.ball,
        x: prevGame.ball.x + prevGame.ball.speed.x,
        y: prevGame.ball.y + prevGame.ball.speed.y,
      },
    }));
    draw();
    if (ball.x + ball.r > canvas.width - PLAYER_WIDTH) {
      collide(game.computer);
    }
    else if (ball.x - ball.r < PLAYER_WIDTH) {
      collide(game.player);
    }
  };

  const collide = (Who) => {
    var canvas = canvasRef.current;
    const { ball } = game;
    if (game.ball.y < Who.y || game.ball.y > Who.y + PLAYER_HEIGHT) {
      // var context = canvas.getContext('2d');
      // context.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
      game.ball.x = canvas.width / 2;
      game.ball.y = canvas.height / 2;
      game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
      game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
      //game.thirdPlayer.y = canvas.height / 2 - PLAYER_HEIGHT * 3 / 2; //Mis en commentaire pour éviter l'altération du comp -1
      //reset de tout le canva (au dessus) + reset de la speed 
      //colorsArrows.i = 0; // reset par la couleur par défaut
      draw();
      game.ball.speed.x = 6;
      game.ball.speed.y = 6;
      // Evenement précedent (du player) correspond au joueur, +1 point à l'ordinateur
      if (Who !== game.computer) {
          game.computer.score++;
          //document.querySelector('#computer-score').textContent = game.computer.score;
      } else {
          game.player.score++;
          //document.querySelector('#player-score').textContent = game.player.score;
      }
    }
    else {
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            x: ball.speed.x * -1,
          },
        },
      }));
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          x: prevGame.ball.x + prevGame.ball.speed.x,
          y: prevGame.ball.y + prevGame.ball.speed.y,
        },
      }));
      draw();
    }
  };

  const stop = () => {
    cancelAnimationFrame(animId);
    // Reset game state
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Vérifiez la touche de clavier appuyée
      switch (event.key) {
        case 'ArrowUp':
          setGame((prevGame) => ({
            ...prevGame,
            player: {
              ...prevGame.player,
              y: Math.max(0, prevGame.player.y - PLAYER_HEIGHT/5),
            },
          }));
          break;
        case 'ArrowDown':
          setGame((prevGame) => ({
            ...prevGame,
            player: {
              ...prevGame.player,
              y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.player.y + PLAYER_HEIGHT/5),
            },
          }));
          break;
        default:
          // Ne rien faire pour les autres touches
          break;
      }
      switch (event.keyCode) {
        case 81:
          setGame((prevGame) => ({
            ...prevGame,
            computer: {
              ...prevGame.computer,
              y: Math.max(0, prevGame.computer.y - PLAYER_HEIGHT/5),
            },
          }));
          break;
        case 65:
          setGame((prevGame) => ({
            ...prevGame,
            computer: {
              ...prevGame.computer,
              y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.computer.y + PLAYER_HEIGHT/5),
            },
          }));
          break;
        default:
          // Ne rien faire pour les autres touches
          break;}
    };

    // Ajoutez un écouteur d'événement lors du montage du composant
    document.addEventListener('keydown', handleKeyDown);

    // Nettoyez l'écouteur d'événement lors du démontage du composant
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let lastFrameTime = performance.now();
    const targetFPS = 200; // Définissez votre FPS cible ici
    const frameInterval = 1 / targetFPS;
    let animId;
  
    const update = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
  
      if (deltaTime >= frameInterval) {
        if(colorsArrows.i == 3)
          colorsArrows.i = 0;
        else
          colorsArrows.i += 1;
        draw();
        ballMove();
  
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
  
      animId = requestAnimationFrame(update);
    };
  
    update();
  
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [game.ball.x]);

  const handleFeature = () => {
    if(game.feature.on == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        feature: {
          ...prevGame.feature,
          on:false,
        },
      }));
    }
    else
    {
      setGame((prevGame) => ({
        ...prevGame,
        feature: {
          ...prevGame.feature,
          on:true,
        },
      }));
    }
  };

  return (
    <div className = "canvas">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      {/* <button onClick={stop}>Stop</button> */}
      <div className = "scorej1">{game.player.name} : {game.player.score}</div>
      <div className = "scorej2">{game.computer.name} : {game.computer.score}</div>
      <button id = "featureB" className = "Feature" onClick={handleFeature}>Feature ON/OFF</button>
    </div>
  );
};

export default PongGame;
