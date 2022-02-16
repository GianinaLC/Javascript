//rdy jquery
$(() => {
	const URL_PRODUCTOS = '../json/productos.json';

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
const tbody = document.querySelector('.tbody')

let carrito = []

function addToCarritoItem(e){
  const button = e.target
  const item = button.closest('.card')
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

function addItemCarrito(newItem){
  const alert = document.querySelector('.alert')

  setTimeout( function(){
    alert.classList.add('hide')
  }, 2000)
    alert.classList.remove('hide')

  const inputElemento = tbody.getElementsByClassName('input-elemento')
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
  tbody.innerHTML = ''
  carrito.map(item => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const Content = `
    
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input-elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `
    tr.innerHTML = Content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input-elemento").addEventListener('change', sumaCantidad)
  })
  carritoTotal()
}

let Total;
function carritoTotal(){
  Total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    Total = Total + precio*item.cantidad
  })

  itemCartTotal.innerHTML = `Subtotal $${Total}`
  addLocalStorage()
}

function removeItemCarrito(e){
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  for(let i=0; i<carrito.length ; i++){

    if(carrito[i].title.trim() === title.trim()){
      carrito.splice(i, 1)
    }
  }

  const alert = document.querySelector('.remove')

  setTimeout( function(){
    alert.classList.add('remove')
  }, 1000)
    alert.classList.remove('remove')

  tr.remove()
  carritoTotal()
}

function sumaCantidad(e){
  const sumaInput  = e.target
  const tr = sumaInput.closest(".ItemCarrito")
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

window.onload = function(){
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if(storage){
    carrito = storage;
    renderCarrito()
  }
}

//realizarCompra
let realizarCompra = document.querySelector('.realizarCompra');
let opacidad = document.querySelector('.opacidad')
let btnComprar = document.getElementById('btnComprar');

btnComprar.addEventListener('click', (e)=>{
    e.preventDefault();
    mostrar();
})

function mostrar(){
    realizarCompra.classList.remove('oculta');
    opacidad.classList.add('opacity')
    let btnCheckEnvio1 = document.getElementById('btnradio1');
    let btnCheckEnvio2 = document.getElementById('btnradio2');
    let totalCompra = document.getElementById('totalCompra');
    let envio = 300;
    let costoFinal /* = parseInt(cartCost) + envio; */
    let datosEnvios = document.querySelector('.datosEnvio');

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
    configFinalizarCompra();
};



///////////direcion para el envio del pedido
let direcciones;


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

    direcciones = (new Direccion(direccion,numeroCasa,localidad));
    agregar();
}

const direccionesGuardadas = [];
function agregar(){
    direccionesGuardadas.push(direcciones)
}

//Forma explicita jquery
function configFinalizarCompra(){
    $(document).ready(function() {
        $('#vaciarCarro').click((e)=>{
            e.preventDefault();
            guardarDireccion();
            console.log(direcciones);
            $('.carritoMenu').hide();
            $('.realizarCompra').hide();
            $('.finCompra').show();
            $('.finCompra').prepend(`<h3 class=" finCompraStyle">
                                        Gracias por su compra
                                    </h3>`) 
			vaciarCarro()
			$('.carritoMenu').show();
        	$('.realizarCompra').show();
        	$('.finCompra').hide();
        })
    })
};

function vaciarCarro(){
    carrito = [];
	localStorage.removeItem('carrito');
	addToCarritoItem();
}

//quizas aplicar animacion para que vuelva a mostrarse el carrito en la nueva compra. el local se resetea, pero el cartel de gracias por la compra persiste..