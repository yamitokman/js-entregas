const obras = [
    {
        numero: 1,
        titulo: "HTML The Play",
        img: "./imgs/portadas/portada-html.png",
        merch: [
            { nombre: "Taza", precio: 10, stock: 10, img: "./imgs/img-html/html-taza.png" },
            { nombre: "Poster", precio: 5, stock: 15, img: "./imgs/img-html/html-poster.png" },
            { nombre: "Gorra", precio: 15, stock: 8, img: "./imgs/img-html/html-gorra.png" },
            { nombre: "Buzo", precio: 40, stock: 5, img: "./imgs/img-html/html-buzo.png" },
            { nombre: "Remera", precio: 20, stock: 20, img: "./imgs/img-html/html-remera.png" },
            { nombre: "Programa", precio: 3, stock: 25, img: "./imgs/img-html/html-programa.png" },
        ],
    },
    {
        numero: 2,
        titulo: "CSS The Play",
        img: "./imgs/portadas/portada-css.png",
        merch: [
            { nombre: "Taza", precio: 10, stock: 10, img: "./imgs/img-css/css-taza.png" },
            { nombre: "Poster", precio: 5, stock: 15, img: "./imgs/img-css/css-poster.png" },
            { nombre: "Gorra", precio: 15, stock: 8, img: "./imgs/img-css/css-gorra.png" },
            { nombre: "Buzo", precio: 40, stock: 5, img: "./imgs/img-css/css-buzo.png" },
            { nombre: "Remera", precio: 20, stock: 20, img: "./imgs/img-css/css-remera.png" },
            { nombre: "Programa", precio: 3, stock: 25, img: "./imgs/img-css/css-programa.png" },
        ],
    },
    {
        numero: 3,
        titulo: "JavaScript The Play",
        img: "./imgs/portadas/portada-js.png",
        merch: [
            { nombre: "Taza", precio: 10, stock: 10, img: "./imgs/img-javascript/javascript-taza.png" },
            { nombre: "Poster", precio: 5, stock: 15, img: "./imgs/img-javascript/javascript-poster.png" },
            { nombre: "Gorra", precio: 15, stock: 8, img: "./imgs/img-javascript/javascript-gorra.png" },
            { nombre: "Buzo", precio: 40, stock: 5, img: "./imgs/img-javascript/javascript-buzo.png" },
            { nombre: "Remera", precio: 20, stock: 20, img: "./imgs/img-javascript/javascript-remera.png" },
            { nombre: "Programa", precio: 3, stock: 25, img: "./imgs/img-javascript/javascript-programa.png" },
        ],
    },
];

const filas = [
    { rango: "1 a 30", precio: 100 },
    { rango: "31 a 60", precio: 60 },
    { rango: "61 a 100", precio: 30 },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Funcion para calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => {
        if (item.tipo === "obra") {
            return total + item.precio;
        } else if (item.tipo === "merch") {
            return total + item.precioTotal;
        }
        return total;
    }, 0);
    return total;
}

