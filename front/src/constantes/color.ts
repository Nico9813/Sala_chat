export const COLOR_PRIMARIO = '#262626'
export const COLOR_SECUNDARIO = 'black'
export const COLOR_FUENTE = 'white'

const coloresDisponibles = ['pink', 'grey', '#fcc603']
var indiceActual = 0

export const getProximoColor = () => coloresDisponibles[indiceActual++ % coloresDisponibles.length]