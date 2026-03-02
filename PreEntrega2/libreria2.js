// ======================================================
// Clase de productos con los que se trabaja en el proyecto
// ======================================================
class Libro {
    constructor(id, genero, titulo, precio) {
        this.id = id;
        this.genero = genero;
        this.titulo = titulo;
        this.precio = precio;
    }
}

// ======================================================
// Base de datos de socios de la libreria
// ======================================================
const socios = [
    { dni: "12345678", nombre: "Augusto", descuento: 20 },
    { dni: "87654321", nombre: "Elias", descuento: 20 },
    { dni: "11223344", nombre: "Victoria", descuento: 20 },
    { dni: "44332211", nombre: "Rebeca", descuento: 20 },
];

// ======================================================
// ARRAY DE LIBROS (OBJETOS)
// ======================================================
const catalogo = [
    new Libro(1, "novela", "Hamnet", 3500),
    new Libro(2, "novela", "Cien años de soledad", 4500),
    new Libro(3, "novela", "Orgullo y prejuicio", 4000),
    new Libro(4, "fantasia", "El hobbit", 5000),
    new Libro(5, "fantasia", "Harry Potter", 5300),
    new Libro(6, "fantasia", "Las Cronicas de Narnia - La Bruja, El Leon y el Armario", 4800),
    new Libro(7, "poesia", "Sonetos", 3900),
    new Libro(8, "poesia", "El Cuervo y otros poemas", 3700),
    new Libro(9, "poesia", "Martin Fierro", 6000),
];

// ======================================================
// variables globales  
// ======================================================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let descuentoAplicado = 0;

// ======================================================
// Exportar libros de acuerdo al genero seleccionado
// ======================================================
function renderizarLibros(generoSeleccionado) {

    const contenedor = document.getElementById("contenedorLibros");
    contenedor.innerHTML = "";

    const librosFiltrados = catalogo.filter(libro => libro.genero === generoSeleccionado);

    librosFiltrados.forEach(libro => {

        const div = document.createElement("div");
        div.innerHTML = `
            <p>${libro.titulo} - $${libro.precio}</p>
            <button data-id="${libro.id}">Agregar</button>
        `;

        contenedor.appendChild(div);
    });
}


// ======================================================
// Generar el carrito de compras
// ======================================================
function renderizarCarrito() {

    const contenedor = document.getElementById("carrito");
    const totalElemento = document.getElementById("total");

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach(libro => {

        const subtotal = libro.precio * libro.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.innerHTML = `
            <p>
                ${libro.titulo} 
                | Cantidad: ${libro.cantidad} 
                | Subtotal: $${subtotal}
            </p>
            <button class="sumar" data-id="${libro.id}">+</button>
            <button class="restar" data-id="${libro.id}">-</button>
        `;

        contenedor.appendChild(div);
    });
    //Aplicar descuento al final
    let totalConDescuento = total;
    if (descuentoAplicado > 0) {
    totalConDescuento = total - (total * descuentoAplicado / 100);
}

    totalElemento.textContent = `Total: $${totalConDescuento || total}`;
}

// Si el DNI ingresado se encuentra en la base de datos de socios, se le aplica 
// el descuento correspondiente al total de su compra. Si no, se muestra un mensaje de que no se encuentra registrado.

function verificarDNI() {

    const dniIngresado = document.getElementById("dniInput").value;

    const socioEncontrado = socios.find(
        socio => socio.dni === dniIngresado
    );

    const mensaje = document.getElementById("mensajeDescuento");

    if (socioEncontrado) {
        descuentoAplicado = socioEncontrado.descuento;
        mensaje.textContent = `Descuento aplicado: ${descuentoAplicado}%`;
    } else {
        descuentoAplicado = 0;
        mensaje.textContent = "DNI no registrado en la librería";
    }

    renderizarCarrito();
}

// ======================================================
// AGREGAR AL CARRITO
// ======================================================
function agregarAlCarrito(id) {

    const libroEncontrado = catalogo.find(libro => libro.id === Number(id));

    // Buscar si ya está en el carrito
    const libroEnCarrito = carrito.find(libro => libro.id === libroEncontrado.id);

    if (libroEnCarrito) {
        // Si existe → aumentar cantidad
        libroEnCarrito.cantidad += 1;
    } else {
        // Si no existe → agregar con cantidad 1
        carrito.push({
            ...libroEncontrado,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    renderizarCarrito();
}

// ======================================================
// En caso de que el usuario haya seleccionado de mas, se le permite restar la cantidad 
// de un libro en el carrito. Si la cantidad llega a 0, se elimina el libro del carrito.
// ======================================================

function restarCantidad(id) {

    const libro = carrito.find(
        item => item.id === Number(id)
    );

    if (!libro) return;

    libro.cantidad -= 1;

    if (libro.cantidad === 0) {
        carrito = carrito.filter(
            item => item.id !== libro.id
        );
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}


// ======================================================
// FINALIZAR COMPRA
// ======================================================
function finalizarCompra() {

    if (carrito.length === 0) {
        return;
    }

    carrito = [];
    localStorage.removeItem("carrito");

    //Resetear descuento aplicado
    descuentoAplicado = 0;

    //Limpiar el input del DNI
    document.getElementById("dniInput").value = "";

    //Borrar mensaje de descuento
    document.getElementById("mensajeDescuento").textContent = "";

    //Limpiar los libros mostrados para seleccionar
    document.getElementById("contenedorLibros").innerHTML = "";
  

    renderizarCarrito();

    let mensajeExistente = document.getElementById("mensajeCompra");

    if (!mensajeExistente) {
    const mensaje = document.createElement("p");
    mensaje.id = "mensajeCompra";
    mensaje.textContent = "Compra realizada con éxito";
    document.body.appendChild(mensaje);
    } 
    else {
    mensajeExistente.textContent = "Compra realizada con éxito";
    }
}


// ======================================================
// EVENTOS
// ======================================================

document.getElementById("selectGenero").addEventListener("change", (e) => {
    renderizarLibros(e.target.value);
});

document.getElementById("contenedorLibros").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        agregarAlCarrito(e.target.dataset.id);
    }
});

document.getElementById("carrito").addEventListener("click", (e) => {

        const id = e.target.dataset.id;

        if (e.target.classList.contains("sumar")) {
            agregarAlCarrito(id);
        }
        if (e.target.classList.contains("restar")) {
            restarCantidad(id);
        }
});

document.getElementById("aplicarDescuento").addEventListener("click", verificarDNI);

document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);

document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);


// ======================================================
// INICIALIZAR
// ======================================================
renderizarCarrito();