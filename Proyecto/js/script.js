//rdy jquery
$(() => {
	const URL_PRODUCTOS = './productos.json';

//utilizo fetch pq no tiene problemas con el promise, y de esa manera me carga primero los productos para luego poder seleccionarlos segun el click en el boton. Con el otro método al no terminar de cargar los productos seguía ejecutando el resto del codigo y me daba error pq los botones estaban vacios.
	fetch(URL_PRODUCTOS)
	.then(response => response.json())
	.then(data => data.forEach(dato => {
		$(".cards").append(`
							<div class="col d-flex justify-content-center mb-4">
								<div class="card shadow mb-1 bg-dark rounded text-center" style="width: 20rem;">
									<h5 class="card-title pt-2 text-uppercase text-white">${dato.nombre}</h5>
									<img src="../images/tintos/${dato.imgTitle}.png" class="card-img-top" alt="${dato.nombre}">
									<div class="card-body">
										<p class="card-text text-white-50 variedad">${dato.variedad}</p>
										<h5 class="text-white">Precio: <span class="precio">$ ${dato.precio}</span></h5>
										<div class="d-grid gap-2">
											<button  class="btn btn-secondary button">COMPRAR</button>
										</div>
									</div>
								</div>
							</div>`
		);

		//animacion al boton comprar
		$(`.button`).mouseenter(function() {
			$(this).text('Agregar al carrito')
					.css({  'background-color':'#e8e105', 
							'color':'#000000', 
							'font-weight':'bold'})
					.animate({ width: '100%'}, 300)
					
		}).click(function(){
			$(this).text('Agregado')
		})
		.mouseleave(function() {
			$(this).text('COMPRAR').removeAttr('style');
		});

		const clickbutton = document.querySelectorAll('.button')
		clickbutton.forEach(btn => {
			btn.addEventListener('click', addToCarritoItem)
		})
	}));
})

const tbody = document.querySelector('.tbody');
let carrito = [];

function addToCarritoItem(e){
	const button = e.target
	const item = button.closest('.card');
	const itemTitle = item.querySelector('.card-title').textContent;
	const itemPrice = item.querySelector('.precio').textContent;
	const itemVariedad = item.querySelector('.variedad').textContent;
	const itemImg = item.querySelector('.card-img-top').src;
	const newItem = {
		title: itemTitle,
		precio: itemPrice,
		img: itemImg,
		variedad: itemVariedad,
		cantidad: 1
	}
	addItemCarrito(newItem)
}

//trim() devuelve la cadena de texto despojada de los espacios en blanco en ambos extremos
function addItemCarrito(newItem){
	const inputElemento = tbody.getElementsByClassName('input-elemento');
	for(let i =0; i < carrito.length ; i++){
		if(carrito[i].title.trim() === newItem.title.trim()){
		carrito[i].cantidad ++;
		const inputValue = inputElemento[i]
		inputValue.value++;
		carritoTotal()
		return null;
		}
	}
	
	carrito.push(newItem)
	renderCarrito()
} 

function renderCarrito(){
  	tbody.innerHTML = '';
  	carrito.map(item => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const content = `
						<th scope="row"></th>
								<td class="tabla-productos">
								<img src=${item.img}  alt="${item.title}">
								<h6 class="title">${item.title}</h6>
								</td>
								<td class="tabla-precio"><p>${item.precio}</p></td>
								<td class="tabla-cantidad">
								<input type="number" min="1" value=${item.cantidad} class="input-elemento">
								<button class="delete btn btn-danger">x</button>
								</td>
						
					`
    tr.innerHTML = content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input-elemento").addEventListener('change', sumaCantidad)
  })

  carritoTotal()
}

let Total;
const itemCartTotal = document.querySelector('.itemCartTotal');

function carritoTotal(){
	Total = 0;
  	carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''));
    Total = Total + precio * item.cantidad
  })

  itemCartTotal.innerHTML = `Subtotal $${Total}`;
  addLocalStorage()
}

//splice() cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
function removeItemCarrito(e){
  	const buttonDelete = e.target
  	const tr = buttonDelete.closest(".ItemCarrito");
  	const title = tr.querySelector('.title').textContent;
  	for(let i=0; i<carrito.length ; i++){

    if(carrito[i].title.trim() === title.trim()){
      carrito.splice(i, 1)
    }
  }

  tr.remove()
  carritoTotal()
}

