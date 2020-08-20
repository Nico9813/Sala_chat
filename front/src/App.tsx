import React, { useState } from 'react';
import './App.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";
import BotonLogin from './BotonLogin';
import BotonLogout from './BotonLogout';

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
const NUEVO_USUARIO = "NUEVO_USUARIO";
const GET_USUARIOS = "GET_USUARIOS";

const coloresDisponibles = ['pink','grey','blue']
const colorEmisor : string = 'green'
var indiceActual = 0

export const App = () => {

  const [texto, setTexto ] = useState<string>('')
  const [mensajes, setMensajes] = useState<IMensaje[]>([])
  const { user, isAuthenticated } = useAuth0();
  const [usuariosActuales, setUsuariosActuales] = useState<Map<string, string>>(new Map<string, string>())
  const [mensajeActual, setMensajeActual] = useState<string>('')
  const [necesitaIdentificacion, setNecesitaIdentificacion] = useState<boolean>(true)

  let getNombre = () => isAuthenticated ? user.name : ''

  let identificar = () => {
    if(necesitaIdentificacion){
      setNecesitaIdentificacion(false)
      client.send(JSON.stringify({ type: NUEVO_USUARIO, payload: { emisor: getNombre() } }))
    }
  }

  client.onopen = () => {

  };

  client.onmessage = (message) => {

    const mensajeParseado = JSON.parse(JSON.parse(JSON.stringify(message.data)))

    const data = mensajeParseado.payload;
    const type = mensajeParseado.type;

    switch (type) {
      case GET_USUARIOS: 
        break;
      case CAMBIAR_TEXTO:
        setTexto(data.data)
        break
      case NUEVO_MENSAJE:
        if (data.emisor != getNombre()) {
          setMensajes([...mensajes, { emisor: data.emisor, contenido: data.data }])
        }
        break;
      case NUEVO_USUARIO:
        usuariosActuales.set(data.emisor, coloresDisponibles[indiceActual % coloresDisponibles.length])
        setUsuariosActuales(usuariosActuales)
        indiceActual++
        setMensajes([...mensajes, { emisor: data.emisor, contenido: 'El usuario ' + data.emisor + ' se unio a la conversacion' }])
        break;
    }
  };

  let actualizarTexto = (nuevoTexto : string) => {
    setTexto(nuevoTexto)
    client.send(JSON.stringify({ type: CAMBIAR_TEXTO, payload: { data: nuevoTexto }}))
  }

  let enviarMensaje = (mensajeNuevo : string) => {
    usuariosActuales.set(getNombre(), colorEmisor)
    setMensajes([...mensajes, { emisor: getNombre(), contenido: mensajeNuevo }])
    client.send(JSON.stringify({ type: NUEVO_MENSAJE, payload: { emisor: getNombre(), data: mensajeNuevo }}))
  }

  let renderMensajes = () => {
    return (
      <div style={{ height: '80%', overflowY: 'scroll', position: 'sticky', background: 'white', borderColor: 'black', border: 1, borderRadius: 5, margin: 5 }}>
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

  let renderUsuarios = () => {
      return(
        <div>
          {JSON.stringify(usuariosActuales)}
        </div>
      )
  }

  return (
    <div style={{display: 'flex'}}>
      <div style={{backgroundColor:'black', borderRadius:10, padding:10, margin: 10, flex: 2, height:750}}>
        <div style={{ display: 'flex', flexDirection: 'column', height:'100%'}}>
          <div style={{ backgroundColor: 'white' , flex: 2, margin:10}}>
            <div style={{display:'flex',alignItems: 'center', alignContent:'center', justifyContent: 'center', margin:10}}>
              <div>
                {isAuthenticated && <p>{user.name}</p>}
              </div>
              <div>
                {isAuthenticated ? <div><BotonLogin /><button style={{ flex: 2, width: 100 }} onClick={() => identificar()}>Enviar</button></div> : <BotonLogin />}
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', flex: 10, margin: 10}}>
            {renderUsuarios()}
          </div>
        </div>
      </div>
      <div style={{flex: 10}}>
        <div style={{ display: 'flex', flexDirection: 'column', height:790}}>
          <div style={{ backgroundColor: 'black', borderRadius: 10, padding: 10, margin: 10, flex: 9 }}>
            <textarea disabled={necesitaIdentificacion} style={{ width: '95%', height:'90%', borderRadius:10, margin: 20}} onChange={(evt) => actualizarTexto(evt.target.value)} value={texto} />
          </div>
          <div style={{ backgroundColor: 'black', borderRadius: 10, padding: 10, margin: 10, flex: 3 }}>
            {renderMensajes()}
            <input disabled={necesitaIdentificacion} style={{ marginLeft: 5, flex: 10, width: '87%' }} value={mensajeActual} onChange={(evt) => setMensajeActual(evt.target.value)} />
            <button style={{ marginLeft: 10, flex: 2, width: '10%' }} onClick={() => enviarMensaje(mensajeActual)}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="App">
      <header className="App-header">

        <div style={{ flex: 9 }}>
          <p>Documento compartido</p>
          <textarea disabled={necesitaIdentificacion} style={{ width: 800, height: 700, overflowY: 'scroll' }} onChange={(evt) => actualizarTexto(evt.target.value)} value={texto} />
        </div>

        <div style={{backgroundColor: 'white'}}>
          {renderUsuarios()}
        </div>

        <div style={{ flex: 3 }}>
          <p>Chat</p>
          <div>
            <div>{getNombre()}</div>
            <BotonLogin />
            <BotonLogout />
            <button style={{ flex: 2, width: 100 }} onClick={() => identificar()}>Enviar</button>
          </div>
          {renderMensajes()}
          <div>
            <input disabled={necesitaIdentificacion} style={{ flex: 10, width: 400 }} value={mensajeActual} onChange={(evt) => setMensajeActual(evt.target.value)} />
            <button style={{ flex: 2, width: 100 }} onClick={() => enviarMensaje(mensajeActual)}>Enviar</button>
          </div>
        </div>
      </header>
    </div>
  );

  return(
    <div>

    </div>
  )
}

export default App;