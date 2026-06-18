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

