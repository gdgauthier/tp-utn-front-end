import React from "react";

export default function UnLibro(props) {
  // Abrir formulario de libro al clickear en el boton para editar
  const openLibroForm = () => {
    props.setLibroSeleccionado(props.datos);
    props.openLibroForm();
  };

  // Abrir ventana de prestar/devolver libro al clickear en la tarjeta
  const openLibrosPrestados = (e) => {
    // Condicion para asegurarse que el usuario no clickeo en el boton para editar
    // dado que el boton tambien es parte de la tarjeta
    if (e.target.className !== "roundButton" && e.target.className !== "material-icons") {
      props.setLibroSeleccionado(props.datos);
      props.openLibrosPrestados();
    };
  };

  return (
    <div className="card" onClick={openLibrosPrestados}>
      <div className="card-header">
        <p>{"ID#  "}{props.datos.id}</p>
        <button className="roundButton" onClick={openLibroForm}><i className="material-icons">edit</i></button>
      </div>
      <div className="card-content">
        <p className="card-p"><b>{"Titulo:  "}</b>{props.datos.nombre}</p>
        <p className="card-p"><b>{"Descripcion:  "}</b>{props.datos.descripcion}</p>
        <p className="card-p"><b>{"Género:  "}</b>{`${props.datos.categoria} (ID# ${props.datos.categoria_id})`}</p>
        <p className="card-p"><b>{"Libro prestado:  "}</b>{props.datos.persona_id ? "Si" : "No"}</p>
      </div>
    </div>
  );
};