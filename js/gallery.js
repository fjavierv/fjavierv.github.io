////////////////////////////////////////////////////////////////////////////////
// Configuracion
////////////////////////////////////////////////////////////////////////////////
var disappearTime = 1000; // Tiempo en aparecer/desaparecer la galleria
var containerID = "galleria"; // Id del div donde añadiremos la galería

////////////////////////////////////////////////////////////////////////////////
// Variable globales
////////////////////////////////////////////////////////////////////////////////
var lastPhotoSet = undefined; // Almacenamos la última galería mostrada

////////////////////////////////////////////////////////////////////////////////
// Definición de funciones
////////////////////////////////////////////////////////////////////////////////
// Por cada instancia de la galería se ejecutará esta función. Solo se
// ejecutará tras "Galleria.run"
Galleria.ready(function() {
    
    var galleria = this;

    console.log("Galleria ready!!!");

    galleria.addElement('exit');
    galleria.appendChild('container','exit');

    // Hallamos el elemento HTML
    var button = galleria.get('exit');

    // Asignamos el icono
    button.className += " fa fa-times-circle";

    // Ocultamos la galleria cuando presionamos el boton
    button.addEventListener("click", closeGalleria);

    // Evento que se dispara cada vez que se carga una foto
    galleria.bind("loadfinish", function(e) {
        console.log("Data loaded!!!");
        container.style.opacity = "1.0";
    });

});

// Función que oculta visualmente la galeria
function closeGalleria() {
    // Ocultamos el loader
    document.getElementById("loader").style.display = "none";        
    container.style.opacity = "0";
    window.setTimeout(function() { container.style.display = "none"; }, disappearTime);
}

// Los albunes los hayamos de Flick usando la clase Flickr creada por
// mi. Ya que el plugin de Galleria no tiene soporte para ello. Sin
// embargo para generar la Galleria con las fotos de un álbum si que
// tiene soporte, esto facilita mucho la labor, ya que el plugin
// formatea los datos para que Galleria lo entienda.
function loadGalleria(photoSetId) {

    // Mostramos el loader
    document.getElementById("loader").style.display = "inline";    

    // Mostramos el elemento contenedor
    container.style.display = "inline";
    
    // La primera vez que cargamos galleria
    if(!lastPhotoSet) {
        GalleriaFlickAPI.set(photoSetId, function(data) {
            console.log(data);
            Galleria.run('#' + containerID, {
                dataSource: data
            });
        });
    } else  {
        GalleriaFlickAPI.set(photoSetId, function(data) {
            console.log(data);
            Galleria.get(0).load(data);
        });
    }

    lastPhotoSet = photoSetId;

}

function loadAlbums(json) {
    var albums = document.getElementById("albums");
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    albums.appendChild(row);
    _.forEach(json.photosets.photoset, function(photoSet) {
        var col = document.createElement("div");
        col.setAttribute("class", "col-xs-12 col-sm-6 col-md-4");
        row.appendChild(col);
	var thumb = document.createElement("div");
	thumb.setAttribute("class", "thumbnail");
	col.appendChild(thumb);
	var img = document.createElement("img");
        img.setAttribute("src", "http://farm" + photoSet.farm + 
			 ".staticflickr.com/" + photoSet.server +
			 "/" + photoSet.primary +
			 "_" + photoSet.secret + "_n.jpg");
	img.setAttribute("alt", "Gallery thumbnail");
	thumb.appendChild(img);
	var capt = document.createElement("div");
	capt.setAttribute("class", "caption");
	thumb.appendChild(capt);
	var title = document.createElement("h3");
	title.innerHTML = photoSet.title._content;
	capt.appendChild(title);
	var desc = document.createElement("p");
	desc.setAttribute("class", "text-center");
	desc.innerHTML = photoSet.description._content;
	capt.appendChild(desc);
	var p = document.createElement("p");
	capt.appendChild(p);
	var btn = document.createElement("a");
        aux = btn;
	btn.setAttribute("href", "#");
	btn.setAttribute("class", "btn btn-primary");
	btn.setAttribute("role", "button");
	btn.innerHTML = "Visitar"
	btn.addEventListener("click", function() {
	    loadGalleria(photoSet.id);
	});
	p.appendChild(btn);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////
// La estructura de la Web es la siguiente. A través de "flickr.js"
// creado por mi, creamos una conjunto de miniaturas por cada
// album. Cada una de estas miniaturas, tiene un botón que abrirá
// Galleria con el album correspondiente.
//
// Cuando cargamos Galleria con datos, lo haremos de forma diferente
// se es la primera vez o sucesivas, por ello la existencia de la
// variable global "lastPhotoSet". Cuando cargamos Galleria por
// primera vez, lo haremos con:
//
//   Galleria.run('#' + containerID, {
//      dataSource: data
//   });
//
// Esto creará una instancia (una galería) dentro de Galleria
// (Gallería está preparada para trabajar con más de una galleria, no
// obstante todo está encapsulado en el objeto "Galleria" que se
// define al incluir este plugin). Necesito solo una instancia de
// gallería, ya que no tendremos más de una al mismo tiempo. En la
// sucesivas cargas de fotos, usaremos:
//
//   Galleria.get(0).load(data);

// API de flickr
var myFlickrAPI = new Flickr();

// Elemento donde añadiremos la galería
var container = document.getElementById(containerID);

// El tiempo para esta transición será "disappearTime", luego lo definimos en código
container.style.transition = "opacity " + disappearTime/1000 + "s";

// Creamos la API que da el plugin de Galleria
var GalleriaFlickAPI = new Galleria.Flickr(myFlickrAPI.api_key); 
GalleriaFlickAPI.setOptions({
    imageSize: 'big',
})

// Cargamos el tema para Galleria
Galleria.loadTheme("lib/galleria/themes/classic/galleria.classic.min.js");

// Ejecutamos la carga de albunes
myFlickrAPI.execute({ method: "flickr.photosets.getList",
                      user_id: "110747985@N04" }, loadAlbums);


