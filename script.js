/*BTN DE CONSULTAR PRODUCTO*/

document.querySelectorAll(".btn-consultar").forEach(btn => {

    btn.addEventListener("click", () => {

        const producto = btn.dataset.producto;

        const mensaje =
            `Hola, quiero consultar por ${producto}`;

        const url =
            `https://wa.me/5491159372833?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");

    });

});


/* FORMULARIO DE CONSULTA POR WSP */

function consultarWhatsapp(){

    const nombre = document.getElementById("nombre").value.trim();
    const objetivo = document.getElementById("objetivo").value;

    if(nombre === ""){
        alert("Ingresá tu nombre.");
        return;
    }

    if(objetivo === "¿Cuál es tu objetivo?"){
        alert("Seleccioná un objetivo.");
        return;
    }

    const mensaje = 
`Hola, soy ${nombre}.
Me gustaría recibir asesoramiento.

Mi objetivo es:
${objetivo}`;

    const telefono = "5491159372833";

    window.open(
        `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );

}

/* NAVBAR */


const navbar = document.querySelector(".navbar-collapse");
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", () => {

        // Si es el botón del dropdown, no cerrar
        if (link.classList.contains("dropdown-toggle")) return;

        bootstrap.Collapse.getOrCreateInstance(navbar).hide();
    });
});


/*MODAL DE PRODUCTOS*/


const modal = document.getElementById("modalProducto");
const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescripcion = document.getElementById("modalDescripcion");
const cerrar = document.querySelector(".cerrar");

document.querySelectorAll(".abrir-modal").forEach(img=>{

    img.addEventListener("click",()=>{
        modal.style.display="flex";
        modalImg.src=img.dataset.img;
        modalTitulo.textContent=img.dataset.nombre;
        modalDescripcion.textContent=img.dataset.descripcion;
    });

});

cerrar.onclick=()=>{
    modal.style.display="none";
}

modal.onclick=(e)=>{

    if(e.target===modal){
        modal.style.display="none";
    }

}