const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function(req, res) {
    //recibir los parametros que nos envia el cliente.
    const params = url.parse(req.url, true).query;
    console.log(params);
    const archivo = params.archivo;
    const contenido = params.contenido;
    const nombre = params.nombre;
    const nuevoNombre = params.nuevoNombre;

    /* 7. Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato “dd/mm/yyyy”. 
    Considera que si el día o el mes es menor a 10 concatenar un “0” a la izquierda. */

    let dia = new Date().getDate();
    let mes = new Date().getMonth() + 1;
    let anio = new Date().getFullYear();
    //console.log(dia + mes + anio);

    //condicion para revisar si dia o mes son menores a 10, y si es asi, agregar un cero al valor.
    if (dia < 10) {
        dia = `0${dia}`
    };
    if (mes < 10) {
        mes = `0${mes}`
    };

    let fechaActual = (`${dia}/${mes}/${anio}`);
    

    //CREAR LAS RUTAS PARA INTERACTUAR CON LA PAGINA WEB.

    //CREAR UN ARCHIVO.
    if(req.url.includes("/crear")){
        fs.writeFile('archivos/' + archivo, `${fechaActual}.\n${contenido}`, 'utf8', (error) => {
            if (error) {
                res.write(`<p> Ha ocurrido un error al crear el archivo: ${archivo} </p>`)
            } else {
                res.write(`<p> El archivo se ha creado correctamente. </p>`)
            }
            res.end();
        })
    }

    //LEER INFORMACION DE UN ARCHIVO.
    if(req.url.includes("/leer")){
        fs.readFile('archivos/' + archivo, 'utf8', (error, data) => {
            if (error) {
                res.write(`<p> Ha ocurrido un error al intentar leer el archivo: ${archivo} </p>`)
            } else {
                res.write(data)
            }
            res.end();
        })
    }

    //CAMBIAR EL NOMBRE DE UN ARCHIVO QUE YA EXISTE.
    if(req.url.includes("/renombrar")){
        fs.rename('archivos/' + nombre, 'archivos/' + nuevoNombre, (error) => {
            if (error) {
                res.write(`<p> Error al renombrar el archivo: ${nombre} </p>`)
            } else {

                /* 8. En la ruta para renombrar, devuelve un mensaje de éxito incluyendo el nombre anterior del archivo y 
                su nuevo nombre de forma dinámica.*/

                res.write(`<p> El archivo <strong>${nombre}</strong> ha sido renombrado por <strong>${nuevoNombre}</strong> </p>`)
            }
            res.end();
        })
    }

    //ELIMINAR UN ARCHIVO EXISTENTE.
    if(req.url.includes("/eliminar")){
        fs.unlink('archivos/' + archivo, (error) => {
            if (error) {
                res.write(`<p> Error al eliminar el archivo: ${archivo} </p>`)
            } else {
                res.write(`<p> Tu solicitud para eliminar el archivo <strong>${archivo}</strong> se está procesando. </p>`);

                /* 9. En el mensaje de respuesta de la ruta para eliminar un archivo, devuelve el siguiente mensaje: 
                “Tu solicitud para eliminar el archivo <nombre_archivo> se está procesando”, y luego de 3 segundos 
                envía el mensaje de éxito mencionando el nombre del archivo eliminado. */

                function esperarTresSegundos (){
                    res.write(`<p> El archivo <strong>${archivo}</strong> ha sido eliminado correctamente. </p>`);

                    //NOTA: el res.end debe ir dentro de esta funcion, sino la pagina sigue cargando y no muestra el mensaje luego de 3 segundos.
                    res.end();
                }
                setTimeout(esperarTresSegundos, 3000);
            }
            //res.end();
        })
    }


}).listen(8080, () => {
    console.log('Servidor funcionando por el puerto 8080.');
})