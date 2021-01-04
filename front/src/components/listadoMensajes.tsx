import React from 'react';
import IMensaje from '../tipos/mensajes'

interface IpropListadoMensajes {
  mensajes : IMensaje[]
}

export const ListadoMensajes = (props : IpropListadoMensajes) => {

  const { mensajes } = props

  let renderMensaje = (mensaje : IMensaje, index : number) => {

    const { emisor, contenido } = mensaje

    return(
      <div key={index} style={{display: 'flex', flexDirection:'row'}}>
        <div style={{margin: 5, zIndex:2}}>
          <img src={emisor.foto} style={{ width: '40px', height: '40px', borderRadius: 25}}/>
        </div>
        <div
          style={{
            flexDirection: 'column',
            color: 'black',
            backgroundColor: emisor.color || 'white',
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
          <b style={{ marginLeft: 15 }}>{emisor.nombre}</b> :{contenido}
        </div>
      </div>
    )
  }

  return (
    <>
      {mensajes.map((mensaje: IMensaje, index: number) =>
          renderMensaje(mensaje, index)
        )}
    </>
  )
}