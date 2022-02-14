let bebidas = [
    {
        nombre: "Alamos",
        variedad: "Malbec",
        id: 1,
        precio: 700,
        inCart: 0,
        imgTitle:'AlamosMalbec',
        //inCart para saber cuantos hay en el carrito
    },
    
    {
        nombre:"Andeluna",
        variedad:"Blend",
        id: 2,
        precio: 950,
        inCart: 0,
        imgTitle:'AndelunaBlend'
    },
        
    {
        nombre: "Bianchi",
        variedad: "Malbec",
        id: 3,
        precio: 1100,
        inCart: 0,
        imgTitle:'BianchiMalbec'
    },
            
    {
        nombre:"Bianchi",
        variedad: "Cabernet Sauvignon",
        id: 4,
        precio: 850,
        inCart: 0,
        imgTitle:'BianchiCabS'
    },
                        
    {
        nombre:"Cafayate",
        variedad: "Cabernet Sauvignon",
        id: 5,
        precio: 600,
        inCart: 0,
        imgTitle:'CafayateCabS'
    },

    {  
        nombre:"Cafayate",
        variedad: "Malbec",
        id: 6,
        precio: 750 ,
        inCart: 0,
        imgTitle:'CafayateMalbec'
    },
    
    {
        nombre:"Casillero Del Diablo",
        variedad: "Malbec",
        id: 7,
        precio: 1200,
        inCart: 0,
        imgTitle:'CasilleroDelDiabloMalbec'
    },
    
    {
        nombre: "Casillero Del Diablo",
        variedad: "Blend",
        id: 8,
        precio: 1000,
        inCart: 0,
        imgTitle:'CasilleroDelDiabloBlend'
    }, 
];

for (const producto of bebidas) {
    //recorre el array por cada producto 
    $(".cards").append(`
                        <div class="col-sm-6 col-md-3">
                            <div class="card h-100">
                                <img src="../images/tintos/${producto.imgTitle}.png" class="img-size mx-auto mt-2 img-fluid" alt="${producto.nombre}">
                                <div class="card-body text-center">
                                    <h5 class="card-title fs-6">${producto.nombre}</h5>
                                    <p class="card-subtitle mb-2 text-muted">${producto.variedad}.</p>
                                    <p class="card-text">$${producto.precio}.</p>
                                    <button class="btn btn-dark add-cart"><span>COMPRAR</span></button>
                                </div>
                            </div>
                        </div>`
                        );
}

let carts = document.querySelectorAll('.add-cart');
//los botones comprar, mediante la clase generan el evento

for (let i = 0; i < carts.length; i++){
    carts[i].addEventListener('click', () =>{
        numerosCarts(bebidas[i]);
        totalCost(bebidas[i]);
    })
}

