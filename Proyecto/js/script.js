let carts = document.querySelectorAll('.add-cart');
//los botones comprar, mediante la clase generan el evento

let bebidas = [
    {
        nombre: "Alamos",
        variedad: "Malbec",
        id: 1,
        precio: 700,
        inCart: 0,
        //inCart para saber cuantos hay en el carrito
    },
    
    {
        nombre:"Andeluna",
        variedad:"Blend",
        id: 2,
        precio: 950,
        inCart: 0,
    },
      
    {
        nombre: "Bianchi",
        variedad: "Malbec",
        id: 3,
        precio: 1100,
        inCart: 0,
    },
            
    {
        nombre:"Bianchi",
        variedad: "Cabernet Sauvignon",
        id: 4,
        precio: 850,
        inCart: 0,
    },
                        
    {
        nombre:"Cafayate",
        variedad: "Cabernet Sauvignon",
        id: 5,
        precio: 600,
        inCart: 0,
    },

    {  
        nombre:"Cafayate",
        variedad: "Malbec",
        id: 6,
        precio: 750 ,
        inCart: 0,
    },
    
    {
        nombre:"Casillero Del Diablo",
        variedad: "Malbec",
        id: 7,
        precio: 1200,
        inCart: 0,
    },
    
    {
        nombre: "Casillero Del Diablo",
        variedad: "Blend",
        id: 8,
        precio: 1000,
        inCart: 0,
    }, 
];

for (let i = 0; i < carts.length; i++){
    carts[i].addEventListener('click', () =>{
        numerosCarts(bebidas[i]);
        totalCost(bebidas[i]);
        
    })
}

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
        if(cartItems[producto.nombre] == undefined){
            cartItems = {
                ...cartItems,
                [producto.nombre]:producto
            }
        }
        cartItems[producto.nombre].inCart += 1;
    } else{
        producto.inCart = 1;
        cartItems = {
            [producto.nombre]:producto
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


    if (cartItems && productoContainer){
        productoContainer.innerHTML = '';
        Object.values(cartItems).map(item =>{
            productoContainer.innerHTML += `
            <div class="d-flex flex-row justify-content-around text-center">
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
        <div class="d-flex justify-content-end my-3">
            <h4 class="px-4">Costo total</h4>
            <h4 class="px-4">$${cartCost}</h4>
        </div> `;

        productoContainer.innerHTML += `
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-dark" id="btnRealizarCompra">Realizar compra</button>
        </div>`
        let btnRealizarCompra = document.getElementById('btnRealizarCompra');

        btnRealizarCompra.addEventListener('click', ()=>{
            productos.classList.add('oculta');
            productos.classList.remove('visible');
            realizarCompra.classList.add('visible');
            realizarCompra.classList.remove('oculta');
        })
        mostrarCompra();
        configFinalizarCompra();
    }

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
    let envio = 300;
    let costoFinal = parseInt(cartCost) + envio;
    let datosEnvios = document.querySelector('.datosEnvio');
    
    subtotal.innerHTML += `
        <p class="">
            $${cartCost}
        </p>`

        //carro + envio
    btnCheckEnvio1.addEventListener('click',()=>{
        datosEnvios.classList.remove('oculta');
        totalCompra.innerHTML += `
        <p class="">
            $${costoFinal}
        </p>`
    })

    btnCheckEnvio2.addEventListener('click',()=>{
        datosEnvios.classList.add('oculta');

        totalCompra.innerHTML += `
        <p class="">
            $${cartCost}
        </p>`
    })
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

function configFinalizarCompra(){
    //finaliza la compra, se oculta y se agradece por la compra
    let carritoMenu = document.querySelector('.carritoMenu')
    let finalizarCompra = document.getElementById('finalizarCompra');
    let finCompra = document.querySelector('.finCompra');

    finalizarCompra.addEventListener('click', (e)=>{
        e.preventDefault();
        guardarDireccion();
        console.log(direcciones)
        carritoMenu.classList.add('oculta');
        realizarCompra.classList.remove('visible');
        realizarCompra.classList.add('oculta');
        finCompra.classList.add('visible');

        finCompra.innerHTML += `
            <h3 class=" finCompraStyle">
                Gracias por su compra
            </h3>`
    });
}
