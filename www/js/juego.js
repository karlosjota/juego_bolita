/* Juego bolita - Entrega MiriadaX
 * MOOC Creando Apps Móviles con HTML5 y NodeJs
 *
 * By: @karlosjta
 */
var app = {
	
	inicio: function() {
		DIAMETRO_BOLA = 50;
		alto = document.documentElement.clientHeight;
		ancho = document.documentElement.clientWidth;
		
		dificultad = 0;
		velocidadY = 0;
		velocidadX = 0;
		puntuacion = 0;
		
		app.vigilaSensores();
		app.iniciaJuego();
	},
	
	iniciaJuego: function() {
		
		function preload() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			game.stage.backgroundColor = '#f27d0c';
			game.load.image('bola', 'assets/bola_roja.png');
			game.load.image('objetivo', 'assets/objetivo.png');
			game.load.image('objetivo2', 'assets/objetivo2.png');
		}
		
		function create() {
			scoreText = game.add.text(16, 16, puntuacion, {fontSize: '100px', fill: '#757676'})
			
			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
			objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
			bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			
			game.physics.arcade.enable(bola);
			game.physics.arcade.enable(objetivo);
			game.physics.arcade.enable(objetivo2);
			
			bola.body.collideWorldBounds = true;
			bola.body.onWorldBounds = new Phaser.Signal();
			bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
		}
		
		function update() {
			var factorDificultad = (300 + (dificultad * 100));
			
			bola.body.velocity.y = (velocidadY * factorDificultad);
			bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
			
			game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion1, null, this);
			game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion2, null, this);
			
			if(bola.body.checkWorldBounds()===false){
				game.stage.backgroundColor = app.updateBackgroundColor(dificultad);;
			}else{
				game.stage.backgroundColor = '#ff3300';
			}
		}
		
		var estados = {preload: preload, create: create, update: update};
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
	},
	
	decrementaPuntuacion: function() {
		puntuacion = puntuacion - 1;
		scoreText.text = puntuacion;
		
		if(dificultad > 0) {
			dificultad = dificultad - 1;
		}
	},
	
	incrementaPuntuacion1: function() {
		puntuacion = puntuacion + 1;
		scoreText.text = puntuacion;
		
		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();
		
		if(puntuacion > 0) {
			dificultad = dificultad + 1;
		}
	},
	//Aumento de la Puntuacion 10 
	incrementaPuntuacion2: function() {
		puntuacion = puntuacion + 10;
		scoreText.text = puntuacion;
		
		objetivo2.body.x = app.inicioX();
		objetivo2.body.y = app.inicioY();
		
		if(puntuacion > 0) {
			dificultad = dificultad + 1;
		}
	},
	//Color De fondo Mientras se Aumente o disminuye la dificultad
	updateBackgroundColor: function(valor) {
		var colorBase = 'f27d0c';
		
		if(valor <= 1) {
			return '#' + colorBase;
		}
		
		var r = parseInt(colorBase.substr(0, 2), 16);
		var g = parseInt(colorBase.substr(2, 2), 16);
		var b = parseInt(colorBase.substr(4, 2), 16);
		
		return '#' +
	       ((0|(1<<8) + r + (256 - r) * valor / 100).toString(16)).substr(1) +
	       ((0|(1<<8) + g + (256 - g) * valor / 100).toString(16)).substr(1) +
	       ((0|(1<<8) + b + (256 - b) * valor / 100).toString(16)).substr(1);
	},
	
	inicioX: function() {
		return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
	},
	
	inicioY: function() {
		return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
	},
	
	numeroAleatorioHasta: function(limite) {
		return Math.floor(Math.random() * limite);
	},
	
	vigilaSensores: function() {
		
		function onError() {
			console.log('onError!');
		}
		
		function onSuccess(datosAceleracion) {
			app.detectaAgitacion(datosAceleracion);
			app.registraDireccion(datosAceleracion);
		}
		
		navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
	},
	
	detectaAgitacion: function(datosAceleracion) {
		agitacionX = datosAceleracion.x > 10;
		agitacionY = datosAceleracion.y > 10;

		if(agitacionX || agitacionY) {
			setTimeout(app.recomienza, 1000);
		}
		
		},
	
	recomienza: function() {
		document.location.reload(true);
	},
	
	registraDireccion: function(datosAceleracion) {
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	},
	
	representaValores: function(datosAceleracion) {
		app.representa(datosAceleracion.x, '#valorx');
		app.representa(datosAceleracion.y, '#valory');
		app.representa(datosAceleracion.z, '#valorz');
	},
	
	representa: function(dato, elementoHtml) {
		redondeo = Math.round(dato * 100)/100;
		document.querySelector(elementoHtml).innerHTML = redondeo;
	},
};

if('addEventListener' in document) {
	document.addEventListener('deviceready', function(){
		app.inicio();
	}, false);
}