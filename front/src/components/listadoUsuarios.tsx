import React from 'react';
import { COLOR_FUENTE, COLOR_PRIMARIO } from '../constantes/color';
import IDatosUsuario from '../tipos/datosUsuario'

interface IpropListadoUsuarios {
  usuariosActuales: Map<string, IDatosUsuario>
}

export const ListadoUsuarios = (props: IpropListadoUsuarios) => {

  let usuariosRenderizables: Array<any> = []
  
  props.usuariosActuales.forEach((datos : IDatosUsuario, usuario : string) => {
    usuariosRenderizables.push(
      <div key={usuario} style={{ display: 'flex', flexDirection: 'row', borderWidth: '1px' }}>
        <div className='usuario-conectado' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: datos?.color }}>
          <div style={{ flex: 2 }}>
            <div>
              <img src={datos?.foto} height="40" width="40" style={{ borderRadius: 20, margin: 2 }} />
            </div>
          </div>
          <div style={{ flex: 10 }}>
            <b style={{ color: 'black' }}>{usuario}</b>
          </div>
        </div>
      </div>)
  })

  return (
    <div>
      {usuariosRenderizables}
    </div>
  )
}