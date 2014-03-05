// https://api.flickr.com/services/rest/?
// format=json&osets.getList&api_key=f97265778564609a85d45b9444b21cd4&user_id=110747985@N04osets.getList&api_key=f97265778564609a85d45b9444b21cd4&user_id=110747985@N04
// jsoncallback=wooYay&
// method=flickr.photosets.getList&
// api_key=f97265778564609a85d45b9444b21cd4&
// user_id=110747985@N04

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

    this.execute = function(args, callback) {
        //Hacemos la callback global
        flickrCallback = callback;

        // Crear elemento
        var script = document.createElement("script");

        // Atributos del script
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", this.restAPI + "?jsoncallback=flickrCallback&format=json&api_key=" + this.api_key + "&" + obj2rest(args));

        // Insertar script en la cabecera
        document.getElementsByTagName("head")[0].appendChild(script);
    };

}


