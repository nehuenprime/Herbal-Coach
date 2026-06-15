document.querySelectorAll(".btn-consultar").forEach(btn => {

    btn.addEventListener("click", () => {

        const producto = btn.dataset.producto;

        const mensaje =
            `Hola, quiero consultar por ${producto}`;

        const url =
            `https://wa.me/5491126891611?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");

    });

});