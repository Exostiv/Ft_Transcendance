import { useRef, useEffect } from 'react';
import PongGame from './PongGame5';
export function Canvas(props) {
const canvasRef = useRef(null);


useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.fillRect(0, 0, props.width, props.height);
canvas.addEventListener('click', () => {
  context.fillStyle = 'blue';
  context.fillRect(0, 0, props.width, props.height);
});
}, []);


return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

export default PongGame