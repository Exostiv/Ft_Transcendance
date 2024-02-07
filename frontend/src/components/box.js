import React from 'react';

/* Enum */
const BACKGROUND = 0;
const PLAYER = 1;
const BALL = 2;
export {
    BACKGROUND,
    PLAYER,
    BALL,
}
/* style sheet */
const backgroundStyle = {
    height: "35px",
    width: "35px",
    justifyContent: "center",
    backgroundColor : "black",
}
const playerStyle = {
    height: "35px",
    width: "35px",
    justifyContent: "center",
    backgroundColor : "purple",
    color: "white"
}

const ballStyle = {
    height: "35px",
    width: "35px",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color:"white",
    zIndex: "10",
    position: 'relative'
}

/* function to select style */
const getStyle = (val) => {
    if (val === BACKGROUND) {
        return {};
    } if (val === PLAYER) {
        return playerStyle;
    } else {
        return ballStyle;
    }
}

const Box = (props) => <div style={backgroundStyle}> 
                        <div style={getStyle(props.name)} /> 
                    </div>

export default Box;