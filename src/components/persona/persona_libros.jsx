import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../serverUrl.json";
import { getLibrosPersona } from "../../store/getFromServer";

export default function PersonaLibros(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground) y no se este enviando informacion
    // al servidor
    if ( e.target.className === "modalBoxBackground" &&  (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      // Deseleccionar a la persona
      props.setPersonaSeleccionada(null);
    };
  };
  ////////////////////////////////////////

  // Close on Esc key //////////////////////
  const keyPress = (e) => {
    // Cerrar cuando se presione la tecla escape y no se este enviando informacion al servidor
    if (e.key === "Escape" && props.showModal && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      // Deseleccionar a la persona
      props.setPersonaSeleccionada(null);
    };
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });
  ////////////////////////////////////////

  // Estados /////////////////////////////
  const [enviando, setEnviando] = useState(false);
  const [envioSatisfactorio, setEnvioSatisfactorio] = useState(false);
  const [envioFallido, setEnvioFallido] = useState(false);
  const [serverError, setServerError] = useState("");
  const [displayButton, setDisplayButton] = useState("");
  /////////////////////////////////////////

  /* Actualizar el listado de libros prestados a la persona seleccionada para renderizar
   * al cambiar showModal (indicando que se habra el popup) con enviando en false o
   * al cambiar enviando a false con showModal indicando que el popup debe estar abierto
   */
  React.useEffect(() => {
    (async () => {
      if (props.showModal && !enviando) {
        props.personaSeleccionada.librosPrestados = await getLibrosPersona(props.personaSeleccionada.id);
      };
    })();
  }, [props.showModal, props.personaSeleccionada, enviando]);

  /* Funcion para volver al listado cuando el usuario presiona ok luego de devovler un libro en forma exitosa.
   * (dado que showModal es true, el listado se muestra cuando enviando y envioFallido son ambos false)
   */
  const backToForm = () => {
    setEnviando(false);
    setEnvioFallido(false);
  };
  /////////////////////////////////////////

  // Funcion para devolver libro /////////////////////////
  const devolverLibro = async (libroId) => {
    setEnviando(true); // enviando = true para mostrar
    try {
      await axios.put(`${serverUrl}/libro/devolver/${libroId}`, {});
      setEnvioSatisfactorio(true);
    } catch (e) {
      // de haber un error setear envioFallido en true y serverError con el mensaje de error
      // Obtener el mensaje de error correspondiente para mostrar al usuario
      try {
        setServerError(e.response.data.mensaje);
      } catch (e2) {
        setServerError(e.message);
      };
      setEnvioFallido(true); // setear envioFallido en true
    };
  };
  /////////////////////////////////////////

  // Funcion para renderizar listado de libros /////////////////////
  const renderBooks = () => {
    let libros;
    // Mostrar mensaje de no libros prestados si el array de libros prestados esta vacío
    if (!props.personaSeleccionada.librosPrestados.length) {
      return (
        <div className="message">
          <p>Este usuario no tiene libros prestados</p>
        </div>
      );
    } else {
      // Mostrar el listado de libros prestados si hay libros en el array
      libros = props.personaSeleccionada.librosPrestados.map((libro, index) => {
        return (
          <div key={index} className="render-books" onMouseEnter={() => setDisplayButton(libro.id)} onMouseLeave={() => setDisplayButton("")}>
            <div className="renderbooks-item">
              <p>{`${libro.nombre} (ID#${libro.id})`}</p>
            </div>
            <div className="renderbooks-item">
              <button className="roundButton return" style={{ display: displayButton === libro.id ? "" : "none" }} title="Devolver libro" onClick={() => devolverLibro(libro.id)}> <i className="material-icons">autorenew</i></button>
            </div>
          </div>
        );
      });
      return libros;
    }
  };
  /////////////////////////////////////////

  // Render Modal Form ////////////////////
  if (props.showModal) {
    if (enviando) {
      /* Si enviando es true devolver el icono de cargando cuando se esta enviando al servidor
       * el popup de envio exitoso o el de envio fallido
       */
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => { return null; }}>
            {(() => {
              if (envioSatisfactorio) {
                // Mostrar popup de envio satisfactorio si envioSatisfactorio es true
                return (
                  <div className="message">
                    <p>El libro se devolvio correctamente</p>
                    <button onClick={backToForm}>OK</button>
                  </div>
                );
              } else if (envioFallido) {
                // Popup de envio fallido cuando envioFallido es true y mostrar el error del servidor
                return (
                  <div className="message">
                    <p>Envio Fallido</p>
                    <p>{serverError}</p>
                    <button onClick={backToForm}>OK</button>
                  </div>
                );
              } else {
                // Popup de cargando si enviando es trye y envio fallido es false
                return <i className="material-icons loading">autorenew</i>;
              }
            })()}
          </div>
        </div>
      );
    } else {
      // Listado de libros prestados a la persona seleccionada si enviando es false
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => {return null;}}>
            <div className="modalbox-title">
              <h3>Libros prestados a Usuario</h3>
              <div className="wrapper-id">
                <h1>{`ID#${props.personaSeleccionada.id}`}</h1>
              </div>
            </div>
            <div className="render-wrapper">{renderBooks()}</div>
          </div>
        </div>
      );
    };
  } else {
    // Si showModal es false no devolver el componente
    return <></>;
  };
  /////////////////////////////////////////
};