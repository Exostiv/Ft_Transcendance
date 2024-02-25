import React, { useEffect, useRef, useState } from 'react';
import "./pongGame.css"
import useUser from "../hooks/useUserStorage";
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 12;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;
const TOWIN = 1;
var colorsArrows = {
  i : 0,
  Value : ['white','red','green','yellow']
};

const PongGameIa = () => {

  const user = useUser("user");
  const p1 = user.get("username");
  const canvasRef = useRef(null);
  const [game, setGame] = useState({
    feature: {
      on: false,
    },
    play:false,
    winner:false,
    winnerN:'',
    keysPressed: {
      player:{
        ArrowUp:false,
        ArrowDown:false,
      },
    },
    player: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: p1,
    },
    computer: {
      y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      score: 0,
      name: "AI",
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
    setGame((prevGame) => ({  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        ...prevGame,
        computer: {
          ...prevGame.computer,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.computer.y += ball.speed.y * 0.65),
        },
      }));
    if (ball.x + ball.r/2 >= canvas.width - PLAYER_WIDTH) {
      ball.x = canvas.width - PLAYER_WIDTH - ball.r/2 - 1;
      collide(game.computer);
    }
    else if (ball.x - ball.r /2 <= PLAYER_WIDTH) {
      ball.x = PLAYER_WIDTH + ball.r/2 + 1;
      collide(game.player);
    }
    playerMove();
  };

  const pongPad = (playerPosition) => {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

  const collide = (Who) => {
    const { ball } = game;
    if (game.ball.y < Who.y || game.ball.y > Who.y + PLAYER_HEIGHT) {
      resetCanva();
      if (Who !== game.computer) {
          game.computer.score++;
      } else {
          game.player.score++;
      }
      // Implementer fin de partie |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    }
    else {
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          speed: {
            ...prevGame.ball.speed,
            x: ball.speed.x * -1.2,
          },
        },
      }));
      pongPad(Who.y);
      setGame((prevGame) => ({
        ...prevGame,
        ball: {
          ...prevGame.ball,
          x: prevGame.ball.x + prevGame.ball.speed.x,
          y: prevGame.ball.y + prevGame.ball.speed.y,
        },
      }));
    }
  };



  const playerMove = () => {

    if(game.keysPressed.player.ArrowUp == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.max(0, prevGame.player.y - PLAYER_HEIGHT/5),
        },
      }));
    }
    else if(game.keysPressed.player.ArrowDown == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        player: {
          ...prevGame.player,
          y: Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, prevGame.player.y + PLAYER_HEIGHT/5),
        },
      }));
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        game.keysPressed.player.ArrowUp = true;
        break;
      case 'ArrowDown':
        game.keysPressed.player.ArrowDown = true;
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        game.keysPressed.player.ArrowUp = false;
        break;
      case 'ArrowDown':
        game.keysPressed.player.ArrowDown = false;
        break;
    }
  };

  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  useEffect(() => {
    let lastFrameTime = performance.now();
    const targetFPS = 200; // FPS
    const frameInterval = 1 / targetFPS;
    const { ball } = game;
    let animId;
    const update = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      //comp movement
      if (deltaTime >= frameInterval) {
        if(colorsArrows.i == 3)
          colorsArrows.i = 0;
        else
          colorsArrows.i += 1;

        draw(); // a verifier ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        if(game.play == true){
        ballMove();

      }
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      animId = requestAnimationFrame(update);
    };
    if(game.computer.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner= true;
      game.winnerN = game.computer.name;
    }
    else if(game.player.score == TOWIN)
    {
      resetCanva();
      draw();
      game.winner = true;
      game.winnerN = game.player.name;
    }
    else
      update();
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [game.ball.x, game.play]);

  const handlePlay = () => {
    if(game.play == true)
    {
      setGame((prevGame) => ({
        ...prevGame,
        play:false,
      }));
    }
    else
    {
      setGame((prevGame) => ({
        ...prevGame,
        play:true,
      }));
    }
    console.log(game.play);
  };


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

  const resetCanva =() => {

    setGame((prevGame) => ({
      ...prevGame,
      player:{
        ...prevGame.player,
        y:CANVAS_HEIGHT/2 - PLAYER_HEIGHT / 2,
      },
      player3:{
        ...prevGame.player3,
        y:CANVAS_HEIGHT /2 - PLAYER_HEIGHT,
      },
      computer:{
        ...prevGame.computer,
        y:CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      },
      ball: {
        ...prevGame.ball,
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        speed: {
          ...prevGame.ball.speed,
          x:6,
          y:6,
        },
      },
    }));
  }

  return (
    <div className = "canvas">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      {game.winner && (
          <div class="alert alert-primary" role="alert" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
            {game.winnerN} won the Match ! <a href="/modepong" class="alert-link">Back</a> 
          </div>
      )}
      <div className = "scorej1">{game.player.name} : {game.player.score}</div>
      <div className = "scorej2">{game.computer.name} : {game.computer.score}</div>
      <button id = "featureB" className = "Feature" onClick={handleFeature}>Feature ON/OFF</button>
      <button id = "play" className = "play" onClick={handlePlay}>Play!</button>
    </div>
  );
};

export default PongGameIa;