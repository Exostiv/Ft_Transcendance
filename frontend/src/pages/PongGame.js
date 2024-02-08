import React, { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas'

const PongGame = () => {
  
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.fillrect(0, 0, 3000, 3000)
  }
  return <Canvas draw={draw} />
}

export default PongGame

// site https://akilgg.medium.com/the-canvas-tutorial-for-pong-5170fbee1e85