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

const navbar = document.querySelector(".navbar-collapse");
const icono = document.querySelector(".icono-menu");

// cuando abre
navbar.addEventListener("show.bs.collapse", () => {
    icono.innerHTML = "✕";
});

// cuando cierra
navbar.addEventListener("hide.bs.collapse", () => {
    icono.innerHTML = "☰";
});

// cerrar al hacer click en links
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const bsCollapse = new bootstrap.Collapse(navbar, {
            toggle: false
        });
        bsCollapse.hide();
    });
});