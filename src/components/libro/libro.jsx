import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LibroForm from "./libro_form";
import LibroPrestar from "./libro_prestar";
import UnLibro from "./libro_card";
import { getListadoLibros } from "../../store/getFromServer";

export default function Libro() {
  // Redux para almacenar el listado de libros /////////////////////////
  const listadoLibros = useSelector((state) => state.listadoLibros);
  const dispatch = useDispatch();
  /////////////////////////////////////////////////////

  // Estado para almacenar el libro seleccionado y pasarle los datos al componente que deba
  // abrirse con los datos de dicho libro (i.e. el formulario o la ventana de prestar/devolver)
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // Estado para indicar si debe mostrarse el pop-up con el formulario
  const [showLibroForm, setShowLibroForm] = useState(false);
  // Funcion para indicar que se abra o cierre el formulario
  const openLibroForm = () => {
    setShowLibroForm((prev) => !prev);
  };

  // Estado para indicar si debe mostrarse la ventana de prestar/devolver
  const [showLibrosPrestados, setShowLibrosPrestados] = useState(false);
  // Estado para indicar que se abra o cierre la ventana de prestar/devolver
  const openLibrosPrestados = () => {
    setShowLibrosPrestados((prev) => !prev);
  };

  // Actualizar el listado de libros en redux para que se re renderize el componente Persona
  // cuando se cierran el popup del formulario o la ventana de prestar/devolver
  // en caso que hayan ocurrido cambios que deban renderizarse
  React.useEffect(() => {
    (async () => {
      if (!showLibroForm && !showLibrosPrestados) {
        const listadoLibros = await getListadoLibros();
        dispatch({ type: "REFRESH_LIBROS", data: listadoLibros });
      }
    })();
  }, [showLibroForm, showLibrosPrestados, dispatch]);
  /////////////////////////////////////////////////////

  return (
    <div className="componente">
      <div>
        <h2 className="componente-title "> Listado de Libros </h2>
        {/* Boton para abrir el formulario de alta. Al abrirse desde aqui no habra libro seleccionado
        y sera un formulario de alta */}
        <button className="add-componente" onClick={openLibroForm} title="Add Libro">Agregar Libro</button>
      </div>
      {/*Componentes de formulario de libro y ventana de prestar/devolver. Se les pasan los estados de libro seleccionado
        para que puedan renderizar los datos correspondientes, showModal indicando si debe renderizarse o no el componente,
        los metodos de setShowModal para que puedan modificar el estado showModal y cerrarse, y setLibroSeleccionado para
        deseleccionar el libro al cerrarse el componente */}
      <LibroForm showModal={showLibroForm} setShowModal={setShowLibroForm} libroSeleccionado={libroSeleccionado} setLibroSeleccionado={setLibroSeleccionado}/>
      <LibroPrestar showModal={showLibrosPrestados} setShowModal={setShowLibrosPrestados} libroSeleccionado={libroSeleccionado} setLibroSeleccionado={setLibroSeleccionado}/>
      <div className="container">
        {/*Renderizar una tarjeta por cada libro en el listado. A cada tarjeta se le pasan los datos del libro
                para renderizarlos, el metodo setLibroSeleccionado para que se seleccione el libro al que corresponde la tarjeta al
                clickear en ella o en el boton de editar, y los metodos para abrir el formulario y la ventana de prestar/devolver.
                En este caso, dado que al clickear en el libro este se seleccionará, el formulario de libro será para editar el libro
                en lugar de un formulario de alta.
                De ser el listadoLibros un array vacio se mostrará un mensaje diciendo que no se encontraron libros en la BD.*/}
        {listadoLibros.length ? (listadoLibros.map((libro, index) => (<UnLibro key={index}datos={libro} libroSeleccionado={libroSeleccionado} setLibroSeleccionado={setLibroSeleccionado}openLibroForm={openLibroForm}openLibrosPrestados={openLibrosPrestados}/>))) : (<h3>No se encontraron libros en la base de datos</h3>)}
      </div>
    </div>
  );
};