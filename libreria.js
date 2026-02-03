/*
    SIMULADOR DE COMPRA DE LIBROS

    Este proyecto simula la compra de un libro a partir de un catálogo.
    El usuario puede:
    - Elegir un género literario
    - Seleccionar un libro disponible
    - Indicar si pertenece al club de lectura
    - Obtener el precio final con descuento si corresponde
*/

// ======================================================
// CATÁLOGO DE LIBROS
// Array que contiene todos los libros disponibles.
// ======================================================
const CATALOGO_LIBROS = [
    { genero: "novela", titulo: "Hamnet", precio: 3500 },
    { genero: "novela", titulo: "Cien años de soledad", precio: 4500 },
    { genero: "novela", titulo: "Orgullo y prejuicio", precio: 4000 },
    { genero: "novela", titulo: "El túnel", precio: 3200 },
    { genero: "fantasia", titulo: "El hobbit", precio: 5000 },
    { genero: "fantasia", titulo: "Harry Potter y la Orden del Fenix", precio: 5300 },
    { genero: "fantasia", titulo: "Las Cronicas de Narnia - La Bruja, El Leon y el Armario", precio: 4800 },
    { genero: "fantasia", titulo: "Percy Jackson - El ladron del rayo", precio: 4700 },
    { genero: "poesia", titulo: "Veinte poemas de amor", precio: 3000 },
    { genero: "poesia", titulo: "Sonetos", precio: 3900 },
    { genero: "poesia", titulo: "El Cuervo y otros poemas", precio: 3700 },
    { genero: "poesia", titulo: "Martin Fierro", precio: 6000 }

];

// ======================================================
// FUNCIÓN: obtenerLibrosPorGenero
// Recibe un género y devuelve un array con los libros
// que pertenecen a ese género.
// ======================================================
function obtenerLibrosPorGenero(generoIngresado) {
    const librosFiltrados = [];

    // Recorremos todo el catálogo de libros
    for (let i = 0; i < CATALOGO_LIBROS.length; i++) {
        if (CATALOGO_LIBROS[i].genero === generoIngresado) {
            librosFiltrados.push(CATALOGO_LIBROS[i]);
        }
    }

    return librosFiltrados;
}




// ======================================================
// FUNCIÓN: mostrarLibrosDisponibles
// Le presenta al usuario un mensaje con los libros disponibles 
// para que este pueda elegir uno.
// ======================================================
function mostrarLibrosDisponibles(libros) {
    let mensaje = "Libros disponibles:\n";

    for (let i = 0; i < libros.length; i++) {
        mensaje +=
            (i + 1) + " - " +
            libros[i].titulo 
            + " - $" + libros[i].precio + "\n";
    }

    return mensaje;
}




// ======================================================
// FUNCIÓN: calcularPrecioFinal
// Calcula el precio final del libro según si el usuario
// es miembro del club de lectura brindado por la libreria.
// ======================================================
function calcularPrecioFinal(precioBase, esMiembroClub) {
    let descuento = 0;

    // Si el usuario es miembro del club, se aplica un descuento
    if (esMiembroClub) {
        descuento = 0.25;
    }

    const precioConDescuento = precioBase - (precioBase * descuento);
    return precioConDescuento;
}






// ======================================================
// FUNCIÓN PRINCIPAL DEL SIMULADOR
// Controla todo el flujo del programa.
// ======================================================
function iniciarSimulador() {
    alert("Bienvenido a la tienda online de nuestra librería!");

    const generosValidos = ["novela", "fantasia", "poesia"];
    let totalAPagar = 0;
    let seguirComprando = true;

    // ==========================
    // CONSULTA AL USUARIO SI POSEE MEMBRESÍA DE LA LIBRERIA 
    // ==========================
    const esMiembroClub = confirm("¿Sos miembro del club de lectura?");

    // ==========================
    // COMPRA DE LIBROS
    // ==========================
    while (seguirComprando) {

        let generoIngresado = "";
        let librosDisponibles = [];

        // --------------------------
        // EL USUARIO DEBE INGRESAR EL GENERO DEL LIBRO
        // --------------------------
        while (!generosValidos.includes(generoIngresado)) {
            const ingresoUsuario = prompt(
                "Ingrese un género literario:\n- novela\n- fantasia\n- poesia\n(Cancelar para salir)"
            );

            if (generosValidos.includes(ingresoUsuario.toLowerCase())) {
                generoIngresado = ingresoUsuario.toLowerCase()
                alert("Género seleccionado: " + generoIngresado);
            }
            
            if (!ingresoUsuario) 
            {
                alert("Ha cancelado la compra. Gracias por visitar nuestra librería.");
                return;
            }
        
    
            if (!generosValidos.includes(ingresoUsuario.toLowerCase())) {
                alert("Género no válido. Intente nuevamente.");
            }
        }

        librosDisponibles = obtenerLibrosPorGenero(generoIngresado);

        // --------------------------
        // SELECCIÓN DEL LIBRO
        // --------------------------
        let libroSeleccionado = null;

        while (!libroSeleccionado) {
            const mensajeLibros = mostrarLibrosDisponibles(librosDisponibles);
            const tituloIngresado = prompt(
                mensajeLibros + "\nIngrese el título del libro que desea comprar:"
            );

            if (!tituloIngresado) {
                alert("Debe ingresar un título para continuar.");
                continue;
            }

            for (let i = 0; i < librosDisponibles.length; i++) {
                if (librosDisponibles[i].titulo.toLowerCase() === tituloIngresado.toLowerCase()) {
                    libroSeleccionado = librosDisponibles[i];
                    break;
                }
            }

            if (!libroSeleccionado) {
                alert("El título ingresado no está disponible. Intente nuevamente.");
            }
        }

        // --------------------------
        // CÁLCULO Y ACUMULACIÓN
        // --------------------------
        const precioLibro = calcularPrecioFinal(
            libroSeleccionado.precio,
            esMiembroClub
        );

        totalAPagar += precioLibro;

        alert(
            "Libro agregado al carrito:\n" +
            "Título: " + libroSeleccionado.titulo + "\n" +
            "Precio original: $" + libroSeleccionado.precio + "\n" +
            (esMiembroClub
                ? "Descuento aplicado por membresía (25%)"
                : "No se aplicó descuento (no es miembro del club)") +
            "\nPrecio final: $" + precioLibro
        );

        // --------------------------
        // ¿SEGUIR COMPRANDO?
        // --------------------------
        seguirComprando = confirm("¿Desea comprar otro libro?");
    }

    // ==========================
    // SALIDA FINAL
    // ==========================
    alert(
    "Gracias por su compra!\n\n" +
    "El total a pagar es: $" + totalAPagar + "\n\n" +
    "Vuelva pronto a Libreria Alexandra."
);
    
}

// ======================================================
// EJECUCIÓN AUTOMÁTICA DEL SIMULADOR
// ======================================================
iniciarSimulador();