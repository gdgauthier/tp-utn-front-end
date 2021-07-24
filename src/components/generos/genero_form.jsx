import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../serverUrl.json";

export default function GeneroForm(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground) y no se este enviando informacion
    // al servidor
    if (e.target.className === "modalBoxBackground" && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setBorrando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      borrarDatosFormulario();
      // Deseleccionar genero
      props.setGeneroSeleccionado(null);
    }
  };

  const keyPress = (e) => {
    // Cerrar cuando se presione la tecla esc y no se este enviando informacion
    // al servidor
    if (e.key === "Escape" && props.showModal && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setBorrando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      borrarDatosFormulario();
      // Deseleccionar genero
      props.setGeneroSeleccionado(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });
  ////////////////////////////////////////

  // Estados /////////////////////////////
  const [nombre, setNombre] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [envioSatisfactorio, setEnvioSatisfactorio] = useState(false);
  const [envioFallido, setEnvioFallido] = useState(false);
  const [serverError, setServerError] = useState("");

  // Cargar datos del genero seleccionado al formulario al seleccionarse
  React.useEffect(() => {
    if (props.generoSeleccionado) {
      setNombre(props.generoSeleccionado.nombre);
    } else {
      borrarDatosFormulario();
    };
  }, [props.generoSeleccionado]);
  /////////////////////////////////////////

  // Borrar datos del formulario
  const borrarDatosFormulario = () => {
    setNombre("");
    setErrorMessage("");
  };

  // Validar formulario ////////////////////////
  // Solo valida que se pase un nombre
  const validateForm = () => {
    if (!nombre) {
      return {
        validation: false,
        errorMessage: "Faltan datos. Por favor completar todos los campos.",
      };
    } else {
      return { validation: true, errorMessage: "" };
    }
  };
  /////////////////////////////////////////

  // Funcion para volver al formulario cuando el usuario presiona ok luego obtener un error del servidor
  const backToForm = () => {
    setBorrando(false);
    setEnviando(false);
    setEnvioFallido(false);
  };

  /////////////////////////////////////////

  // Funcion para enviar formulario /////////////////////////
  const enviarDatosGenero = async () => {
    let formValidation = validateForm(); // Validar datos ingresados
    if (!formValidation.validation) {
      setErrorMessage(formValidation.errorMessage); // Devolver mensaje de error de no ser validos los datos
    } else {
      setEnviando(true); // settear enviando en true
      // Obtener respuesta del servidor
      try {
        let obj = { nombre: nombre };
        // Si hay un genero seleccionado el request al servidor es un PUT para editar
        if (props.generoSeleccionado) {
          //PUT '/categoria/:id' recibe: {nombre: string} retorna status 200 y el objeto modificado
          // o bien status 413, {mensaje: <descripcion del error>} "error inesperado"
          await axios.put(`${serverUrl}/categoria/${props.generoSeleccionado.id}`, obj);
        } else {
          // Si no hay genero seleccionado el request al servidor es un POST para dar de alta
          //POST '/categoria' recibe: {nombre: string} retorna: status: 200,
          // {id: numerico, nombre: string} - status: 413, {mensaje: <descripcion del error>}
          // que puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
          await axios.post(`${serverUrl}/categoria`, obj);
        };
        // Si no hubo errores en los requests setear envioSatisfactorio en true y mensaje de error en ''
        setEnvioSatisfactorio(true);
        setErrorMessage("");
      } catch (e) {
        // de haber un error setear envioFallido en true y serverError con el mensaje de error
        try {
          setServerError(e.response.data.mensaje);
        } catch (e2) {
          setServerError(e2.message);
        };
        setEnvioFallido(true);
      };
    };
  };
  /////////////////////////////////////////

  // Funcion para borrar libro /////////////////////////
  const borrarGenero = async () => {
    setBorrando(true);
    try {
      await axios.delete(`${serverUrl}/categoria/${props.generoSeleccionado.id}`);
      setEnvioSatisfactorio(true);
    } catch (e) {
      try {
        setServerError(e.response.data.mensaje);
      } catch (e2) {
        setServerError(e2.message);
      };
      setEnvioFallido(true);
    };
  };
  /////////////////////////////////////////

  // Render Modal Form ////////////////////
  if (props.showModal) {
    // Mostrar solo si showModal es true
    // Si enviando o borrando mostrar cartel de envio satisfactorio o envio fallido con mensaje de error
    if (enviando || borrando) {
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => { return null;}}>
            {(() => {
              if (envioSatisfactorio) {
                /* Envio satisfactorio. Mostrará
                 * 1. "Alta satisfactoria" si no hay genero seleccionado
                 * 2. "El genero se borró correctamente" si hay genero seleccionado y borrando es true
                 * 3. "El genero se editó correctamente" si hay genero seleccionado y borrando es false
                 */
                return (
                  <div className="message">
                    <p>{props.generoSeleccionado ? borrando ? "El genero se borró correctamente" : "El genero se editó correctamente" : "Alta satisfactoria"} </p>
                  </div>
                );
              } else if (envioFallido) {
                // Si envio fallido se mostrará el mensaje de error correspondiente
                return (
                  <div className="message">
                    <h3>Envio Fallido</h3>
                    <p>{serverError}</p>
                    <button onClick={backToForm}>OK</button>
                  </div>
                );
              } else {
                // Si envioSatisfactorio y envioFallido son ambos false pero enviando o borrando son true entonces mostrar cargando
                return <i className="material-icons loading">autorenew</i>;
              }
            })()}
          </div>
        </div>
      );
    } else {
      // Si enviando y borrando son ambos false mostrar formulario
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => { return null;}}>
            <div className="form-wrapper">
              {/* Header mostrara "Editar genero ..." si hay genero seleccionado y "Alta de genero" si no */}
              <div className="tittle-wrapper">
                <h3 className="form-tittle">{props.generoSeleccionado ? "Editar género " + props.generoSeleccionado.nombre : "Alta de género"}</h3>
              </div>
              {/* Mostrar boton de borrar genero si hay genero seleccionado*/}
              <div className="form-item">
                <label>Nombre</label> <br />
                <input name="nombre" type="text" maxLength="50" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
              </div>
              <div className="form-button">
                <button onClick={enviarDatosGenero}>Enviar</button>
                <button onClick={borrarDatosFormulario}>Limpiar campo</button>
                <button onClick={borrarGenero} title="Borrar Género" style={{ display: props.generoSeleccionado ? "" : "none" }}>Borrar Género</button>
              </div>
              <p className="errormessage-form">{errorMessage}</p>
            </div>
          </div>
        </div>
      );
    }
  } else {
    // Si showModal es false no devolver el componente
    return <></>;
  };
};