// Funcion para actualizar el carrito
function actualizarCarrito() {
    const cartContent = document.getElementById("cart-content");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartContent || !cartCount || !cartTotal) {
        console.error("Elementos del carrito no encontrados en el DOM.");
        return;
    }

    cartCount.textContent = carrito.length;

    if (carrito.length === 0) {
        cartContent.innerHTML = "<p>Tu carrito está vacío.</p>";
        cartTotal.style.display = "none";
        guardarCarrito();
        return;
    }

    const lista = document.createElement("ul");
    lista.className = "list-group";

    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>
                ${item.tipo === "obra"
                ? `🎭 Obra: ${item.titulo} - Fecha: ${item.fecha} - Fila: ${item.fila} - Cantidad: ${item.cantidad} - $${item.precio}`
                : `🛒 Merch: ${item.item} (x${item.cantidad}) - $${item.precioTotal}`}
            </span>
            <button class="btn btn-sm btn-danger eliminar-item" data-index="${index}">Eliminar</button>
        `;
        lista.appendChild(li);
    });

    cartContent.innerHTML = "";
    cartContent.appendChild(lista);

    const total = calcularTotal();
    cartTotal.textContent = `Total: $${total}`;
    cartTotal.style.display = "block";

    document.querySelectorAll(".eliminar-item").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            eliminarItemCarrito(index);
        });

    });

    guardarCarrito();
}

// Funcion para eliminar un ítem del carrito
function eliminarItemCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Funcion para agregar una obra al carrito
function agregarObraAlCarrito(numeroObra, fecha, fila) {
    const obra = obras.find((o) => o.numero === parseInt(numeroObra));
    const tarjeta = document.querySelector(`.agregar-obra[data-numero="${numeroObra}"]`).closest(".card");
    const cantidadEntradas = tarjeta.querySelector(".cantidad-entradas").value;

    if (!fecha || !fila || cantidadEntradas <= 0) {
        alert("Por favor, selecciona una fecha, fila válida y cantidad mayor a 0.");
        return;
    }

    const filaSeleccionada = filas.find((f) => f.rango === fila);
    const precioFila = filaSeleccionada ? filaSeleccionada.precio : 0;

    carrito.push({
        tipo: "obra",
        titulo: obra.titulo,
        fecha,
        fila,
        cantidad: parseInt(cantidadEntradas),
        precio: precioFila * parseInt(cantidadEntradas),
    });

    actualizarCarrito();
}

// Función para agregar merchandising al carrito
function agregarMerchAlCarrito(numeroObra) {
    const obra = obras.find((o) => o.numero === parseInt(numeroObra));
    const inputs = document.querySelectorAll(".cantidad-merch");
    const itemsSeleccionados = Array.from(inputs)
        .filter((input) => parseInt(input.value) > 0)
        .map((input) => ({
            nombre: input.dataset.nombre,
            cantidad: parseInt(input.value),
            precio: parseInt(input.dataset.precio),
        }));

    itemsSeleccionados.forEach((item) => {
        const merch = obra.merch.find((m) => m.nombre === item.nombre);
        if (merch && merch.stock >= item.cantidad) {
            merch.stock -= item.cantidad;
            carrito.push({
                tipo: "merch",
                titulo: obra.titulo,
                item: item.nombre,
                cantidad: item.cantidad,
                precioTotal: item.cantidad * item.precio,
            });
        } else {
            alert(`No hay suficiente stock para ${item.nombre}.`);
        }
    });

    actualizarCarrito();
}

// Función para renderizar las obras
function renderizarObras() {
    const container = document.getElementById("obras-container");
    if (!container) {
        alert("Error: contenedor de obras no encontrado.");
        return;
    }

    container.innerHTML = "";

    obras.forEach((obra) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3";
        card.innerHTML = `
            <div class="card">
                <img src="${obra.img}" class="card-img-top" alt="${obra.titulo}">
                <div class="card-body text-center">
                    <h5 class="card-title">${obra.titulo}</h5>
                    <p>Selecciona una fecha, fila y cantidad de entradas:</p>
                    <input type="date" class="form-control mb-2">
                    <select class="form-select mb-2">
                        ${filas
                .map(
                    (fila) =>
                        `<option value="${fila.rango}">Filas ${fila.rango} ($${fila.precio})</option>`
                )
                .join("")}
                    </select>
                    <input type="number" class="form-control mb-3 cantidad-entradas" min="1" value="1">
                    <div class="mt-3">
                        <button class="btn btn-primary agregar-obra" data-numero="${obra.numero}">Agregar Obra al Carrito</button>
                        <button class="btn btn-secondary mostrar-merch" data-numero="${obra.numero}">Comprar Merch</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    asignarEventosObras();
    asignarEventosMerch();
}

// Funcion para asignar eventos a las obras
function asignarEventosObras() {
    document.querySelectorAll(".agregar-obra").forEach((boton) => {
        boton.addEventListener("click", () => {
            const tarjeta = boton.closest(".card");
            const fecha = tarjeta.querySelector('input[type="date"]').value;
            const fila = tarjeta.querySelector("select").value;
            const numeroObra = boton.dataset.numero;

            if (!fecha || !fila) {
                alert("Por favor, selecciona una fecha y fila.");
                return;
            }

            agregarObraAlCarrito(numeroObra, fecha, fila);
        });
    });
}

// Funcion para asignar eventos al merchandising
function asignarEventosMerch() {
    document.querySelectorAll(".mostrar-merch").forEach((boton) => {
        boton.addEventListener("click", () => {
            const numeroObra = boton.dataset.numero;
            mostrarMerch(numeroObra);
        });
    });
}

// Funcion para mostrar el merchandising en base a la obra seleccionada
function mostrarMerch(numeroObra) {
    const obra = obras.find((o) => o.numero === parseInt(numeroObra));
    const container = document.getElementById("merch-container");
    container.innerHTML = `
        <h3>Merchandising de ${obra.titulo}</h3>
        <div class="row">
            ${obra.merch
            .map(
                (item) =>
                    `<div class="col-md-4 merch-item">
                            <img src="${item.img}" alt="${item.nombre}" class="img-fluid">
                            <p>${item.nombre} - $${item.precio} (Stock: ${item.stock})</p>
                            <input type="number" min="1" max="${item.stock}" value="0" class="form-control mb-2 cantidad-merch" data-nombre="${item.nombre}" data-precio="${item.precio}" data-stock="${item.stock}">
                        </div>`
            )
            .join("")}
        </div>
        <button id="agregar-merch" class="btn btn-success mt-3">Agregar Merch al Carrito</button>
    `;
    container.style.display = "block";

    document.getElementById("agregar-merch").addEventListener("click", () => {
        agregarMerchAlCarrito(numeroObra);
    });
}

function ocultarMerch() {
    const container = document.getElementById("merch-container");
    container.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    renderizarObras();
    actualizarCarrito();
});