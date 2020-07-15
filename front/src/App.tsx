import React from 'react';
import logo from './logo.svg';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

class App extends React.Component {

  state = {
    texto: ""
  }

  componentWillMount(){
  
    client.onopen = () => {
      
    };

    client.onmessage = (message) => {
      const mensaje = JSON.stringify(message.data);
      this.setState({texto: mensaje})
    };
  }

  actualizarTexto(nuevoTexto : any){
    client.onopen = () => {
      client.send(JSON.stringify({ type: "CAMBIAR_TEXTO", data: nuevoTexto }))
    };
    this.setState({ texto: nuevoTexto })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Texto: {this.state.texto}.
        </p>
          <button onClick={() => this.actualizarTexto("asd")}>Cambiar texto</button>
        </header>
      </div>
    );
  }

  
}

export default App;
