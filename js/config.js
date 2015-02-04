////////////////////////////////////////////////////////////////////////////////
// Configuracion
////////////////////////////////////////////////////////////////////////////////
var config = {

    sections: [
      { id: "photo",   desc: "Fotografía" },
      { id: "article", desc: "Artículos" },
      { id: "workshop", desc: "Cursos" }
      //{ id: "about",   desc: "Sobre mí" },
      //{ id: "contact", desc: "Contacto" }
      //{ id: "home",    desc: "Intro" },
    ],

    restAPI: "https://api.flickr.com/services/rest/",
    api_key: "f97265778564609a85d45b9444b21cd4",
    user_id: "110747985@N04",

    // Id del div donde añadiremos Galleria.io
    containerID: "galleria", 

    // Tamaño de las imagenes en la galería
    sizePhoto: "big", //(thumb, small, medium, big, original)

    // Tiempo en aparecer/desaparecer la galleria
    galleriaDisappearTime: 1000,

    // Texto boton mostrar galería
    textShowGallery: "Visitar galería",

    // Tag para poner música en los albunes de Flickr
    tagMusic: "music:",
}
