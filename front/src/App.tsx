import React from 'react';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

interface IMensaje {
  emisor: string,
  contenido : string
}

interface IProps {

}

interface IState {
  texto : string,
  mensajes : Array<IMensaje>,
  nombre : string,
  usuariosActuales : Map<string, string>,
  mensajeActual : string
}

const CAMBIAR_TEXTO = "CAMBIAR_TEXTO";
const NUEVO_MENSAJE = "NUEVO_MENSAJE";

const coloresDisponibles = ['pink','grey','blue']
const colorEmisor = 'green'
var indiceActual = 0

class App extends React.PureComponent<IProps,IState> {

  readonly state = { texto: '', mensajes:[], nombre:'', usuariosActuales: new Map<string,string>(), mensajeActual:''}

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
            if(!this.state.usuariosActuales.get(data.emisor)){
              this.state.usuariosActuales.set(data.emisor, coloresDisponibles[indiceActual % coloresDisponibles.length])
              indiceActual++
              this.setState({ mensajes: [...this.state.mensajes, { emisor: data.emisor, contenido: 'El usuario ' + data.emisor + ' se unio a la conversacion' }] })
            }
            this.setState({mensajes: [...this.state.mensajes, {emisor: data.emisor, contenido: data.data}] })
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
    this.state.usuariosActuales.set(this.state.nombre, colorEmisor)
    this.setState({ ...this.state, mensajes: [...this.state.mensajes, { emisor: this.state.nombre, contenido: mensajeNuevo}] })
    client.send(JSON.stringify({ type: NUEVO_MENSAJE, emisor: this.state.nombre, data: mensajeNuevo }))
  }

  renderMensajes() {
    return(
      <div style={{ height: 500, overflowY: 'scroll', position: 'sticky', background: 'white', borderColor: 'black', border: 1, borderRadius: 5, margin: 5 }}>
        <div style={{bottom:0, height:'100%', width:'100%'}}>
          {this.state.mensajes.map((mensaje: IMensaje, index: number) =>
            <div key={index}
              style={{
                flexDirection: 'column',
                color: 'black',
                backgroundColor: this.state.usuariosActuales.get(mensaje.emisor),
                margin: 5,
                position: 'inherit',
                left: 10,
                padding: 5,
                borderRadius: 5,
                fontSize: 15
              }}>
              <b>{mensaje.emisor}</b> : {mensaje.contenido}
            </div>
          )}
        </div>
      </div>
    )
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          
            <div style={{ flex: 9}}>
              <p>Documento compartido</p>
              <textarea style={{ width: 800, height: 700, overflowY: 'scroll' }} onChange={(evt) => this.actualizarTexto(evt.target.value)} value={this.state.texto} />
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