import React from 'react';
import IDatosUsuario from '../tipos/datosUsuario';
import IMensaje from '../tipos/mensajes'
import * as Colores from '../constantes/color'

interface IpropListadoMensajes {
  mensajes : IMensaje[],
  usuariosActuales: Map<string, IDatosUsuario>
}

export const ListadoMensajes = (props : IpropListadoMensajes) => {

  let getColorOrDefault = (emisor : string) => props.usuariosActuales.get(emisor)?.color || 'white'
  let getFotoOrDefault = (emisor : string) => props.usuariosActuales.get(emisor)?.foto || ''

  let renderMensaje = (mensaje : IMensaje, index : number) => {
    return(
      <div key={index} style={{display: 'flex', flexDirection:'row'}}>
        <div style={{margin: 5, zIndex:2}}>
          <img src={getFotoOrDefault(mensaje.emisor)} style={{ width: '40px', height: '40px', borderRadius: 25}}/>
        </div>
        <div
          style={{
            flexDirection: 'column',
            color: 'black',
            backgroundColor: getColorOrDefault(mensaje.emisor) || 'white',
            margin: 10,
            marginLeft: -20,
            zIndex:1,
            position: 'inherit',
            left: 10,
            padding: 5,
            maxHeight: 20,
            borderRadius: 5,
            fontSize: 15,
            flex:11
          }}>
          <b style={{marginLeft: 15}}>{mensaje.emisor}</b> :{mensaje.contenido}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxHeight: '19vh', height: '100%', marginLeft: 15, width: '97%', overflowY: 'scroll', position: 'sticky', backgroundColor: Colores.COLOR_SECUNDARIO, borderColor: 'black', border: 1, borderRadius: 5 }}>
      <div style={{ bottom: 0, height: '100%' }}>
        {props.mensajes.map((mensaje: IMensaje, index: number) =>
          renderMensaje(mensaje, index)
        )}
      </div>
    </div>
  )
}