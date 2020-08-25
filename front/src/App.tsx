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

interface DatosUsuario{
  color: string,
  foto: string,
}

const COLOR_PRIMARIO = '#262626'
const COLOR_SECUNDARIO = 'black'
const COLOR_FUENTE = 'white'

const CAMBIAR_TEXTO = "CAMBIAR_TEXTO";
const NUEVO_MENSAJE = "NUEVO_MENSAJE";
const NUEVO_USUARIO = "NUEVO_USUARIO";
const HANDSHAKE = "HANDSHAKE";

const coloresDisponibles = ['pink','grey','blue']
var indiceActual = 0

export const App = () => {

  const [texto, setTexto ] = useState<string>('')
  const [mensajes, setMensajes] = useState<IMensaje[]>([])
  const { user, isAuthenticated } = useAuth0();
  const [usuariosActuales, setUsuariosActuales] = useState<Map<string, DatosUsuario>>(new Map<string, DatosUsuario>())
  const [mensajeActual, setMensajeActual] = useState<string>('')
  const [necesitaIdentificacion, setNecesitaIdentificacion] = useState<boolean>(true)

  let getNombre = () => isAuthenticated ? user.name : ''

  let identificar = () => {
    if(necesitaIdentificacion){
      setNecesitaIdentificacion(false)
      client.send(JSON.stringify({ type: HANDSHAKE, payload: { emisor: getNombre(), foto: user.picture } }))
      agregarUsuario(getNombre(), user.picture)
    }
  }

  client.onopen = () => {

  };

  client.onmessage = (message) => {

    const mensajeParseado = JSON.parse(JSON.parse(JSON.stringify(message.data)))

    const data = mensajeParseado.payload;
    const type = mensajeParseado.type;

    if (data.emisor !== getNombre()) {
      switch (type) {
        case CAMBIAR_TEXTO:
          setTexto(data.data)
          break
        case NUEVO_MENSAJE:
          setMensajes([...mensajes, { emisor: data.emisor, contenido: data.data }])
          break;
        case NUEVO_USUARIO:
          agregarUsuario(data.emisor,data.foto)
          break;
      }
    }
  };

  let agregarUsuario = (nombre : string, foto : string) => {
    usuariosActuales.set(nombre, {color: coloresDisponibles[indiceActual % coloresDisponibles.length], foto: foto})
    setUsuariosActuales(usuariosActuales)
    indiceActual++
    setMensajes([...mensajes, { emisor: nombre, contenido: 'El usuario ' + nombre + ' se unio a la conversacion' }])
  }

  let actualizarTexto = (nuevoTexto : string) => {
    setTexto(nuevoTexto)
    client.send(JSON.stringify({ type: CAMBIAR_TEXTO, payload: { data: nuevoTexto }}))
  }

  let enviarMensaje = (mensajeNuevo : string) => {
    setMensajes([...mensajes, { emisor: getNombre(), contenido: mensajeNuevo }])
    client.send(JSON.stringify({ type: NUEVO_MENSAJE, payload: { emisor: getNombre(), data: mensajeNuevo }}))
  }

  let getColorUsuario = (emisor : string) : string => {
    return usuariosActuales.get(emisor)?.color || 'white'
  }

  let getFotoUsuario = (emisor : string) : string => {
    return usuariosActuales.get(emisor)?.foto || ''
  }

  let renderMensaje = (mensaje : IMensaje, index : number) => {

    return(
      <div key={index}
        style={{
          flexDirection: 'column',
          color: 'black',
          backgroundColor: getColorUsuario(mensaje.emisor) || 'white',
          margin: 5,
          position: 'inherit',
          left: 10,
          padding: 5,
          borderRadius: 5,
          fontSize: 15
        }}>
        <b>{mensaje.emisor}</b> : {mensaje.contenido}
      </div>
    )
  }

  let renderMensajes = () => {
    return (
      <div style={{ maxHeight: 145, height: '100%', marginLeft:15, width:'97%', overflowY: 'scroll', position: 'sticky', background: 'white', borderColor: 'black', border: 1, borderRadius: 5}}>
        <div style={{ bottom: 0, height: '100%' }}>
          {mensajes.map((mensaje: IMensaje, index: number) =>
            renderMensaje(mensaje,index)
          )}
        </div>
      </div>
    )
  }

  let renderUsuarios = () => {

    let usuariosRenderizables : Array<any> = []

    usuariosActuales.forEach( (datos, usuario) => {
      usuariosRenderizables.push(
        <div key={usuario} style={{display: 'flex', flexDirection: 'row', borderWidth:'1px'}}>
          <div className='usuario-conectado' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
            <div style={{ flex: 2}}>
              <div>
                <img src={datos?.foto} height="40" width="40" style={{borderRadius: 20, margin: 2}}/>
              </div>
            </div>
            <div style={{ flex: 10 }}>
              <b style={{ color: 'black' }}>{usuario}</b>
            </div>
        </div>
      </div>)
    })

    return(
      <div>
        {usuariosRenderizables}
      </div>
    )
  }

  return (
    <div className='flex-container' style={{ backgroundColor: COLOR_SECUNDARIO }}>
      <div style={{ backgroundColor: COLOR_PRIMARIO, flex: 2 ,height: '98vh', width: '100vw', margin: 10, borderRadius:5}}>
        <div className='flex-container' style={{ flexDirection: 'column', height: '100%' }}>
          <div style={{ backgroundColor: COLOR_SECUNDARIO, flex: 2, margin: 10, borderRadius:5 }}>
            <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'center', alignContent: 'center', justifyContent: 'center', margin: 10 }}>
              <div style={{flex: 6}}>
                <div className='flex-container'>
                  <div style={{flex: 6, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
                    {isAuthenticated && <img src={user.picture} height="40" width="40" style={{ borderRadius: 20, margin: 25 }} />}
                  </div>
                  <div style={{ flex: 6 }}>
                    {isAuthenticated && <p style={{ color: COLOR_FUENTE }}>{user.name}</p>}
                  </div>
                </div>
              </div>
              <div style={{ flex: 6 }}>
                {isAuthenticated ? 
                  <div>
                    <BotonLogout />
                    <button className="button" style={{ flex: 2, width: 100 }} onClick={() => identificar()}>Enviar</button>
                  </div> 
                  : 
                  <div>
                    <BotonLogin />
                  </div>
                  }
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: COLOR_SECUNDARIO, flex: 10, margin: 10 }}>
            {renderUsuarios()}
          </div>

        </div>
      </div>
      <div style={{ flex: 10 }}>
        <div className='flex-container' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className='flex-container' style={{ backgroundColor: COLOR_PRIMARIO, flex: 9, borderRadius: 5}}>
            <textarea disabled={necesitaIdentificacion} style={{ margin:15, padding: 15, height: '90%', width: '95%' }} onChange={(evt) => actualizarTexto(evt.target.value)} value={texto} />
          </div>
          <div className='flex-container' style={{ backgroundColor: COLOR_PRIMARIO, flex: 3, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <div style={{ flex: 11 }}>
              {renderMensajes()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 10, margin: 10 }}>
                  <input disabled={necesitaIdentificacion} style={{ width: '100%', margin:5, padding:5 }} value={mensajeActual} onChange={(evt) => setMensajeActual(evt.target.value)} />
                </div>
                <div style={{ flex: 2, margin: 10 }}>
                  <button className="button" style={{ width: '100%' }} onClick={() => enviarMensaje(mensajeActual)}>Ingresar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;