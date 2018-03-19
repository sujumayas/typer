// Primero guardamos en una variable todas las letras :D
var letras = document.querySelectorAll(".letras");

// Tambien queremos tener un puntaje
var puntaje = 0;

// Luego tenemos que crear una funcion (que reciba un evento) 
// y que se encargue de ver que pasara cuando una tecla es presionada. 
function presskey(e){
	//console.log(e.keyCode);
	
	// Seleccionamos la letra que queremos usando el keyCode presionado
	var letra = document.querySelector(".letra"+e.keyCode);
	
	// Solo queremos ejecutarlo si la tecla existe como elemento html y no tiene clase hidden (es visible)
	if(letra && !letra.classList.contains("hidden")){
		
		// Esto hara que se vea verde 
		letra.classList.add("pressed");	
	}
}

// Tambien necesitamos una funcion que se encargue de esconder la tecla luego
// de que la transicion de caambio de color de ser presionada suceda. 
function endOfPressing(e){
	// Si el property que ha terminado de transisionar no es color, no haremos nada
	if(e.propertyName !== "color"){return;}	
	
	// Si lo es, le quitaremos la clase por motivos de seguridad
	this.classList.remove("pressed");
	
	// y le agregaremos la clase hidden (para que la tecla desaparezca)
	this.classList.add("hidden");

	//Y actualizaremos el puntaje
	puntaje++;
	renderizarPuntaje(puntaje);
}

// Y finalmente necesitamos una funcion que nos sirva para saber cuando la
// tecla ha vuelto a comenzar su recorrido (arriba de la pantalla), para
// volverla a mostrar :D
function endOfAnimation(e){
	this.classList.remove("hidden");
}

// Esta funcion se encargara de renderizar el puntaje en la pantalla. 
function renderizarPuntaje(puntaje){
	document.querySelector("#puntaje").innerHTML = puntaje;
}

// Creamos un Escuchador de eventos, que estara esperando que
// presionemos una tecla y llamara a la funcion presskey() para 
// que esta se encargue de hacerlo funcionara. 
document.addEventListener("keydown", presskey);

// Tambien tenemos que crear 2 Escuchadores de eventos para cada tecla: 
// el primero estara escuchando cuando se acabe la transicion del touch
// el segundo escuchara cuando la tecla vuelva arriba (acabe una iteracion mas de su animacion)  
for (var i = letras.length - 1; i >= 0; i--) {
	letras[i].addEventListener("animationiteration", endOfAnimation);
	letras[i].addEventListener("transitionend", endOfPressing);
}


