import IDatosUsuario from "./datosUsuario";

export default interface IMensaje {
    emisor: IDatosUsuario,
    contenido: string
}