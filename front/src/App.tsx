import React, { useEffect, useState } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { useAuth0 } from "@auth0/auth0-react";

import BotonLogin from './components/BotonLogin';
import BotonLogout from './components/BotonLogout';
import * as Acciones from './constantes/acciones'
import * as Colores from './constantes/color'
import IMensaje from './tipos/mensajes'
import IDatosUsuario from './tipos/datosUsuario'
import { ListadoUsuarios } from './components/listadoUsuarios';
import { Chat } from './components/Chat';

const client = new W3CWebSocket('ws://127.0.0.1:8000');

export const App = () => {

  const [texto, setTexto] = useState<string>('')
  const [mensajes, setMensajes] = useState<IMensaje[]>([])
  const { user, isAuthenticated } = useAuth0();
  const [usuariosActuales, setUsuariosActuales] = useState<Map<string, IDatosUsuario>>(new Map<string, IDatosUsuario>())

  useEffect( () => {
    if(isAuthenticated){
      client.send(JSON.stringify({ type: Acciones.HANDSHAKE, payload: { emisor: user.name, foto: user.picture } }))
      agregarUsuario('0', user.name, user.picture)
    }
  }, [isAuthenticated])

  client.onopen = () => {

  };

  client.onmessage = (message) => {
    const mensajeParseado = JSON.parse(message.data.toString())

    console.log(mensajeParseado)

    const data = mensajeParseado.payload;
    const id = mensajeParseado.id
    const type = mensajeParseado.type;
    const emisor = usuariosActuales.get(id) ?? user;
    
      switch (type) {
        case Acciones.CAMBIAR_TEXTO:
          setTexto(data.data)
          break
        case Acciones.NUEVO_MENSAJE:
          setMensajes([...mensajes, { emisor: emisor, contenido: data.data }])
          break;
        case Acciones.NUEVO_USUARIO:
          agregarUsuario(id, data.emisor, data.foto)
          break;
      }
  };

  const agregarUsuario = (id : string, nombre: string, foto: string) => {
    const nuevo_usuario = { nombre: nombre, color: Colores.getProximoColor(), foto: foto }
    usuariosActuales.set(id, nuevo_usuario)
    setUsuariosActuales(usuariosActuales)
    setMensajes([...mensajes, { emisor: nuevo_usuario, contenido: 'El usuario ' + nombre + ' se unio a la conversacion' }])
  }

  const actualizarTexto = (nuevoTexto: string) => {
    setTexto(nuevoTexto)
    client.send(JSON.stringify({ type: Acciones.CAMBIAR_TEXTO, payload: { data: nuevoTexto } }))
  }

  const enviarMensaje = (mensajeNuevo: string) => {
    setMensajes([...mensajes, { emisor: usuariosActuales.get('0')?? user, contenido: mensajeNuevo }])
    client.send(JSON.stringify({ type: Acciones.NUEVO_MENSAJE, payload: { data: mensajeNuevo } }))
  }

  return (
    <div className='flex-container' style={{ backgroundColor: Colores.COLOR_PRIMARIO }}>
      <div style={{ flex: 2, height: '98vh', width: '100vw', margin: 10, borderRadius: 5 }}>
        <div className='flex-container' style={{ flexDirection: 'column', height: '100%' }}>
          <div style={{ backgroundColor: Colores.COLOR_SECUNDARIO, flex: 1, margin: 10, borderRadius: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center', margin: 10 }}>
              <div style={{ flex: 8}}>
                <div className='flex-container'>
                  <div style={{ flex: 6, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                    {isAuthenticated && <img src={user.picture} height="35" width="35" style={{ borderRadius: 20, margin: 25 }} />}
                  </div>
                  <div style={{ flex: 6 }}>
                    {isAuthenticated && <p style={{ color: Colores.COLOR_FUENTE, margin: 25}}>{user.name}</p>}
                  </div>
                </div>
              </div>
              <div style={{ flex: 4 }}>
                {isAuthenticated ?
                  <div>
                    <BotonLogout />
                  </div>
                  :
                  <div>
                    <BotonLogin />
                  </div>
                }
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: Colores.COLOR_SECUNDARIO, flex: 10, margin: 10, borderRadius: 10 }}>
            <ListadoUsuarios usuariosActuales={usuariosActuales}/>
          </div>
        </div>
      </div>
      <div style={{ flex: 10 }}>
        <div className='flex-container' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className='flex-container' style={{ backgroundColor: Colores.COLOR_PRIMARIO, flex: 9, borderRadius: 5 }}>
            <textarea disabled={!isAuthenticated} style={{ backgroundColor: Colores.COLOR_SECUNDARIO, color: Colores.COLOR_FUENTE, margin: 15, padding: 15, height: '90%', width: '95%', borderRadius: 10 }} onChange={(evt) => actualizarTexto(evt.target.value)} value={texto} />
          </div>
          <Chat enviarMensaje={enviarMensaje} mensajes={mensajes} isAuthenticated={isAuthenticated}></Chat>
        </div>
      </div>
    </div>
  )
}

export default App;