//closest devuelve el ascendiente más cercano al elemento actual (o el propio elemento actual) que coincida con el selector proporcionado por parámetro.
function sumaCantidad(e){
	const sumaInput  = e.target
	const tr = sumaInput.closest(".ItemCarrito");
	const title = tr.querySelector('.title').textContent;
	carrito.forEach(item => {
    if(item.title.trim() === title){
      sumaInput.value < 1 ?  (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      carritoTotal()
    }
  })
}

function addLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

//cerrar ventana compra
let closePago = document.querySelector('.close');

closePago.addEventListener('click', ()=>{
	realizarCompra.classList.add('oculta');
	opacidad.classList.remove('opacity');
	document.getElementById("btnradio1").checked = false;
	document.getElementById("btnradio2").checked = false;
	//en caso de querer modificar la comprar, al cerrar la ventana de pago, se reinicia el check de los botones
	//de esa manera, funciona el agregado del envio al hacer click en si.
	//sin esto, antes si hacia todo esos pasos, al volver a comprar me quedaba seleccionado el SI y no me sumaba el envio
})


//direcion para el envio del pedido
let direccionIngresada;
let direcciones = [];

function guardarDireccion() {
    class Direccion {
        constructor(nombreCalle,numCasa,localidad){
            this.calle = nombreCalle;
            this.casa = numCasa;
            this.localidad = localidad;
        }
    }

    let direccion = document.getElementById('direccion').value;
    let numeroCasa = document.getElementById('numeroCasa').value;
    let localidad = document.getElementById('localidad').value;

    direccionIngresada = (new Direccion(direccion,numeroCasa,localidad));
	direcciones.push(direccionIngresada);
}

let cliente;
function usuario(){
	cliente= {
		nombre: document.getElementById('nombre').value,
		apellido: document.getElementById('apellido').value
	}
}

//realizarCompra
let realizarCompra = document.querySelector('.realizarCompra');
let opacidad = document.querySelector('.opacidad');
let btnComprar = document.getElementById('btnComprar');

btnComprar.addEventListener('click', (e)=>{
    e.preventDefault();
    mostrar();
})


let btnCheckEnvio1 = document.getElementById('btnradio1');
let btnCheckEnvio2 = document.getElementById('btnradio2');

function mostrar(){
    realizarCompra.classList.remove('oculta');
    opacidad.classList.add('opacity');
    let totalCompra = document.getElementById('totalCompra');
    let envio = 300;
    let costoFinal;
    let datosEnvios = document.querySelector('.datosEnvio');
	totalCompra.textContent = `$${Total}`

//btnradio2=no
    btnCheckEnvio2.addEventListener('click',()=>{
        datosEnvios.classList.add('oculta');
		totalCompra.textContent = `$${Total}`
})

//btnradio1=si
    btnCheckEnvio1.addEventListener('click',()=>{
    datosEnvios.classList.remove('oculta');
	if(Total >= 10000){
		envio=0;
		costoFinal = Total + envio;
	}else{
		costoFinal = Total + envio;
	}
	totalCompra.textContent =`$${costoFinal}`
    })
};


function validarInput() {
    if (document.getElementById('direccion').value == null || document.getElementById('direccion').value == ''){
        document.getElementById('direccion').focus();
        return false;
    }else if (document.getElementById('numeroCasa').value == null || document.getElementById('numeroCasa').value == ''){
        document.getElementById('numeroCasa').focus();
		return false;

	}else if(document.getElementById('localidad').value == null || document.getElementById('localidad').value == ''){
        document.getElementById('localidad').focus();
		return false;
	}else if(validarUsuario()){
		finalizarCompra();
	}
}

//pedir nombre ya sea para el envio o retirar en el lugar
function validarUsuario(){
	if (document.getElementById('nombre').value == null || document.getElementById('nombre').value == ''){
        document.getElementById('nombre').focus();
		return false;
	}else if (document.getElementById('apellido').value == null || document.getElementById('apellido').value == ''){
		document.getElementById('apellido').focus();
		return false;
	}else{
		finalizarCompra();
	}	
}


//Forma explicita jquery -finalizarcompra
$(document).ready(function() {
	$('#vaciarCarro').click((e)=>{
		e.preventDefault();
		if(btnCheckEnvio1.checked){
			validarInput();
			guardarDireccion();
			
		}else if(btnCheckEnvio2.checked){
			validarUsuario();
		}
	})
})
	
function finalizarCompra(){
	usuario();
	vaciarCarro();
	divDespedida();
}

//gracias por la compra
function divDespedida(){
	const alert = document.querySelector('.alert');

	setTimeout( function(){
		alert.classList.add('hide')
	}, 2000)
		alert.classList.remove('hide')

	realizarCompra.classList.add('oculta');
    opacidad.classList.remove('opacity');
}

function vaciarCarro(){
	tbody.innerHTML = '';
	itemCartTotal.innerHTML = 'Subtotal: 0';
	localStorage.removeItem('carrito');
	carrito = [];
	carritoTotal();
	document.getElementById("btnradio1").checked = false;//mismo motivo al del exit en la compra. Para resetear el checked
	document.getElementById("btnradio2").checked = false;//y asi sumar o no el envio
}

window.onload = function(){
	const storage = JSON.parse(localStorage.getItem('carrito'));
	if(storage){
	  	carrito = storage;
	  	renderCarrito();
	}
}
