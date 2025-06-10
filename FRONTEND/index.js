producto = [
    {
    'nombre':"JetSky",
    'descripcion':"Alquila un JetSky y siente la adrenalina mientras navegas por las olas, con capacidad para dos personas.",
    'precio':100,
    'imagen': "jetski.png",
    'id': 1
    },
    {
    'nombre':"Cuatriciclo",
    'descripcion':"Explora la costa en un cuatriciclo, ideal para aventuras en grupo.",
    'precio':100,
    'imagen': "cuatriciclo.jpg",
    'id':2
    },
    {
    'nombre':"Equipo de Buceo",
    'descripcion':"Sumérgete en la belleza del océano con nuestro equipo de buceo de alta calidad.",
    'precio':50,
    'imagen': "buceo.jpg",
    'id':3
    },
    {
    'nombre':"Tablas Surf (Niño)",
    'descripcion':"Disfruta de las olas en las dos versiones de tabla que ofrecemos para Niños.",
    'precio':15,
    'imagen': "tablasurfnino.jpg",
    'id':4
    },
    {
    'nombre':"Tablas Surf (Adulto)",
    'descripcion':"Disfruta de las olas en las dos versiones de tabla que ofrecemos para Adultos.",
    'precio':25,
    'imagen': "tablasurfadulto.jpg",
    'id':5
    }


]


function mostrarMensaje(){
    alert("Pagina Principal")
    console.log("Estas en la pagina Principal")
}

// Obtener productos desde el backend
function getProductos() {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            cargarProductos(data);
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
        });
}

// Cargar productos en la página
function cargarProductos(array) {
    const contenedor = document.getElementById("producto");
    contenedor.innerHTML = ""; // Limpiar el contenido anterior

    array.forEach(producto => {
        const contentElement = document.createElement("div");
        contentElement.classList.add("productos");

        const img = document.createElement("img");
        img.src = `images/${producto.image || "default.jpg"}`;
        img.style.width = "150px";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.name;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.description;

        const precio = document.createElement("h2");
        precio.classList.add("precio");
        precio.textContent = `Precio: $${producto.price}`;

        const boton = document.createElement("button");
        boton.classList.add("ordenar");
        boton.textContent = "ORDENAR";
        boton.addEventListener("click", () => ordenarProducto(producto));

        contentElement.appendChild(img);
        contentElement.appendChild(nombre);
        contentElement.appendChild(descripcion);
        contentElement.appendChild(precio);
        contentElement.appendChild(boton);

        contenedor.appendChild(contentElement);
    });
}

// Guardar producto en localStorage
function ordenarProducto(producto) {
    console.log("Producto ordenado:", producto);

    const combosStorage = localStorage.getItem("combos");
    const combos = combosStorage ? JSON.parse(combosStorage) : [];

    combos.push(producto);
    localStorage.setItem("combos", JSON.stringify(combos));

    alert(`Agregaste ${producto.name} al carrito.`);
}

// Mostrar carrito (por consola)
function mostrarCarrito() {
    const combos = JSON.parse(localStorage.getItem("combos")) || [];
    console.log("Contenido del carrito:", combos);
}

window.onload = function() {
    getProductos();
};


    