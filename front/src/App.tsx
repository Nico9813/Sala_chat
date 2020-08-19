import React, { useState } from 'react';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";
import BotonLogin from './BotonLogin';
import BotonLogout from './BotonLogout';

import { useWebSocket } from './hooks/useWebSocket'
import { useAuth0 } from "@auth0/auth0-react";

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
const colorEmisor : string = 'green'
var indiceActual = 0

export const App = () => {

  const [texto, setTexto ] = useState<string>('')
  const [mensajes, setMensajes] = useState<IMensaje[]>([])
  const { user, isAuthenticated } = useAuth0();
  const [usuariosActuales, setUsuariosActuales] = useState<Map<string, string>>(new Map<string, string>())
  const [mensajeActual, setMensajeActual] = useState<string>('')

  let getNombre = () => isAuthenticated ? user.name : ''

  client.onopen = () => {

  };

  client.onmessage = (message) => {
    const data = JSON.parse(JSON.parse(JSON.stringify(message.data)))
    console.log(data)

    switch (data.type) {
      case CAMBIAR_TEXTO:
        setTexto(data.data)
        break
      case NUEVO_MENSAJE:
        if (data.emisor != getNombre()) {
          if (!usuariosActuales.get(data.emisor)) {
            usuariosActuales.set(data.emisor, coloresDisponibles[indiceActual % coloresDisponibles.length])
            setUsuariosActuales(usuariosActuales)
            indiceActual++
            setMensajes([...mensajes, { emisor: data.emisor, contenido: 'El usuario ' + data.emisor + ' se unio a la conversacion' }])
          }
          setMensajes([...mensajes, { emisor: data.emisor, contenido: data.data }])
        }
        break;
    }
  };

  let actualizarTexto = (nuevoTexto : string) => {
    setTexto(nuevoTexto)
    client.send(JSON.stringify({ type: CAMBIAR_TEXTO, data: nuevoTexto }))
  }

  let enviarMensaje = (mensajeNuevo : string) => {
    usuariosActuales.set(getNombre(), colorEmisor)
    setMensajes([...mensajes, { emisor: getNombre(), contenido: mensajeNuevo }])
    client.send(JSON.stringify({ type: NUEVO_MENSAJE, emisor: getNombre(), data: mensajeNuevo }))
  }

  let renderMensajes = () => {
    return (
      <div style={{ height: 500, overflowY: 'scroll', position: 'sticky', background: 'white', borderColor: 'black', border: 1, borderRadius: 5, margin: 5 }}>
        <div style={{ bottom: 0, height: '100%', width: '100%' }}>
          {mensajes.map((mensaje: IMensaje, index: number) =>
            <div key={index}
              style={{
                flexDirection: 'column',
                color: 'black',
                backgroundColor: usuariosActuales.get(mensaje.emisor),
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

  return (
    <div className="App">
      <header className="App-header">

        <div style={{ flex: 9 }}>
          <p>Documento compartido</p>
          <textarea style={{ width: 800, height: 700, overflowY: 'scroll' }} onChange={(evt) => actualizarTexto(evt.target.value)} value={texto} />
        </div>

        <div style={{ flex: 3 }}>
          <p>Chat</p>
          <div>
            <div>{getNombre()}</div>
            <BotonLogin />
            <BotonLogout />
          </div>
          {renderMensajes()}
          <div>
            <input style={{ flex: 10, width: 400 }} value={mensajeActual} onChange={(evt) => setMensajeActual(evt.target.value)} />
            <button style={{ flex: 2, width: 100 }} onClick={() => enviarMensaje(mensajeActual)}>Enviar</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;