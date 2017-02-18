/*canvas*/
var app = {
	inicio: function() {
		this.iniciaFastClick();
		this.iniciaBoton(); // sujeto a callback de tap usuario
	},


	iniciaFastClick: function() {
		FastClick.attach(document.body);
	},

	fotoTomada: function()(imageURI) {
	var img = document.createElement('img');
	img.onload = function() {
		app.pintarFoto(img);
	}
	img.src = imageURI;
}

tomarFoto: function() {
	var opciones = { 
	quality: 50,
	destinationType: Camera.DestinationType.FILE_URI,
	targetWidth: 300,
	targetHight: 300,
	corectoOrientation: true
 };
 navigator.camera.getPicture(app.fotoTomada, app.errorAlTomarFoto, opciones);
}

},


tomarFoto: function() {
	var opciones = {
		quality: 50,
		destinationType: Camara.DestinationType.FILE_URI,
		targetWidth: 300,
		targetHeight: 300,
		correctOrientation: true
	};
	navigator.camera.getPicture(app.fotoTomada, app.errorAlTomarFoto, opciones);
},

pintarFoto: function(img) {
	var canvas = document.querySelector('#foto');
	var context = canvas.getContext('2d');
	canvas.width = img.width;
	camvas.height = img.height;
	context.drawImage(img, 0, 0, img.width, img.height);
},




errorAlTomarFoto: function(message) {
	console.log('Fallo al tomar foto o toma cancelada: ' + message);
 }

 if('addEventListener' in document)