// Función para cargar los datos desde el archivo JSON
async function cargarDatos() {
    try {
        const obrasGuardadas = localStorage.getItem('obras');
        if (obrasGuardadas) {
            obras = JSON.parse(obrasGuardadas);
        } else {
            const response = await fetch('./data.json');
            const data = await response.json();
            obras = data.obras;
        }
        renderizarObras();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
});

const filas = [
    { rango: "1 a 30", precio: 100 },
    { rango: "31 a 60", precio: 60 },
    { rango: "61 a 100", precio: 30 },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('obras', JSON.stringify(obras));
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

    cartCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);

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
            <button class="btn btn-sm btn-danger eliminar-item" data-index="${index}">🗑 Eliminar</button>
        `;
        lista.appendChild(li);
    });

    cartContent.innerHTML = "";
    cartContent.appendChild(lista);

    const total = carrito.reduce((sum, item) => {
        return sum + (item.tipo === "obra" ? item.precio : item.precioTotal);
    }, 0);

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
    const item = carrito[index];

    if (item.tipo === "merch") {
        const obra = obras.find((o) => o.titulo === item.titulo);
        const merch = obra.merch.find((m) => m.nombre === item.item);

        if (merch) {
            merch.stock += item.cantidad;
        }
    }

    carrito.splice(index, 1);

    guardarCarrito();
    actualizarCarrito();
}

// Funcion para agregar una obra al carrito
function agregarObraAlCarrito(numeroObra, fecha, fila) {
    const obra = obras.find((o) => o.numero === parseInt(numeroObra));
    const tarjeta = document.querySelector(`.agregar-obra[data-numero="${numeroObra}"]`).closest(".card");
    const cantidadEntradas = tarjeta.querySelector(".cantidad-entradas").value;

    if (!fecha || !fila || cantidadEntradas <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona una fecha, fila válida y cantidad mayor a 0.'
        });
        return;
    }

    const filaSeleccionada = filas.find((f) => f.rango === fila);
    const precioFila = filaSeleccionada ? filaSeleccionada.precio : 0;

    const existingItem = carrito.find(
        (c) => c.tipo === "obra" && c.titulo === obra.titulo && c.fecha === fecha && c.fila === fila
    );

    if (existingItem) {
        existingItem.cantidad += parseInt(cantidadEntradas, 10);
        existingItem.precio += precioFila * parseInt(cantidadEntradas, 10);
    } else {
        carrito.push({
            tipo: "obra",
            titulo: obra.titulo,
            fecha,
            fila,
            cantidad: parseInt(cantidadEntradas, 10),
            precio: precioFila * parseInt(cantidadEntradas, 10),
        });
    }

    Swal.fire({
        icon: 'success',
        title: '¡Obra agregada al carrito!',
        text: `${obra.titulo} - ${cantidadEntradas} entrada(s) agregadas.`
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

    let itemsSinStock = [];

    itemsSeleccionados.forEach((item) => {
        const merch = obra.merch.find((m) => m.nombre === item.nombre);

        if (merch) {
            if (merch.stock >= item.cantidad) {
                merch.stock -= item.cantidad;

                const existingItem = carrito.find(
                    (c) => c.tipo === "merch" && c.titulo === obra.titulo && c.item === item.nombre
                );

                if (existingItem) {
                    existingItem.cantidad += item.cantidad;
                    existingItem.precioTotal += item.cantidad * item.precio;
                } else {
                    carrito.push({
                        tipo: "merch",
                        titulo: obra.titulo,
                        item: item.nombre,
                        cantidad: item.cantidad,
                        precioTotal: item.cantidad * item.precio,
                    });
                }
            } else {
                itemsSinStock.push(item.nombre);
            }
        }
    });

    if (itemsSeleccionados.length > 0) {
        Swal.fire({
            icon: 'success',
            title: '¡Merch agregado al carrito!',
            html: itemsSeleccionados
                .filter((item) => !itemsSinStock.includes(item.nombre))
                .map(
                    (item) => `<p>${item.cantidad} x ${item.nombre} - $${item.cantidad * item.precio}</p>`
                )
                .join(''),
            confirmButtonText: 'Aceptar',
        });
    }

    if (itemsSinStock.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            html: itemsSinStock.map((nombre) => `<p>${nombre} no tiene stock suficiente.</p>`).join(''),
            confirmButtonText: 'Aceptar',
        });
    }

    guardarCarrito();
    actualizarCarrito();
    mostrarMerch(numeroObra);
}


// Función para renderizar las obras
function renderizarObras() {
    const container = document.getElementById("obras-container");
    if (!container) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error: contenedor de obras no encontrado.'
        });
        return;
    }

    container.innerHTML = "";

    obras.forEach((obra) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3 obra-card";
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
                        <button id="boton-agregar" class="btn btn-primary agregar-obra" data-numero="${obra.numero}">Agregar Obra al Carrito</button>
                        <button id="boton-merch" class="btn btn-secondary mostrar-merch" data-numero="${obra.numero}">Comprar Merch</button>
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, selecciona una fecha y fila.'
                });
                return;
            }

            agregarObraAlCarrito(numeroObra, fecha, fila);
            guardarCarrito();
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
                            <input 
                                type="number" 
                                min="1" 
                                max="${item.stock}" 
                                value="0" 
                                class="form-control mb-2 cantidad-merch" 
                                data-nombre="${item.nombre}" 
                                data-precio="${item.precio}" 
                                data-stock="${item.stock}">
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

// Funcion para ocultar merch
function ocultarMerch() {
    const container = document.getElementById("merch-container");
    container.style.display = "none";
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tu carrito está vacío. Agrega productos antes de finalizar la compra.'
        });
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalDatosPersonales'));
    modal.show();

    document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const domicilio = document.getElementById('domicilio').value.trim();

        if (!nombre || !apellido || !email || !domicilio) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos antes de finalizar la compra.'
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingresa un correo electrónico válido.'
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: '¡Compra finalizada! 🛒🎉',
            text: `Gracias por tu compra, ${nombre} ${apellido}. Los productos serán enviados a ${domicilio}.`
        });

        carrito = [];
        actualizarCarrito();
        guardarCarrito();

        modal.hide();
    });
}

// Función para filtrar las obras según la búsqueda del usuario
function buscarObras() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const obrasContainer = document.getElementById('obras-container');
    const obrasFiltradas = obras.filter(obra =>
        obra.titulo.toLowerCase().includes(searchQuery)
    );

    obrasContainer.innerHTML = '';

    obrasFiltradas.forEach(obra => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3 obra-card';
        card.innerHTML = `
            <div class="card">
                <img src="${obra.img}" class="card-img-top" alt="${obra.titulo}">
                <div class="card-body text-center">
                    <h5 class="card-title">${obra.titulo}</h5>
                    <p>Selecciona una fecha, fila y cantidad de entradas:</p>
                    <input type="date" class="form-control mb-2">
                    <select class="form-select mb-2">
                        ${filas.map(fila => `<option value="${fila.rango}">Filas ${fila.rango} ($${fila.precio})</option>`).join('')}
                    </select>
                    <input type="number" class="form-control mb-3 cantidad-entradas" min="1" value="1">
                    <div class="mt-3">
                        <button class="btn agregar-obra" data-numero="${obra.numero}">Agregar Obra al Carrito</button>
                        <button class="btn mostrar-merch" data-numero="${obra.numero}">Comprar Merch</button>
                    </div>
                </div>
            </div>
        `;
        obrasContainer.appendChild(card);
    });

    if (obrasFiltradas.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron resultados para tu búsqueda.'
        });
        return;
    }

    asignarEventosObras();
    asignarEventosMerch();

    document.querySelectorAll('.agregar-obra').forEach(boton => {
        boton.classList.add('btn', 'btn-primary');
    });

    document.querySelectorAll('.mostrar-merch').forEach(boton => {
        boton.classList.add('btn', 'btn-secondary');
    });
}

// Asignar la función al botón de búsqueda
document.getElementById('search-button').addEventListener('click', buscarObras);

// También hacer que la búsqueda ocurra automáticamente al presionar "Enter"
document.getElementById('search-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        buscarObras();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarCarrito();
    renderizarObras();

    const finalizarCompraButton = document.querySelector(".modal-footer .btn-primary");
    if (finalizarCompraButton) {
        finalizarCompraButton.addEventListener("click", finalizarCompra);
    }
});