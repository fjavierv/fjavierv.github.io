// Esta api nos permitirá hacer peticiones directamente a Flickr. Solo
// dispone de un método llamado execute. Este método recive los
// atributos de la llamada a la API en forma de objeto y un callback
// que será llamado con el json que devuelve la AIP (JSONP).
//
// myFlickrAPI.execute({ method: "flickr.photosets.getList",
//                       user_id: "110747985@N04" }, loadAlbums);
//
// Los callback serán declarados en una variable global llamada "flickrCallback".
function Flickr(api_key, restAPI)  {

    // Configuracion
    this.restAPI = restAPI || "https://api.flickr.com/services/rest/";
    this.api_key = api_key || "f97265778564609a85d45b9444b21cd4";

    // Funciones auxiliares
    function obj2rest(obj) {
        var cad = "";
        for(var attr in obj)
            cad += '&' + attr + '=' + obj[attr];
        return cad;
    };

    // Método para interactuar con la API
    this.execute = function(args, callback) {

        //Hacemos la callback global
        flickrCallback = callback;

        // Crear elemento
        var script = document.createElement("script");

        // Atributos del script
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", this.restAPI + 
			    "?jsoncallback=flickrCallback&format=json&api_key=" + 
			    this.api_key + 
			    "&" + 
			    obj2rest(args));

        // Insertar script en la cabecera
        document.getElementsByTagName("head")[0].appendChild(script);
    };

}


