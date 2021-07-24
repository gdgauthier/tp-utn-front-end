function reducer(state, action) {

  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case 'REFRESH_PERSONAS':
      newState.listadoPersonas = action.data;
      return newState;
    case 'REFRESH_LIBROS':
      newState.listadoLibros = action.data;
      return newState;
    case 'REFRESH_CATEGORIAS':
      newState.listadoCategorias = action.data;
      return newState;
    default:
      return state;
  };
};

export { reducer };