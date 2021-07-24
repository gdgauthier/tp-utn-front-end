import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../serverUrl.json";
import { useDispatch, useSelector } from "react-redux";
import { getListadoPersonas, getListadoCategorias } from "../../store/getFromServer";

export default function LibroForm(props) {
  // Function to close on click outside box //////////////////
  const closeOnOutsideClick = (e) => {
    // Cerrar cuando el click haya sido fuera del pop up (en modalBoxBacground) y no se este enviando informacion
    // al servidor
    if (e.target.className === "modalBoxBackground" &&(!enviando || (enviando && (envioSatisfactorio || envioFallido)))) {
      props.setShowModal(); // Cerrar el pop up
      // Devolver los estados del pop up a su estado inicial
      setEnviando(false);
      setBorrando(false);
      setEnvioSatisfactorio(false);
      setEnvioFallido(false);
      setServerError("");
      borrarDatosFormulario();
      // Deseleccionar a la persona
      props.setLibroSeleccionado(null);
    }
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
      props.setLibroSeleccionado(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });
  ////////////////////////////////////////

  // Estados /////////////////////////////
  /* {id: numero, nombre:string, descripcion:string, categoria_id:numero,
   * persona_id:numero/null}
   */
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria_id, setCategoria_id] = useState("");
  const [persona_id, setPersona_id] = useState("");

  // Cargar datos del libro seleccionado al formulario al seleccionarse
  React.useEffect(() => {
    if (props.libroSeleccionado) {
      setNombre(props.libroSeleccionado.nombre);
      setDescripcion(props.libroSeleccionado.descripcion);
      setCategoria_id(props.libroSeleccionado.categoria_id);
      setPersona_id(props.libroSeleccionado.persona_id);
    } else {
      borrarDatosFormulario();
    };
  }, [props.libroSeleccionado]);

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
    setDescripcion("");
    setCategoria_id("");
    setPersona_id("");
    setErrorMessage("");
  };

  // Borrar datos del formulario desde el boton. Diferencia con el anterior
  // es que si es formulario de edición no queremos borrar los campos que no
  // se pueden editar
  const borrarDatosFormularioBoton = () => {
    if (props.libroSeleccionado) {
      setDescripcion("");
      setErrorMessage("");
    } else {
      setNombre("");
      setDescripcion("");
      setCategoria_id("");
      setPersona_id("");
      setErrorMessage("");
    };
  };

  // Validar formulario ////////////////////////
  // De momento solo valida que no se pongan datos vacios en categoria y nombre
  const validateForm = () => {
    if (!nombre || !categoria_id) {
      return {
        validation: false,
        errorMessage: "Faltan datos. Por favor completar titulo y genero.",
      };
    } else {
      return { validation: true, errorMessage: "" };
    };
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
  const enviarDatosLibro = async () => {
    let formValidation = validateForm(); // Validar datos ingresados
    if (!formValidation.validation) {
      setErrorMessage(formValidation.errorMessage); // Devolver mensaje de error de no ser validos los datos
    } else {
      setEnviando(true); // settear enviando en true
      // Obtener respuesta del servidor
      try {
        let obj;
        // Si hay un libro seleccionado el request al servidor es un PUT para editar
        if (props.libroSeleccionado) {
          /* //PUT '/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}
           * devuelve status 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado
           * o bien status 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
           */
          obj = { descripcion: descripcion }; // Solo se puede modificar la descripcion del libro
          await axios.put(`${serverUrl}/libro/${props.libroSeleccionado.id}`, obj);
        } else {
          // Si no hay libro seleccionado el request al servidor es un POST para dar de alta
          obj = {
            nombre: nombre,
            descripcion: descripcion,
            categoria_id: categoria_id,
            persona_id: persona_id,
          };
          await axios.post(`${serverUrl}/libro`, obj);
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
        };
        setEnvioFallido(true);
      };
    };
  };
  /////////////////////////////////////////

  // Funcion para borrar libro /////////////////////////
  const borrarLibro = async () => {
    setBorrando(true); // settear borrando en true
    // Obtener respuesta del servidor
    try {
      await axios.delete(`${serverUrl}/libro/${props.libroSeleccionado.id}`);
      // Si no hubo errores en el request setear envioSatisfactorio en true y mensaje de error en ''
      setEnvioSatisfactorio(true);
    } catch (e) {
      // de haber un error setear envioFallido en true y serverError con el mensaje de error
      try {
        setServerError(e.response.data.mensaje);
      } catch (e2) {
        setServerError(e.message);
      };
      setEnvioFallido(true);
    };
  };
  /////////////////////////////////////////

  // Actualizar los listados de personas y categorias para utilizar en los
  // drop downs del formulario
  const dispatch = useDispatch();
  React.useEffect(() => {
    (async () => {
      if (props.showModal && !props.libroSeleccionado) {
        // Solo cuando es para alta
        const listadoPersonas = await getListadoPersonas();
        dispatch({ type: "REFRESH_PERSONAS", data: listadoPersonas });
        const listadoCategorias = await getListadoCategorias();
        dispatch({ type: "REFRESH_CATEGORIAS", data: listadoCategorias });
      }
    })();
  }, [props.showModal, props.libroSeleccionado, dispatch]);
  /////////////////////////////////////////////////////
  const listadoPersonas = useSelector((state) => state.listadoPersonas);
  const listadoCategorias = useSelector((state) => state.listadoCategorias);
  // Dropdown con listado de categorias disponibles para el libro ////////
  const dropDownCategorias = () => {
    const opciones = listadoCategorias.map((categoria, index) => {
      return (<option key={index} value={categoria.id}>{`${categoria.nombre} (id:${categoria.id})`}</option>)
    });
    if (opciones.length > 0) {
      opciones.unshift(<option key={opciones.length} value='' hidden>Seleccione una categoría</option>);
      return opciones;
    } else {
      return (<option value={null}>No se encontraron categorías</option>);
    };
  };
  // Dropdown con listado de personas disponibles para el libro ////////
  const dropDownPersonas = () => { // FALTA AGREGAR OPCION DE NO PRESTAR
    const opciones = listadoPersonas.map((persona, index) => {
      return (<option key={index} value={persona.id}>{`${persona.nombre} ${persona.apellido} (id:${persona.id})`}</option>)
    });
    opciones.unshift(<option key={listadoPersonas.length} value={null}>No Prestado</option>);
    if (opciones.length > 0) {
      return opciones;
    } else {
      return (<option value={null}>No se encontraron personas</option>);
    };
  };

  // Render Modal Form ////////////////////
  if (props.showModal) {
    // Mostrar solo si showModal es true
    // Si enviando o borrando mostrar cartel de envio satisfactorio o envio fallido con mensaje de error
    if (enviando || borrando) {
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => {return null;}}>
            {(() => { if (envioSatisfactorio) {
                /* Envio satisfactorio. Mostrará
                 * 1. "Alta satisfactoria" si no hay libro seleccionado
                 * 2. "El libro se borró correctamente" si hay libro seleccionado y borrando es true
                 * 3. "El libro se editó correctamente" si hay libro seleccionado y borrando es false
                 */
                return (
                  <div className="message">
                    <p>{props.libroSeleccionado ? borrando ? "El libro se borró correctamente" : "El libro se editó correctamente" : "Alta satisfactoria"}</p>
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
              };
            })()}
          </div>
        </div>
      );
    } else {
      // Si enviando y borrando son ambos false mostrar formulario
      return (
        <div className="modalBoxBackground" onClick={closeOnOutsideClick}>
          <div className="modalBox" onClick={() => { return null; }}>
            <div className="form-wrapper">
              {/* Header mostrara "Editar genero ..." si hay genero seleccionado y "Alta de genero" si no */}
              <div className="tittle-wrapper">
                <h3 className="form-tittle">{props.libroSeleccionado ? "Editar datos libro " + props.libroSeleccionado.id : "Alta de libro"}</h3>
              </div>
              {/* Mostrar boton de borrar libro si hay libro seleccionado*/}
              <div className="form-item">
                <label>Titulo</label> <br />
                {/* El campo persona no se podrá modificar si hay libro seleccionado*/}
                <input type="text" maxLength="50" value={nombre} disabled={props.libroSeleccionado ? true : false} onChange={(e) => setNombre(e.target.value)}/>
              </div>
              <div className="form-item">
                <label>Descripción</label> <br />
                <input name="descripcion" type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
              </div>
              <div className="form-item">
                <label>Genero</label> <br />
                {/* El campo persona no se podrá modificar si hay libro seleccionado*/}
                <select name="categoria" value={categoria_id} disabled={props.libroSeleccionado ? true : false} onChange={(e) => setCategoria_id(e.target.value)}>{dropDownCategorias()}</select>
              </div>
              <div className="form-item">
                <label>Usuario</label> <br />
                {/* El campo persona no se podrá modificar si hay libro seleccionado*/}
                <select name="personas" value={persona_id} disabled={props.libroSeleccionado ? true : false} onChange={(e) => setPersona_id(e.target.value)}>{dropDownPersonas()}</select>
              </div>
              <div className="form-button">
                <button onClick={enviarDatosLibro}>Enviar</button>
                <button onClick={borrarDatosFormularioBoton}>Limpiar {props.libroSeleccionado ? "campo" : "campos"}</button>
                <button onClick={borrarLibro} style={{ display: props.libroSeleccionado ? "" : "none" }}>Borrar Libro</button>
              </div>
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      );
    };
  } else {
    // Si showModal es false no devolver el componente
    return <></>;
  };
};