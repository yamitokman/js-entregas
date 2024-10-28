while (true) {
    alert("Bienvenido al teatro Coderhouse!")

    let obra
    do {
        obra = prompt("Ingrese el número correspondiente a la obra que desea ver: \n1 - HTML The Play\n2 - CSS The Play\n3 - Javascript The Play")
        if (obra === null) {
            alert("Operación cancelada.");
            break;
        }
        obra = Number(obra)
    } while (isNaN(obra) || obra < 1 || obra > 3);

    if (obra === null) {
        break;
    }

    if (obra === 1) {
        obra = "HTML The Play"
    } else if (obra === 2) {
        obra = "CSS The Play"
    } else if (obra === 3) {
        obra = "Javascript The Play"
    }

    let cantidad
    do {
        cantidad = prompt("Cuántas entradas desea obtener? El máximo es 4 por persona.")
        if (cantidad === null) {
            alert("Operación cancelada.");
            break;
        }
        cantidad = Number(cantidad)
    } while (isNaN(cantidad) || cantidad < 1 || cantidad > 4);

    if (cantidad === null) {
        break;
    }

    let fila
    do {
        fila = prompt("Ingrese el número correspondiente a su ubicación preferida: \n1 - Filas 1 a 30 (100 USD)\n2 - Filas 31 a 60 (60 USD)\n3 - Filas 61 a 100 (30 USD)")
        if (fila === null) {
            alert("Operación cancelada.");
            break;
        }
        fila = Number(fila)
    } while (isNaN(fila) || fila < 1 || fila > 3);

    if (fila === null) {
        break;
    }

    let filasElegidas

    if (fila === 1) {
        filasElegidas = "1 a 30"
    } else if (fila === 2) {
        filasElegidas = "31 a 60"
    } else if (fila === 3) {
        filasElegidas = "61 a 100"
    }

    let valorEntrada

    if (fila === 1) {
        valorEntrada = 100
    } else if (fila === 2) {
        valorEntrada = 60
    } else if (fila === 3) {
        valorEntrada = 30
    }

    function multiplicar(cantidad, valorEntrada) {
        return cantidad * valorEntrada
    }

    let valorTotal = multiplicar(cantidad, valorEntrada)

    let continuar
    do {
        continuar = prompt("El valor total de su compra es: " + valorTotal + " USD.\nDesea continuar?\n1 - SI\n2 - NO").toUpperCase()
        if (continuar === null) {
            alert("Operación cancelada.");
            break;
        }
        switch (continuar) {
            case "1":
                alert("Muchas gracias por su compra! Ha adquirido " + cantidad + " entrada(s) para la función " + obra + " por un precio de " + valorTotal + " USD. Su ubicación se encuentra dentro de las filas " + filasElegidas + ".")
                break;
            case "2":
                alert("Operación cancelada.")
                break;
            default:
                alert("Opción inválida. Por favor, elija 1, 2 o 3.")
                continuar = "";
        }
    } while (continuar === "");
}