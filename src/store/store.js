import {createStore} from 'redux'
const reducerFile = require('./reducer');

const estadoInicial = {
    listadoPersonas: [],
    listadoLibros: [],
    listadoCategorias: []
};

const reducer = (state=estadoInicial, action) => reducerFile.reducer(state, action);

export default createStore(reducer);