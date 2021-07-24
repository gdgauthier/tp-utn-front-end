import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../serverUrl.json";
import { useDispatch, useSelector } from "react-redux";
import { getListadoPersonas } from "../../store/getFromServer";

export default function LibroPrestar(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground) y no se este enviando informacion
    // al servidor
    if (e.target.className === "modalBoxBackground" && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      setPersona_id(0);
      // Deseleccionar el libro
      props.setLibroSeleccionado(null);
    }
  };

  // Close on Esc key //////////////////////
  const keyPress = (e) => {
    // Cerrar cuando se presione la tecla escape y no se este enviando informacion
    // al servidor
    if (e.key === "Escape" &&props.showModal && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      setPersona_id(0);
      // Deseleccionar el libro
      props.setLibroSeleccionado(null);
    }
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
  const [persona_id, setPersona_id] = useState(0);
  /////////////////////////////////////////

  /* Funcion para volver a la ventana de prestar/devolver cuando el usuario presiona ok luego de un envio fallido al servidor
   */
  const backToForm = () => {
    setEnviando(false);
    setEnvioFallido(false);
  };
  /////////////////////////////////////////

  // Funcion para devolver libro /////////////////////////
  const devolverLibro = async () => {
    const libroId = props.libroSeleccionado.id;
    setEnviando("devolviendo"); // enviando = true para mostrar
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

  // Funcion para prestar libro /////////////////////////
  const prestarLibro = async () => {
    const libroId = props.libroSeleccionado.id;
    setEnviando("prestando"); // enviando = true para mostrar
    try {
      const persona = { persona_id: persona_id };
      await axios.put(`${serverUrl}/libro/prestar/${libroId}`, persona);
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

  // Actualizar el listado de personas para utilizar en el drop down de personas
  // para prestar el libro
  const dispatch = useDispatch();
  React.useEffect(() => {
    (async () => {
      if (props.showModal) {
        const listadoPersonas = await getListadoPersonas();
        dispatch({ type: "REFRESH_PERSONAS", data: listadoPersonas });
      }
    })();
  }, [props.showModal, dispatch]);
  const listadoPersonas = useSelector((state) => state.listadoPersonas);
  /////////////////////////////////////////////////////

  // Dropdown con listado de personas disponibles para prestar libro ////////
  const dropDownPersonas = () => {
    const opciones = listadoPersonas.map((persona, index) => {
      return (
        <option key={index} value={persona.id}>{`${persona.nombre} ${persona.apellido} (id:${persona.id})`}</option>
      );
    });
    opciones.unshift(
      <option key={opciones.length} value={0} hidden>Seleccione un usuario</option>
    ); // Default option
    if (opciones.length > 0) {
      return opciones;
    } else {
      return <option value={null}>No se encontraron usuarios</option>;
    };
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
          <div className="modalBox" onClick={() => { return null;}}>
            {(() => {
              if (envioSatisfactorio) {
                // Mostrar popup de envio satisfactorio si envioSatisfactorio es true
                return (
                  <div className="message">
                    <p>El libro se{" "}{enviando === "prestando" ? "prestó" : "devolvió"}{" "} correctamente</p>
                  </div>
                );
              } else if (envioFallido) {
                // Popup de envio fallido cuando envioFallido es true y mostrar el error del servidor
                return (
                  <div className="message">
                    <h3>Envio Fallido</h3>
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
      // Si no se esta enviando mostrar opcion de prestar o devolver según corresponda
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => { return null;}}>
            {(() => {
              if (props.libroSeleccionado.persona_id) {
                // Mostrar popup de devolver si el libro seleccionado esta prestado
                return (
                  <div className="modal-libro">
                    <div>
                      <h3 className="devolver-libro">Libro prestado a</h3>
                      <div className="devolver-data">
                        <h1>{props.libroSeleccionado.persona_nombre}{" "} {props.libroSeleccionado.persona_apellido} (ID#{" "} {props.libroSeleccionado.persona_id})</h1>
                        <button className="roundButton" title="Devolver libro" onClick={devolverLibro}>Devolver Libro</button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Mostrar popup de prestar si el libro seleccionado no esta prestado
                return (
                  <div className="form-wrapper">
                    <div className="tittle-wrapper">
                      <h3 className="form-tittle">Prestar libro a:</h3>
                    </div>
                    <div className="form-item">
                      <select name="personas"value={persona_id} onChange={(e) => setPersona_id(e.target.value)}>{dropDownPersonas()}</select>
                    </div>
                    <div className="form-button libro">
                      <button onClick={prestarLibro}>OK</button>
                    </div>
                  </div>
                );
              };
            })()}
          </div>
        </div>
      );
    };
  } else {
    // Si showModal es false no devolver el componente
    return <></>;
  };  
};