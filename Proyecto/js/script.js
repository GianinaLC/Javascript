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
        cartNumbers(bebidas[i]);
        totalCost(bebidas[i]);
        
    })
}

//la sgte funcion es para que no se borre el numero cargado de productos en el boton carrito
//verifica primero si en el localstorage hay productos guardados 

function onLoadCartNumbers(){
    productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers){
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

//para saber cuantos elementos estoy agregando a la cart
function cartNumbers(producto){
    /* console.log('producto elegido', producto); */
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if(productNumbers){
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    }else{
        localStorage.setItem('cartNumbers', 1);
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


    console.log(cartItems);
    if (cartItems && productoContainer){
        productoContainer.innerHTML = '';
        Object.values(cartItems).map(item =>{
            productoContainer.innerHTML += `
            <div class="d-flex flex-row justify-content-around text-center">
                <div class="p-2 bd-highlight">
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
        <div class="d-flex justify-content-end">
            <h4 class="px-4">Costo total</h4>
            <h4 class="px-4">$${cartCost}</h4>
        </div> `;
    }

}

/* <img src=./images/tintos/${item.name}.png"> ver tema para agregar fotos o no de los productos */
onLoadCartNumbers();
mostrarCart();

let btnEnviar = document.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log('Se envio el comentario')
});