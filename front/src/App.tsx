import React from 'react';
import logo from './logo.svg';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

class App extends React.Component {

  state = {
    texto: "asdasd",
    mensajes: [],
    mensajesRecibidos:[]
  }

  componentWillMount(){
  
    client.onopen = () => {
      
    };

    client.onmessage = (message) => {
      this.setState({texto: message.data.toString()})
    };
  }

  actualizarTexto(nuevoTexto : any){
    client.send(JSON.stringify({ type: "CAMBIAR_TEXTO", data: nuevoTexto }))
    this.setState({ texto: nuevoTexto })
  }

  renderMensajes() {
    return(
      <div>

      </div>
    )
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Documento compartido
          </p>
          <textarea style={{width: 500, height: 300}} onChange={(evt) => this.actualizarTexto(evt.target.value)} value={this.state.texto} />
          {this.renderMensajes()}
        </header>
      </div>
    );
  }
}

export default App;
