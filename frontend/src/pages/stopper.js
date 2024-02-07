import React from "react";
import "./styles.css";

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