import React from 'react';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

interface IMensaje {
  emisor: String,
  contenido : String
}

const CAMBIAR_TEXTO = "CAMBIAR_TEXTO";
const NUEVO_MENSAJE = "NUEVO_MENSAJE";

class App extends React.Component {

  state = {
    texto: "",
    mensajes: [],
    nombre: '',
    usuariosActuales: [],
    mensajeActual:'asd'
  }

  componentDidMount(){
    client.onopen = () => {
      
    };

    client.onmessage = (message) => {
      const data = JSON.parse(JSON.parse(JSON.stringify(message.data)))

      console.log(data)

      switch(data.type){
        case CAMBIAR_TEXTO:
          this.setState({ ...this.state, texto: data.data })
          break
        case NUEVO_MENSAJE:
          if(data.emisor != this.state.nombre){
            this.setState({ ...this.state, mensajes: [...this.state.mensajes, {emisor: data.emisor, contenido: data.data }] })
          }
          break;
      }

      this.setState({ ...this.state, texto: data.data})
    };
  }

  actualizarTexto(nuevoTexto : any){
    this.setState({ ...this.state, texto: nuevoTexto })
    client.send(JSON.stringify({ type: CAMBIAR_TEXTO, data: nuevoTexto }))
  }

  enviarMensaje(mensajeNuevo: string) {
    this.setState({ ...this.state, mensajes: [...this.state.mensajes, { emisor: this.state.nombre, contenido: mensajeNuevo }] })
    client.send(JSON.stringify({ type: NUEVO_MENSAJE, emisor: this.state.nombre, data: mensajeNuevo }))
  }

  renderMensajes() {
    return(
      <div style={{ minHeight: 400, background: 'white', borderColor: 'black', border: 1, borderRadius: 5, margin: 5 }}>
        {this.state.mensajes.map( (mensaje : IMensaje, index : number) => 
        <div>
            <div key={index}
              style={{
                flexDirection: 'column',
                color: 'black',
                float: 'left',
                margin: 5,
                padding: 5,
                borderRadius: 5,
                fontSize: 15
              }}>
              <b style={{color: (mensaje.emisor == this.state.nombre) ? 'green' : 'pink'}}>{mensaje.emisor}</b> : {mensaje.contenido}
            </div>
            <br />
        </div>
        )}
      </div>
    )
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          
            <div style={{ flex: 9}}>
              <p>Documento compartido</p>
              <textarea style={{ width: 800, height: 700 }} onChange={(evt) => this.actualizarTexto(evt.target.value)} value={this.state.texto} />
            </div>

            <div style={{ flex: 3 }}>
              <p>Chat</p>
              <input style={{ flex: 10, width: 400 }} value={this.state.nombre} onChange={(evt) => this.setState({nombre: evt.target.value})}/>
              {this.renderMensajes()}
              <div>
                <input style={{ flex: 10, width: 400 }} value={this.state.mensajeActual} onChange={(evt) => this.setState({mensajeActual: evt.target.value})}/>
                <button style={{ flex: 2, width: 100 }} onClick={() => this.enviarMensaje(this.state.mensajeActual)}>Enviar</button>
              </div>
            </div>
        </header>
      </div>
    );
  }
}

export default App;