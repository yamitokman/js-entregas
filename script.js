alert("Bienvenido al teatro Coderhouse!")

let obra = Number(prompt("Ingrese el número correspondiente a la obra que desea ver: \n1 - HTML The Play\n2 - CSS The Play\n3 - Javascript The Play"))

while (obra === 0 || obra > 3) {
    if (obra === null) {
        alert("Operación cancelada.");
        break;
    }
    obra = Number(prompt("El número ingresado es inválido\n\nIngrese el número correspondiente a la obra que desea ver: \n1 - HTML The Play\n2 - CSS The Play\n3 - Javascript The Play"))
}

if (obra === 1) {
    obra = "HTML The Play"
} else if (obra === 2) {
    obra = "CSS The Play"
} else if (obra === 3) {
    obra = "Javascript The Play"
}

let cantidad = Number(prompt("Cuántas entradas desea obtener? El máximo es 4 por persona."))

while (cantidad === 0 || cantidad > 4) {
    cantidad = Number(prompt("El número ingresado es inválido\n\nCuántas entradas desea obtener? El máximo es 4 por persona."))
    if (cantidad === null) {
        alert("Operación cancelada.");
        break;
    }
}

let fila = Number(prompt("Ingrese el número correspondiente a su ubicación preferida: \n1 - Filas 1 a 30\n2 - Filas 31 a 60\n3 - Filas 61 a 100"))

while (fila === 0 || fila > 3) {
    fila = Number(prompt("El número ingresado es inválido\n\nIngrese el número correspondiente a su ubicación preferida: \n1 - Filas 1 a 30 (100 USD)\n2 - Filas 31 a 60 (60 USD)\n3 - Filas 61 a 100 (30 USD)"))
    if (fila === null) {
        alert("Operación cancelada.");
        break;
    }
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

let valorTotal = multiplicar(cantidad, valorEntrada)

function multiplicar(cant, valor) {
    return cant * valor
}

let continuar = prompt("El valor total de su compra es: " + valorTotal + " USD. Desea continuar? Escriba SI o NO.")

if (continuar.toUpperCase() === "SI") {
    alert("Muchas gracias por su compra! Ha adquirido " + cantidad + " entrada(s) para la función " + obra + " por un precio de " + valorTotal + " USD. Su ubicación se encuentra dentro de las filas " + filasElegidas + ".")
} else {
    alert("Operación cancelada.");
}