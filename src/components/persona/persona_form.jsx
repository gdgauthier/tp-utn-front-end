import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../serverUrl.json";

export default function PersonaForm(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground) y no se este enviando informacion
    // al servidor
    if (e.target.className === "modalBoxBackground" && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setBorrando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      borrarDatosFormulario();
      // Deseleccionar a la persona
      props.setPersonaSeleccionada(null);
    };
  };

  // Close on Esc key //////////////////////
  const keyPress = (e) => {
    // Cerrar cuando se presione la tecla escape y no se este enviando informacion
    // al servidor
    if (e.key === "Escape" && props.showModal && (!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setBorrando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      borrarDatosFormulario();
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
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");

  // Cargar datos de la persona seleccionada al formulario al seleccionarse
  React.useEffect(() => {
    if (props.personaSeleccionada) {
      setNombre(props.personaSeleccionada.nombre);
      setApellido(props.personaSeleccionada.apellido);
      setAlias(props.personaSeleccionada.alias);
      setEmail(props.personaSeleccionada.email);
    } else {
      borrarDatosFormulario();
    };
  }, [props.personaSeleccionada]);

  const [errorMessage, setErrorMessage] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [envioSatisfactorio, setEnvioSatisfactorio] = useState(false);
  const [envioFallido, setEnvioFallido] = useState(false);
  const [serverError, setServerError] = useState("");
  /////////////////////////////////////////

  // Borrar datos del formulario
  const borrarDatosFormulario = () => {
    setNombre("");
    setApellido("");
    setAlias("");
    setEmail("");
    setErrorMessage("");
  };

  // Borrar datos del formulario desde el boton. Diferencia con el anterior
  // es que si es formulario de edición no queremos borrar los campos que no
  // se pueden editar (email)
  const borrarDatosFormularioBoton = () => {
    // No borra el email
    setNombre("");
    setApellido("");
    setAlias("");
    setErrorMessage("");
  };

  // Validar formulario ////////////////////////
  // De momento solo valida que no se pongan strings vacios
  const validateForm = () => {
    if (!nombre || !apellido || !alias || !email) {
      return {
        validation: false,
        errorMessage: "Faltan datos. Por favor completar todos los campos.",
      };
    } else {
      return { validation: true, errorMessage: "" };
    }
  };
  /////////////////////////////////////////

  // Funcion para volver al listado cuando el usuario presiona ok luego obtener un error del servidor
  const backToForm = () => {
    setBorrando(false);
    setEnviando(false);
    setEnvioFallido(false);
  };
  /////////////////////////////////////////

  // Funcion para enviar formulario /////////////////////////
  const enviarDatosPersona = async () => {
    let formValidation = validateForm(); // Validar datos inglresados
    if (!formValidation.validation) {
      setErrorMessage(formValidation.errorMessage); // Devolver mensaje de error de no ser validos los datos
    } else {
      setEnviando(true); // settear enviando en true

      // Obtener respuesta del servidor
      try {
        let obj = {
          nombre: nombre,
          apellido: apellido,
          alias: alias,
          email: email
        };
        // Si hay una persona seleccionada el request al servidor es un PUT para editar
        if (props.personaSeleccionada) {
          delete obj.email; // No enviar email al servidor ya que eso retorna un error
          await axios.put(`${serverUrl}/persona/${props.personaSeleccionada.id}`, obj );
        } else {
          // Si no hay una persona seleccionada el request al servidor es un POST para dar de alta
            await axios.post(`${serverUrl}/persona`, obj);
        };
        // Si no hubo errores en los requests setear envioSatisfactorio en true y mensaje de error en ''
        setEnvioSatisfactorio(true);
        setErrorMessage("");
      } catch (e) {
        // de haber un error setear envioFallido en true y serverError con el mensaje de error
        try {
          setServerError(e.response.data.mensaje);
        } catch (e2) {
          setServerError(e.message);
        }
        setEnvioFallido(true);
      };
    };
  };
  /////////////////////////////////////////

  // Funcion para borrar persona /////////////////////////
  const borrarPersona = async () => {
    setBorrando(true); // settear borrando en true
    // Obtener respuesta del servidor
    try {
      await axios.delete(`${serverUrl}/persona/${props.personaSeleccionada.id}`);
      // Si no hubo errores en el request setear envioSatisfactorio en true y mensaje de error en ''
      setEnvioSatisfactorio(true);
    } catch (e) {
      // de haber un error setear envioFallido en true y serverError con el mensaje de error
      try {
        setServerError(e.response.data.mensaje);
      } catch (e2) {
        setServerError(e.message);
      }
      setEnvioFallido(true);
    }
  };
  /////////////////////////////////////////

  // Render Modal Form ////////////////////
  if (props.showModal) {
    // Mostrar solo si showModal es true
    // Si enviando o borrando mostrar cartel de envio satisfactorio o envio fallido con mensaje de error
    if (enviando || borrando) {
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => {return null;}}>
            {(() => {
              if (envioSatisfactorio) {
                /* Envio satisfactorio. Mostrará
                 * 1. "Alta satisfactoria" si no hay persona seleccionada
                 * 2. "La persona se borró correctamente" si hay persona seleccionada y borrando es true
                 * 3. "La persona se editó correctamente" si hay persona seleccionada y borrando es false
                 */
                return (
                  <div className="message">
                    <p>{props.personaSeleccionada ? borrando ? "La persona se borró correctamente" : "La persona se editó correctamente" : "Alta satisfactoria"}</p>
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
          <div className="modalBox" onClick={() => {return null;}}>
            <div className="form-wrapper">
              {/* Header mostrara "Editar datos persona personaID" si hay persona seleccionada y "Alta de contacto" si no */}
              <div className="tittle-wrapper">
                <h3 className="form-tittle">{props.personaSeleccionada ? "Editar datos del Usuario ID# " + props.personaSeleccionada.id : "Alta de usuario"}</h3>
              </div>

              {/* Mostrar boton de borrar persona si hay persona seleccionada*/}

              <div className="form-item">
                <label>Nombre</label> <br />
                <input type="text" maxLength="50" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
              </div>
              <div className="form-item">
                <label>Apellido</label> <br />
                <input name="apellido" type="text" maxLength="50" value={apellido} onChange={(e) => setApellido(e.target.value)}/>
              </div>
              <div className="form-item">
                <label>Alias</label> <br />
                <input name="alias" type="text" maxLength="50" value={alias} onChange={(e) => setAlias(e.target.value)}/>
              </div>
              <div className="form-item">
                <label>E-mail</label> <br />
                {/* El campo email no se podrá modificar si hay persona seleccionada */}
                <input name="email" type="text" maxLength="50" value={email} disabled={props.personaSeleccionada ? true : false} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="form-button">
                <button onClick={enviarDatosPersona}>Enviar</button>
                <button onClick={borrarDatosFormularioBoton}>Limpiar campos</button>
                <button onClick={borrarPersona} style={{ display: props.personaSeleccionada ? "" : "none" }}>Borrar usuario</button>
              </div>
              <p className="errormessage-form">{errorMessage}</p>
            </div>
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