export default function UnGenero(props) {
  // Abrir formulario de genero/categoria al clickear en el boton para editar
  const openGeneroForm = () => {
    props.setGeneroSeleccionado(props.datos);
    props.openGeneroForm();
  };

  // Abrir el listado de libros al clickear en la tarjeta
  const openGeneroConLibros = (e) => {
    // Condicion para asegurarse que el usuario no clickeo en el boton para editar
    // dado que el boton tambien es parte de la tarjeta
    if (e.target.className !== "roundButton" && e.target.className !== "material-icons") {
      props.setGeneroSeleccionado(props.datos);
      props.openGeneroConLibros();
    }
  };

  return (
    <div className="card" onClick={openGeneroConLibros}>
      <div className="card-header">
        <p>{"ID#  "}{props.datos.id}</p>
        <button className="roundButton" onClick={openGeneroForm}><i className="material-icons">edit_note</i></button>
      </div>
      <div className="card-content">
        <p><b>{"Nombre: "}</b>{props.datos.nombre}</p>
        <p style={{ textAlign: "" }}>
          {/* Indicar si hay libros con este género en funcion 
        de la informacion pasada por el props datos del genero*/}
          <b>{"Libros con este genero:  "}</b>{props.datos.libros.length ? "Si" : "No"}</p>
      </div>
    </div>
  );
};