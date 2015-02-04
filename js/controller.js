function Controller(sections) {

    var activeSection = undefined;
    
    // Antes de cambiar la sección, ocultamos todos aquellos
    // elementos que correspondan a las diferentes secciones y
    // ponemos los botones de las secciones desactivados. Las
    // clases se forman como id + "section". Dicha clase será
    // usada por los elementos del index, para establecer a
    // que seccion pertenecen.
    function setActiveSection(id) {
        
        // Buscamos la seccion
	var section =_.find(sections, { 'id': id });

	if(section && section !== activeSection) {

            if(activeSection) {
		var className = "." + activeSection.id + "-section"
		$(className).hide(1500);
                activeSection.button.removeClass("active");
            }
            
	    activeSection = section;
                
	    activeSection.button.addClass("active");
	    var className = "." + activeSection.id + "-section"
	    $(className).show(1500);
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
var controller = new Controller(config.sections);
controller.init();
controller.setActiveSection("workshop");
