var myDBInstance = openDatabase('dbMunicipio', '1.0', 'Venta de servicios municipales por pedido', 7 * 1024 * 1024);
/*Nombre de la base de datos  ,Número de versión,Descripción,Tamaño*/
//check whether the database is created or not.
if (!myDBInstance) {
    alert('La base de Datos no se ha creado');
}
else {
    var version = myDBInstance.version;

    myDBInstance.transaction(function (tran) {
        
        //   tran.executeSql('CREATE TABLE IF NOT EXISTS articulos (id unique, Nombre, Familia, Stock, Precio,Imagen)');
       tran.executeSql('create table if not exists servicios (id  varchar(6), \n\
        Descripcion varchar(60),Tipo int, Direccion varchar(15),Latitud varchar(15),Longitud varchar(15),Precio float,Duracion int,   PRIMARY KEY(Id) );'
            , [], nullDataHandler, errorHandler);



        grabarRegistros();
    }
    );
    myDBInstance.transaction(function (tran) {
      
        tran.executeSql('SELECT * FROM servicios', [], function (tran, data) {
            for (i = 0; i < data.rows.length; i++) {
               
            console.log(data.rows[i].Nombre);

            };

        });
    });}
    function grabarRegistros() {

        myDBInstance.transaction(
            function (tran) {
                //Starter data when page is initialized
                // var data = [cId, cVideo, cDescripcion, cConceptoB1, cConceptoB2, cConceptoB3, cInicioCorte, cFinCorte];
              
                tran.executeSql('INSERT INTO  servicios (id , Descripcion, Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (1, "Aguas","Calle Aguas",1,"41.67087166806011","-3.6769533013330147",45,2)');

                tran.executeSql('INSERT INTO  servicios (id , Descripcion,  Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (2, "Recogida mobiliario","Calle Mobiliario",2,"41.67052086444117","-3.679426747753496",45,2)');
    
                tran.executeSql('INSERT INTO  servicios (id , Descripcion,  Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (3, "Recogida Obras","Calle Obras",2,"41.67124906228226","-3.679426747753496",45,2)');
    
                tran.executeSql('INSERT INTO  servicios (id , Descripcion,  Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (4, "Ayuda domicilio","Calle domicilio",3,"41.671313539774864","-3.6784396948360154",45,2)');
    
    
                tran.executeSql('INSERT INTO  servicios (id , Descripcion,  Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (5, "Alimentos","Calle Alimentos",2,"41.671432670094696","-3.6775965439301217",45,2)')
                tran.executeSql('INSERT INTO  servicios (id , Descripcion, Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (6, "Servicio Ancianos","Calle Ancianos",2,"41.67156889859186","-3.6776823746185983",45,2)')
                tran.executeSql('INSERT INTO  servicios (id , Descripcion,  Direccion ,Tipo,Latitud ,Longitud ,Precio,Duracion ) values (7, "Guardia Urbana","Calle Urbana",2,"41.67077768357397","-3.6779139818690965",45,2)')
    
    
    
            }
        );
    
    
    }
    function errorHandler(transaction, error) {

        if (error.code == 1) {
            // DB Table already exists
        } else {
            alert("Error " + error.code + error.message);
            // Error is a human-readable string.
            //   console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
        }
        return false;
    }
    
    
    function nullDataHandler() {
    
        console.log("SQL Query Succeeded");
    
    }
    