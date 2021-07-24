import React from "react";

export default function UnaPersona(props) {
  // Abrir formulario de persona al clickear en el boton para editar
  const openPersonaForm = () => {
    props.setPersonaSeleccionada(props.datos);
    props.openPersonaForm();
  };

  // Abrir libros prestados al clickear en la tarjeta
  const openLibrosPrestados = (e) => {
    // Condicion para asegurarse que el usuario no clickeo en el boton para editar
    // la persona dado que el boton tambien es parte de la tarjeta
    if (e.target.className !== "roundButton" &&e.target.className !== "material-icons") {
      props.setPersonaSeleccionada(props.datos);
      props.openLibrosPrestados();
    };
  };

  return (
    <div className="card" onClick={openLibrosPrestados}>
      <div className="card-header">
        <p>{"ID#  "}{props.datos.id}</p>
        <button className="roundButton" onClick={openPersonaForm}><i className="material-icons">manage_accounts</i></button>
      </div>
      <div className="card-content">
        <div className="personaCardLine"></div>
        <p className="card-p"><b>{"Nombre:  "}</b>{props.datos.nombre}</p>
        <p className="card-p"><b>{"Apellido:  "}</b>{props.datos.apellido}</p>
        <p className="card-p"><b>{"Alias:  "}</b>{props.datos.alias}</p>
        <p className="card-p"><b>{"Email:  "}</b>{props.datos.email}</p>
        <p className="card-p"><b>{"Libros prestados:  "}</b>{props.datos.librosPrestados.length ? "Si" : "No"}</p>
      </div>
    </div>
  );
};