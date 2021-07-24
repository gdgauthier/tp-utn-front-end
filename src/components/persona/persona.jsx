import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonaForm from "./persona_form";
import PersonaLibros from "./persona_libros";
import UnaPersona from "./persona_card";
import { getListadoPersonas } from "../../store/getFromServer";

export default function Persona() {
  // Redux para almacenar el listado de personas /////////////////////////
  const listadoPersonas = useSelector((state) => state.listadoPersonas);
  const dispatch = useDispatch();
  /////////////////////////////////////////////////////

  // Estado para almacenar la persona seleccionada y pasarle los datos al componente que deba
  // abrirse con los datos de dicha persona (i.e. el formulario o el listado de libros prestados)
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

  // Estado para indicar si debe mostrarse el pop-up con el formulario de persona
  const [showPersonaForm, setShowPersonaForm] = useState(false);
  // Funcion para indicar que se abra o cierre el formulario
  const openPersonaForm = () => {
    setShowPersonaForm((prev) => !prev);
  };

  // Estado para indicar si debe mostrarse el pop-up con el listado de libros prestados
  const [showLibrosPrestados, setShowLibrosPrestados] = useState(false);
  // Estado para indicar que se abra o cierre el listado
  const openLibrosPrestados = () => {
    setShowLibrosPrestados((prev) => !prev);
  };

  // Actualizar el listado de personas en redux para que se re renderize el componente Persona
  // cuando se cierran el popup del formulario de personas o de libros prestados
  // en caso que hayan ocurrido cambios que deban renderizarse
  React.useEffect(() => {
    (async () => {
      if (!showPersonaForm && !showLibrosPrestados) {
        const listadoPersonas = await getListadoPersonas();
        dispatch({ type: "REFRESH_PERSONAS", data: listadoPersonas });
      }
    })();
  }, [showPersonaForm, showLibrosPrestados, dispatch]);
  /////////////////////////////////////////////////////

  return (
    <div className="componente">
      <div>
        <h2 className="componente-title "> Listado de Usuarios </h2>
        {/* Boton para abrir el formulario de persona. Al abrirse desde aqui no habra persona seleccionada
        y sera un formulario de alta de persona */}
        <button className="add-componente" onClick={openPersonaForm} title="Agregar Usuario">Agregar Usuario</button>
      </div>
      {/*Componentes de formulario de persona y listado de libros. Se les pasan los estados de persona seleccionada
        para que puedan renderizar los datos correspondientes, showModal indicando si debe renderizarse o no el componente,
        los metodos de setShowModal para que puedan modificar el estado showModal y cerrarse, y setPersonaSeleccionada para
        deseleccionar la persona al cerrarse el componente */}
      <PersonaForm showModal={showPersonaForm} setShowModal={setShowPersonaForm} personaSeleccionada={personaSeleccionada} setPersonaSeleccionada={setPersonaSeleccionada}/>
      <PersonaLibros showModal={showLibrosPrestados} setShowModal={setShowLibrosPrestados} personaSeleccionada={personaSeleccionada} setPersonaSeleccionada={setPersonaSeleccionada}/>
      <div className="container">
        {/*Renderizar una tarjeta por cada persona en el listado de personas. A cada tarjeta se le pasan los datos de la persona
                para renderizarlos, el metodo setPersonaSeleccionada para que se seleccione la persona a la que corresponde la tarjeta al
                clickear en ella o en el boton de editar, y los metodos para abrir el listado de libros y el formulario de persona.
                En este caso, dado que al clickear en la persona esta se seleccionará, el formulario de persona será para editar la persona
                en lugar de un formulario de alta.
                De ser el listadoPersonas un array vacio se mostrará un mensaje diciendo que no se encontraron personas en la BD.*/}
        {listadoPersonas.length ? (listadoPersonas.map((persona, index) => ( <UnaPersona key={index} datos={persona} personaSeleccionada={personaSeleccionada} setPersonaSeleccionada={setPersonaSeleccionada} openPersonaForm={openPersonaForm} openLibrosPrestados={openLibrosPrestados} />))) : (<h3>No se encontraron usuarios en la base de datos</h3>)}
      </div>
    </div>
  );
};