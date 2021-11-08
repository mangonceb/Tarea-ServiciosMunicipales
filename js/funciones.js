var arrayServicios = new Array();
var arrayCalles = new Array();
var marcadores = new Array();
var contador = 0;
var pos = 0;
var calle = "";
var totalpedido = 0;
class servicio {
    constructor(id, Descripcion, Direccion, Tipo, Latitud, Longitud, Precio, Duracion, CalleMaps) {
        this.id = id;
        this.Descripcion = Descripcion;
        this.Direccion = Direccion;
        this.Tipo = Tipo;
        this.Latitud = Latitud;
        this.Longitud = Longitud;
        this.Precio = Precio;
        this.Duracion = Duracion;
        this.CalleMaps = CalleMaps;
    }
    leerRegistro() {
        return this;
    }
}

/*Promesa creada para poder cargar los elementos de la tabla de forma sincronizada, para evitar el
error de google maps de que no pueda cargar las calles a tiempo*/
const espera = ms => new Promise(res => setTimeout(res, ms))

function generarServicios(evt) {
    var cuerpoa = document.querySelector("#cuerpoServicios");
    cuerpoa.innerHTML = "";

    myDBInstance.transaction(function (tran) {
        tran.executeSql('SELECT * FROM servicios', [], function (tran, data) {
            cargar();
            //Función asíncrona para cargar la tabla con un tiempo de espera entre fila y fila (para evitar errores)
            async function cargar() {
                for (i = 0; i < data.rows.length; i++) {

                    //El último atributo del objeto está vacío, ya que lo generamos luego a través de la API
                    registroServicios = new servicio(
                        data.rows[i].id,
                        data.rows[i].Descripcion,
                        data.rows[i].Direccion,
                        data.rows[i].Tipo,
                        data.rows[i].Latitud,
                        data.rows[i].Longitud,
                        data.rows[i].Precio,
                        data.rows[i].Duracion,
                        "");

                    linea = document.createElement("tr");
                    botonId = document.createElement("button");

                    dato = document.createTextNode(registroServicios.id);
                    botonId.appendChild(dato);
                    Columna = document.createElement("td");
                    Columna.appendChild(botonId);
                    linea.appendChild(Columna);

                    parrafo = document.createElement("p");
                    dato = document.createTextNode(registroServicios.Descripcion);
                    Columna = document.createElement("td");
                    Columna.appendChild(dato);
                    linea.appendChild(Columna)

                    parrafo = document.createElement("p");
                    dato = document.createTextNode(registroServicios.Precio);
                    Columna = document.createElement("td");
                    Columna.appendChild(dato);
                    linea.appendChild(Columna)

                    parrafo = document.createElement("p");
                    dato = document.createTextNode(registroServicios.Duracion);
                    Columna = document.createElement("td");
                    Columna.appendChild(dato);
                    linea.appendChild(Columna)

                    parrafo = document.createElement("p");

                    //Generamos la calle a través de la API de Google Maps
                    recuperarCalle(data.rows[i].Latitud, data.rows[i].Longitud, i)

                    /*Espera 500ms para darle tiempo al array a cargar la calle creada con la latitud y la longitud
                    en la tabla, y también evitar el error de la API de google maps de acceso*/
                    await espera(500);

                    //Añadimos a la tabla la posición de la calle que corresponde
                    dato = document.createTextNode(arrayCalles[i]);
                    Columna = document.createElement("td");
                    Columna.appendChild(dato);
                    linea.appendChild(Columna)
                    document.getElementById("contacto").value = "";

                    //Añadimos un nuevo atributo al objeto de nuestro registro con la calle que nos ha generado la API
                    registroServicios.CalleMaps = arrayCalles[i]
                    botonId.registro = registroServicios;

                    //Creamos el listener con la funcion de añadir a la tabla de debajo para los cálculos
                    botonId.addEventListener("click", ventaServicio, false)

                    cuerpoa.appendChild(linea);
                    ;


                }
            }


        });

    });

}

function ventaServicio() {
    var repetido = false;
    var servicioVenta = this.registro;

    //Recorro el bucle para saber si el id coincide con otro del array(evitar duplicados)
    for (i = 0; i < arrayServicios.length; i++) {
        if (arrayServicios[i].id == servicioVenta.id) {
            //Si se repite, ponemos repetido = true indicando que está repetido el id
            repetido = true
        }
    }
    //Si no está repetido, continuamos
    if (!repetido) {
        /*Hacemos un push al array de Servicios, así tenemos los que nos interesan, 
        que son los que nos hemos llevado para los cálculos*/
        arrayServicios.push(servicioVenta)

        //Llamamos a la función de crearMarcadores pasándole el array con los servicios elegidos
        crearMarcador(arrayServicios);
        var cuerpop = document.querySelector("#cuerpoPedido");

        linea = document.createElement("tr");
        dato = document.createTextNode(servicioVenta.id);
        Columna = document.createElement("td");
        Columna.appendChild(dato);
        linea.appendChild(Columna)

        parrafo = document.createElement("p");
        dato = document.createTextNode(servicioVenta.Descripcion);
        Columna = document.createElement("td");
        Columna.appendChild(dato);
        linea.appendChild(Columna)

        parrafo = document.createElement("p");
        dato = document.createTextNode(servicioVenta.Precio);
        Columna = document.createElement("td");
        Columna.appendChild(dato);
        linea.appendChild(Columna)

        ccantidad = document.createElement("input");
        ccantidad.registro = servicioVenta;
        ccantidad.id = "c";
        Columna = document.createElement("td");
        Columna.appendChild(ccantidad);
        ccantidad.addEventListener("keyup", calculoimporte, false)
        linea.appendChild(Columna)

        pimporte = document.createElement("input");
        pimporte.value = 0;
        Columna = document.createElement("td");
        Columna.appendChild(pimporte);
        linea.appendChild(Columna)


        cuerpop.appendChild(linea);

    } else {
        alert("Registro repetido!")
    }


}

//Función que calcula el importe y el total de los servicios en función del precio y la cantidad
function calculoimporte() {
    servicioVenta = this.registro;
    var precio = servicioVenta.Precio;
    var cantidad = this.value
    var importeLinea = parseFloat(precio) * parseFloat(cantidad);

    var lineaPadre = this.parentElement.parentElement;
    console.log(lineaPadre)
    var hijosVentaPedido = lineaPadre.childNodes;

    //Accede del tr, al hijo número 4, que es el campo de importe
    var importelinea = hijosVentaPedido[4].firstChild;

    importelinea.value = importeLinea

    if (isNaN(importelinea.value)) {
        importelinea.value = '0';
    }
    if (isNaN(totalpedido)) {
        totalpedido = 0;
    }
    totalpedido += importeLinea;
    var ctotal = document.querySelector("#total");
    ctotal.value = totalpedido;
}


