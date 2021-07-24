import React from "react";

export default function GeneroLibros(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground)
    if (e.target.className === "modalBoxBackground") {
      // Devolver los estados del pop up a su estado inicial y deseleccionar el genero
      props.setShowModal();
      props.setGeneroSeleccionado(null);
    }
  };

  // Close on Esc key //////////////////////
  const keyPress = (e) => {
    // Cerrar cuando se presione la tecla escape
    if (e.key === "Escape" && props.showModal) {
      // Devolver los estados del pop up a su estado inicial y deseleccionar el genero
      props.setShowModal();
      props.setGeneroSeleccionado(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });
  ////////////////////////////////////////

  // Funcion para renderizar listado de libros /////////////////////
  const renderBooks = () => {
    let libros;
    if (!props.generoSeleccionado.libros.length) {
      return (
        <div className="message">
          <p>Este género no tiene libros asociados</p>
        </div>
      );
    } else {
      libros = props.generoSeleccionado.libros.map((libro, i) => {
        return (
          <div className="renderbooks-item" key={i}>
            <p>{`${libro.nombre} (ID#${libro.id})`}</p>
          </div>
        );
      });
      return libros;
    }
  };
  ////////////////////////////////////////

  if (props.showModal) {
    return (
      <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
        <div className="modalBox" onClick={() => { return null;}}>
          <div className="modalbox-title">
            <h3>Libros con Género </h3>
            <div className="wrapper-id">
              <h1>{`${props.generoSeleccionado.nombre}`}</h1>
            </div>
            <div className="book-list">{renderBooks()}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  };
};