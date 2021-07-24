import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GeneroForm from "./genero_form";
import GeneroLibros from "./genero_libros";
import UnGenero from "./genero_card";
import { getListadoCategorias } from "../../store/getFromServer";

export default function Genero() {
  // Redux para almacenar el listado de generos/categorias //////////////////
  const listadoCategorias = useSelector((state) => state.listadoCategorias);
  const dispatch = useDispatch();
  /////////////////////////////////////////////////////

  // Estado para almacenar el genero seleccionado y pasarle los datos al componente que deba
  // abrirse con los datos de dicho componente (i.e. el formulario o el listado de libros)
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
  // Estado para indicar si debe mostrarse el pop-up con el formulario
  const [showGeneroForm, setShowGeneroForm] = useState(false);
  // Funcion para indicar que se abra o cierre el formulario
  const openGeneroForm = () => {
    setShowGeneroForm((prev) => !prev);
  };

  // Estado para indicar si debe mostrarse el listado de libros
  const [showGeneroConLibros, setShowGeneroConLibros] = useState(false);
  // Estado para indicar que se abra o cierre el listado de libros
  const openGeneroConLibros = () => {
    setShowGeneroConLibros((prev) => !prev);
  };

  // Actualizar el listado de generos en redux para que se re renderize el componente Persona
  // cuando se cierran el popup del formulario o el listado de libros
  // en caso que hayan ocurrido cambios que deban renderizarse
  React.useEffect(() => {
    (async () => {
      if (!showGeneroForm && !showGeneroConLibros) {
        const listadoCategorias = await getListadoCategorias();
        dispatch({ type: "REFRESH_CATEGORIAS", data: listadoCategorias });
      }
    })();
  }, [showGeneroForm, showGeneroConLibros, dispatch]);
  /////////////////////////////////////////////////////

  return (
    <div className="componente">
      <div>
        <h2 className="componente-title "> Listado de Géneros </h2>
        {/* Boton para abrir el formulario de alta. Al abrirse desde aqui no habra genero seleccionado
        y sera un formulario de alta */}
        <button className="add-componente" onClick={openGeneroForm} title="Agregar Género">Agregar Género</button>
      </div>
      {/*Componentes de formulario de genero y listado de libros. Se les pasan los estados de genero seleccionado
      para que puedan renderizar los datos correspondientes, showModal indicando si debe renderizarse o no el componente,
      los metodos de setShowModal para que puedan modificar el estado showModal y cerrarse, y setGeneroSeleccionado para
      deseleccionar el genero al cerrarse el componente */}
      <GeneroForm showModal={showGeneroForm} setShowModal={setShowGeneroForm} generoSeleccionado={generoSeleccionado} setGeneroSeleccionado={setGeneroSeleccionado}/>
      <GeneroLibros showModal={showGeneroConLibros} setShowModal={setShowGeneroConLibros} generoSeleccionado={generoSeleccionado} setGeneroSeleccionado={setGeneroSeleccionado}/>
      <div className="container">
        {/*Renderizar una tarjeta por cada genero/categoria en el listado. A cada tarjeta se le pasan los datos del genero
          para renderizarlos, el metodo setGeneroSeleccionado para que se seleccione el genero al que corresponde la tarjeta al
          clickear en ella o en el boton de editar, y los metodos para abrir el formulario y el listado de libros.
          En este caso, dado que al clickear en el genero este se seleccionará, el formulario será para editar el genero
          en lugar de un formulario de alta.
          De ser el listadoGeneros un array vacio se mostrará un mensaje diciendo que no se encontraron generos en la BD.*/}
        {listadoCategorias.length ? (listadoCategorias.map((genero, index) => (<UnGenero key={index} datos={genero} generoSeleccionado={generoSeleccionado} setGeneroSeleccionado={setGeneroSeleccionado} openGeneroForm={openGeneroForm} openGeneroConLibros={openGeneroConLibros}/>))) : (<h3>No se encontraron géneros en la base de datos</h3>)}
      </div>
    </div>
  );
}
