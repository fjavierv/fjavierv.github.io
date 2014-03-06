function Controller() {

    var activeSection = undefined;
    
    var sections = [ { id: "home",    desc: "Intro" },
		     { id: "photo",  desc: "Fotografía" },
		     { id: "article", desc: "Artículos" },
		     { id: "about",   desc: "Sobre mí" },
		     { id: "contact", desc: "Contacto" } ];
    
    function setActiveSection(id) {
	var section =_.find(sections, { 'id': id });
	if(section) {

	    // Antes de cambiar la sección, ocultamos todos aquellos
	    // que correspondan a la seccion activa. La clase activa
	    // se forma como id + "section". Dicha clase será usada
	    // por los elementos del index, para establecer a que
	    // seccion pertenecen.
	    if(activeSection) {
		var className = "." + activeSection.id + "-section"
		$(className).hide(1500);
	    }

	    activeSection = section;

	    // Mostramos todos los elementos HTML con la clase
	    // asociada a la nueva sección
	    var className = "." + activeSection.id + "-section"
	    $(className).show(1500);

	    // Ponemos en la cabecera la sección activa, pero primero las ponemos todas desactivas
	    _.forEach(sections, function(section) {
		section.button.removeClass("active")
	    });
	    activeSection.button.addClass("active");

	}
    }

    function getActiveSection() {
	return activeSection;
    }

    function init() {
	// Inicializamos el panel con las secciones que compondrán la página
	$(".navbar-toggle").append('<span class="sr-only">Toggle navigation</span>');
	_.forEach(sections, function(section) {
	    $(".navbar-toggle").append('<span class="icon-bar"></span>');
	    section.button = $('<li><a>' + section.desc + '</a></li>').appendTo(".navbar-nav");
	    section.button.click(function() { setActiveSection(section.id); });
	});
    }

    // Declaración de métodos público
    this.init = init;
    this.setActiveSection = setActiveSection;
}

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////
var controller = new Controller();
controller.init();
controller.setActiveSection("photo");
