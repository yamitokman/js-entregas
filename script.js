alert("Bienvenido al teatro Coderhouse!")

const obras = [
    { numero: 1, titulo: "HTML The Play" },
    { numero: 2, titulo: "CSS The Play" },
    { numero: 3, titulo: "Javascript The Play" }
]

const filas = [
    { rango: "1 a 30", precio: 100 },
    { rango: "31 a 60", precio: 60 },
    { rango: "61 a 100", precio: 30 }
]

const merchandising = [
    { id: 1, producto: "taza", precio: 10, stock: 17 },
    { id: 2, producto: "remera", precio: 25, stock: 20 },
    { id: 3, producto: "buzo", precio: 45, stock: 7 },
    { id: 4, producto: "poster", precio: 5, stock: 31 },
    { id: 5, producto: "programa", precio: 2, stock: 56 },
]

let continuarPrograma = true
let carrito = []

// Funcion para obtener una entrada valida
const obtenerInput = (mensaje, validaciones) => {
    let valor;
    do {
        valor = prompt(mensaje);
        if (valor === null) {
            return null
        }
        valor = Number(valor)
    } while (isNaN(valor) || validaciones(valor));
    return valor;
}

while (continuarPrograma) {

    // Seleccion de la obra
    const numeroObra = obtenerInput("Ingrese el número correspondiente a la obra que desea ver: \n1 - HTML The Play\n2 - CSS The Play\n3 - Javascript The Play", (valor => valor < 1 || valor > 3))

    if (numeroObra === null) break;

    const obraSeleccionada = obras.find((obra) => obra.numero === numeroObra)

    // Seleccion de cantidad de entradas
    const cantidad = obtenerInput("Cuántas entradas desea obtener? El máximo es 4 por persona.", (valor) => valor < 1 || valor > 4)

    if (cantidad === null) break;

    // Seleccion de fila
    const fila = obtenerInput("Ingrese el número correspondiente a su ubicación preferida: \n1 - Filas 1 a 30 (100 USD)\n2 - Filas 31 a 60 (60 USD)\n3 - Filas 61 a 100 (30 USD)", (valor) => valor < 1 || valor > 3)

    if (fila === null) break;
    const filaSeleccionada = filas[fila - 1];

    // Calculo del valor total de las entradas
    const valorTotalEntradas = cantidad * filaSeleccionada.precio;

    // Comprar merchandising?
    let deseaComprarMerch = false;
    let continuarCompraMerch = true;

    let merch = prompt("Desea comprar merchandising de la obra?\nIngrese el número correspondiente:\n1 - SI\n2 - NO")
    if (merch === null) {
        alert("Operación cancelada.");
        continuarCompraMerch = false
    }
    merch = Number(merch);
    if (merch === 1) {
        deseaComprarMerch = true
    } else if (merch === 2) {
        deseaComprarMerch = false
        continuarCompraMerch = false
    } else {
        alert("Opción inválida. Por favor, elija 1 o 2.")
        continuarCompraMerch = false
    }

    if (deseaComprarMerch) {
        while (continuarCompraMerch) {
            // Mostrar los productos disponibles
            let salida = "ID - PRODUCTO - PRECIO\n\n"
            salida += merchandising.map(item => item.id + " - " + item.producto.toUpperCase() + " - " + item.precio + " USD").join("\n")

            // Pedir ID del producto
            let idProducto = prompt("Ingrese el ID del producto que desea comprar:\n\n" + salida)
            idProducto = Number(idProducto);

            const productoSeleccionado = merchandising.find(item => item.id === idProducto)
            if (!productoSeleccionado) {
                alert("Producto no encontrado.");
                continue;
            }

            // Pedir cantidad y verificar si hay suficiente stock
            let cantidadProducto = obtenerInput("Cuántos productos desea comprar de " + productoSeleccionado.producto + "? Hay " + productoSeleccionado.stock + " en stock", (valor) => valor < 1 || isNaN(valor));

            if (cantidadProducto === null) break;

            // Verificar si hay suficiente stock
            if (cantidadProducto > productoSeleccionado.stock) {
                alert("No hay suficiente stock para esa cantidad. Intente con una cantidad menor.")
                continue;
            }

            // Restar del stock disponible
            productoSeleccionado.stock -= cantidadProducto;

            // Agregar al carrito
            carrito.push({
                producto: productoSeleccionado.producto,
                cantidad: cantidadProducto,
                precio: productoSeleccionado.precio,
                total: productoSeleccionado.precio * cantidadProducto
            });

            // Preguntar si quiere agregar más productos
            let continuarOtroProducto = prompt("¿Desea agregar más productos al carrito?\n1 - Sí\n2 - No");
            if (continuarOtroProducto === "2") {
                continuarCompraMerch = false;
            }
        }
    }

    // Calcular total del carrito de merchandising
    const totalMerchandising = carrito.reduce((total, item) => total + item.total, 0);

    // Confirmacion de compra
    const totalCompra = valorTotalEntradas + totalMerchandising
    let continuar
    do {
        continuar = prompt("El valor total de su compra es: " + totalCompra + " USD.\nDesea continuar?\n1 - SI\n2 - NO")
        if (continuar === null) {
            alert("Operación cancelada.");
            break;
        }
        switch (continuar) {
            case "1":
                let resumenCompra = "Muchas gracias por su compra! Ha adquirido " + cantidad + " entrada(s) para la función " + obraSeleccionada.titulo + " por un precio de " + valorTotalEntradas + " USD. Su ubicación se encuentra dentro de las filas " + filaSeleccionada.rango + ".";
                if (carrito.length > 0) {
                    resumenCompra += "\n\nProductos adicionales:\n"
                    carrito.forEach(item => {
                        resumenCompra += item.cantidad + "x " + item.producto + " = " + item.total + " USD\n";
                    })
                }
                resumenCompra += "\nTotal: " + totalCompra + " USD."
                alert(resumenCompra);
                continuarPrograma = false;
                break;
            case "2":
                alert("Operación cancelada.")
                continuarPrograma = false;
                break;
            default:
                alert("Opción inválida. Por favor, elija 1 o 2")
                continuar = "";
        }
    } while (continuar === "");

    if (continuar === null) {
        break;
    }
}

alert("Gracias por visitar el teatro Coderhouse!")