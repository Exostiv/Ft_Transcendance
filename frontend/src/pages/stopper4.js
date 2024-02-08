import React from "react";
import "./styles4.css";

export default class Stopper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stoper: 0,
      paused: false
    };
  }

  tick() {
    this.setState({ stoper: this.state.stoper + 1 });
  }

  componentDidMount() {
    this.myTimerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myTimerID);
  }
  render() {
    return (
      <div>
        <h1>Stopwatch: {this.state.stoper}</h1>
        <button onClick={() => this.setState({ paused: !this.state.paused })}>
          {this.state.paused ? "Resume" : "Pause"}
        </button>
      </div>
    );
  }
}