//style sobre el boton de las cart
$(()=>{
    $('.add-cart').mouseenter(function() {
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
})

   
//la sgte funcion es para que no se borre el numero cargado de productos en el boton carrito
//verifica primero si en el localstorage hay productos guardados 

function cartNumberMenu(){
    productoNumeros = localStorage.getItem('numerosCarts');
    if (productoNumeros){
        document.querySelector('.cart span').textContent = productoNumeros;
    }
}

//para saber cuantos elementos estoy agregando a la cart
function numerosCarts(producto){
    /* console.log('producto elegido', producto); */
    let productoNumeros = localStorage.getItem('numerosCarts');
    productoNumeros = parseInt(productoNumeros);

    if(productoNumeros){
        localStorage.setItem('numerosCarts', productoNumeros + 1);
        document.querySelector('.cart span').textContent = productoNumeros + 1;
    }else{
        localStorage.setItem('numerosCarts', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(producto);
}

function setItems(producto){
    let cartItems = localStorage.getItem('ProductosCarrito');
    cartItems = JSON.parse(cartItems);
    if(cartItems != null){
        if(cartItems[producto.id] == undefined){
            cartItems = {
                ...cartItems,
                [producto.id]:producto
            }
        }
        cartItems[producto.id].inCart += 1;
    } else{
        producto.inCart = 1;
        cartItems = {
            [producto.id]:producto
        }
    }
    
    localStorage.setItem('ProductosCarrito', JSON.stringify(cartItems));
}

function totalCost(producto){
    let cartCost = localStorage.getItem('costoTotal');

    if (cartCost !=null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('costoTotal',cartCost + producto.precio);
    } else{
        localStorage.setItem('costoTotal', producto.precio)
    }

}

function mostrarCart(){
    let cartItems = localStorage.getItem("ProductosCarrito");
    cartItems = JSON.parse(cartItems);
    let productoContainer = document.querySelector('.productos');
    let cartCost = localStorage.getItem('costoTotal');
    let cartEmpty = document.querySelector('.cartEmpty');
    let productoTitle = document.querySelector('.productoTitle');


    if (cartItems && productoContainer && productoTitle){
        productoTitle.innerHTML += 
        `   <div class="py-2 bd-highlight"><h5 class="fs-6">Productos</h5></div>
            <div class="py-2 bd-highlight"><h5 class="fs-6">Variedad</h5></div>
            <div class="py-2 bd-highlight"><h5 class="fs-6">Precio</h5></div>
            <div class="py-2 bd-highlight"><h5 class="fs-6">Cantidad</h5></div>
            <div class="py-2 bd-highlight"><h5 class="fs-6">Total</h5></div> `

        productoContainer.innerHTML = '';
        
        Object.values(cartItems).map(item =>{
            productoContainer.innerHTML += `
            <div class="d-flex flex-row justify-content-around ">
                <div class="py-2 bd-highlight">
                    <span>${item.nombre}</span>
                </div>
                <div class="py-2 bd-highlight ">${item.variedad}</div>
                <div class="py-2 bd-highlight">$${item.precio}</div>
                <div class="py-2 bd-highlight ">${item.inCart}</div>
                <div class="py-2 bd-highlight">$${item.inCart * item.precio}</div>
            </div>
             `
        });
        
        productoContainer.innerHTML += `
        <div class="d-flex justify-content-end m-3">
            <h4 class="px-4">Costo total</h4>
            <h4 class="px-4">$${cartCost}</h4>
        </div> 

        <div class="d-flex justify-content-center mb-3 ">
            <button type="button" class="btn btn-dark" id="btnRealizarCompra">Realizar compra</button>
        </div>`

        let btnRealizarCompra = document.getElementById('btnRealizarCompra');

        btnRealizarCompra.addEventListener('click', ()=>{
            productos.classList.add('oculta');
            productos.classList.add('opacity')
            productos.classList.remove('visible');
            realizarCompra.classList.add('visible');
            realizarCompra.classList.remove('oculta');
        })
        mostrarCompra();
        configFinalizarCompra();

    }else if(cartEmpty){
        cartEmpty.innerHTML +=
        `<h3 class='text-center text-white'>Tu carrito está vacío</h3>
        <img src='../images/carritoVacio.png' class='img-fluid rounded mx-auto d-block' width='300px'>`
    };

}

cartNumberMenu();
mostrarCart();

//seguir con la compra
let btnRealizarCompra = document.getElementById('btnRealizarCompra');
let realizarCompra = document.querySelector('.realizarCompra');
let productos = document.querySelector('.productos');


////// form realizar compra --oculta al principio--

function mostrarCompra(){
    let cartCost = localStorage.getItem('costoTotal');
    let subtotal = document.getElementById('subtotal');
    let btnCheckEnvio1 = document.getElementById('btnradio1');
    let btnCheckEnvio2 = document.getElementById('btnradio2');
    let totalCompra = document.getElementById('totalCompra');
    let envioD = document.getElementById('totalCompra')
    let envio = 300;
    let costoFinal /* = parseInt(cartCost) + envio; */
    let datosEnvios = document.querySelector('.datosEnvio');
    
    subtotal.innerHTML += `
        <p class="">
            $${cartCost}
        </p>`

        
        
        
        btnCheckEnvio2
            btnCheckEnvio2.addEventListener('click',()=>{
            datosEnvios.classList.add('oculta');
            totalCompra.textContent = `$${cartCost}`
        })
    
    
        btnCheckEnvio1.addEventListener('click',()=>{
            datosEnvios.classList.remove('oculta');
            if(cartCost >= 10000){
                envio=0;
                costoFinal = parseInt(cartCost) + envio;
            }else{
                costoFinal = parseInt(cartCost) + envio;
            }
            
            totalCompra.textContent =`$${costoFinal}`
        })





    /* btnCheckEnvio2.addEventListener('click',()=>{
        datosEnvios.classList.add('oculta');
        totalCompra.textContent = `$${cartCost}`
    })

    btnCheckEnvio1.addEventListener('click',()=>{
        datosEnvios.classList.remove('oculta');
        totalCompra.textContent =`$${costoFinal}`
    }) */
    
}

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
        $('#finalizarCompra').click((e)=>{
            e.preventDefault();
            guardarDireccion();
            console.log(direcciones);
            $('.carritoMenu').hide();
            $('.realizarCompra').hide();
            $('.finCompra').show();
            $('.finCompra').prepend(`<h3 class=" finCompraStyle">
                                        Gracias por su compra
                                    </h3>`)
        })
    })
};


/*asunto pendiente
//resetear carrito
*/

 

