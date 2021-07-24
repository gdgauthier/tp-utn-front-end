import axios from 'axios';
import {serverUrl} from '../serverUrl.json';

// Funcion para obtener listado de personas del servidor ////
// y unirlo con los libros prestados a cada una /////////////
const getListadoPersonas = async () => {
    
    try { // try para llamada al servidor por la lista de personas
        
        /*GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] 
        * o bien status 413 y []
        */
        const personas = await axios.get(serverUrl+'/persona'); // Listado de personas del servidor

        /* GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, 
         *   persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"
        */
        let libros;
        try { // try para llamada al servidor por la lista de libros
            libros = await axios.get(serverUrl+'/libro'); // Listado de libros del servidor
        } catch {
            libros = []; // De haber algun error en el pedido al servidor devolver un array vacio
        };

        // Unir listado de personas con los libros correspondientes
        let listadoPersonas = personas.data.map((persona) => {
            let librosPrestados = libros.data.filter((libro) => {
                return libro.persona_id === persona.id;
            });
            persona.librosPrestados = librosPrestados;
            return persona;
        });
        return listadoPersonas; // retornar listado de personas y libros prestados
    } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
        return [];
    };   
};
/////////////////////////////////////////////////////

// Funcion para obtener listado de libros del servidor y unirlo con las personas //
// a las cuales los libros fueron prestados y el nombre de la categoria /////////// 
const getListadoLibros = async () => {
    
    try { // try para llamada al servidor por la lista de libros
        
        /* GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, 
         *   persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"
        */
        const libros = await axios.get(serverUrl+'/libro'); // Listado de personas del servidor
        
        let categorias;
        try { // try para llamada al servidor por la lista de libros        
            /* GET '/categoria' retorna: status 200  y [{id:numerico, nombre:string}]
             *  - status: 413 y []
            */
            categorias = await axios.get(serverUrl+'/categoria'); // Listado de personas del servidor
        } catch (e) {
            categorias = [];
        };

        let listadoPersonas;
        try { // try para llamada al servidor por la lista de personas
        
            /*GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] 
            * o bien status 413 y []
            */
            listadoPersonas = await axios.get(serverUrl+'/persona'); // Listado de personas del servidor
    
        } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
            listadoPersonas = [];
        } 

        // Unir listado de libros con las personas correspondientes
        let listadoLibros = libros.data.map((libro) => {
            let persona = listadoPersonas.data.filter((pers) => {
                return pers.id === libro.persona_id;
            });
            let categoria = categorias.data.filter((cat) => {
                return cat.id === libro.categoria_id;
            });
            if (persona.length > 0) {
                libro.persona_nombre = persona[0].nombre;
                libro.persona_alias = persona[0].alias;
                libro.persona_apellido = persona[0].apellido;
            }
            if (categoria.length > 0) {
                libro.categoria = categoria[0].nombre;
            }
            return libro;
        });

        return listadoLibros; // retornar listado de personas y libros prestados

    } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
        return [];
    };   
};
/////////////////////////////////////////////////////

// Funcion para obtener listado de categorías del servidor //
// y unirlo con los libros de cada categoria ////////////////
const getListadoCategorias = async () => {
    
    try { // try para llamada al servidor por la lista de libros
        
        /* GET '/categoria' retorna: status 200  y [{id:numerico, nombre:string}]
         *  - status: 413 y []
        */
        const categorias = await axios.get(serverUrl+'/categoria'); // Listado de personas del servidor

        let listadoLibros;
        try { // try para llamada al servidor por la lista de libros
        
            /* GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, 
             *   persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"
            */
            listadoLibros = await axios.get(serverUrl+'/libro'); // Listado de personas del servidor
               
        } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
            listadoLibros = [];
        }

        // Unir listado de libros con las personas correspondientes
        let listadoCategorias = categorias.data.map((categoria) => {
            let libros = listadoLibros.data.filter((libro) => {
                return libro.categoria_id === categoria.id;
            });
            categoria.libros = libros;
            return categoria;
        });

        listadoCategorias.sort(function(a, b){return a.id - b.id}); // Sort by id
        return listadoCategorias; // retornar listado de personas y libros prestados

    } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
        return [];
    };   
};

// Funcion para obtener listado de libros de la persona seleccionada del servidor ////
const getLibrosPersona = async (personaId) => {
    
    try { // try para llamada al servidor        
        
        /* GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, 
         *   persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"
        */
        const libros = await axios.get(serverUrl+'/libro');
        
        // Unir listado de personas con los libros correspondientes
        const librosPrestados = libros.data.filter((libro) => {
                return libro.persona_id === personaId;
            });

        return librosPrestados; // retornar listado de personas y libros prestados

    } catch (e) { // De haber algun error en el pedido al servidor devolver un array vacio
        return [];
    };   
};

export {getListadoPersonas,
        getListadoLibros,
        getListadoCategorias,
        getLibrosPersona
        };