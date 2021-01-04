import React, { useEffect, useRef, useState } from 'react';
import IMensaje from '../tipos/mensajes'
import * as Colores from '../constantes/color'
import { ListadoMensajes } from './listadoMensajes';

interface IChat {
    mensajes: IMensaje[],
    isAuthenticated : boolean,
    enviarMensaje : (mensaje : string) => void
}

export const Chat = (props: IChat) => {

    const { mensajes, isAuthenticated, enviarMensaje } = props
    const [mensajeActual, setMensajeActual] = useState<string>('')
    const dummy = useRef(null)

    const enviarMensajeBajandoChat = () => {
        enviarMensaje(mensajeActual)
        setMensajeActual('')
        dummy.current.scrollIntoView({behavior: 'smooth'})
    }

    const onEnterPress = (e : any) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            enviarMensajeBajandoChat()
        }
    }

    return (
        <div className='flex-container' style={{ backgroundColor: Colores.COLOR_PRIMARIO, flex: 3, display: 'flex', flexDirection: 'column', maxHeight: '30vh' }}>
            <div style={{ flex: 9 }}>
                <div style={{ maxHeight: '19vh', height: '100%', marginLeft: 15, width: '97%', overflowY: 'scroll', position: 'sticky', backgroundColor: Colores.COLOR_SECUNDARIO, borderColor: 'black', border: 1, borderRadius: 5 }}>
                    <div style={{ bottom: 0, height: '100%' }}>
                        <ListadoMensajes mensajes={mensajes} />
                        <div ref={dummy}></div>
                    </div>
                </div>
            </div>
            <div style={{ flex: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 10, margin: 10 }}>
                        <input disabled={!isAuthenticated} style={{ width: '100%', margin: 5, padding: 5 }} value={mensajeActual} onKeyDown={onEnterPress} onChange={(evt) => setMensajeActual(evt.target.value)} />
                    </div>
                    <div style={{ flex: 2, margin: 10 }}>
                        <button disabled={!isAuthenticated} type="submit" className="button" style={{ width: '90%' }} onClick={() => enviarMensajeBajandoChat()}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}