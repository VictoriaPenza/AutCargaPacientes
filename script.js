const form = document.getElementById("formularioOjos");
const tablaBody = document.querySelector("#tablaPacientes tbody");
const editarBtn = document.getElementById("editarBtn");
const borrarBtn = document.getElementById("borrarBtn");
const reiniciarBtn = document.getElementById("reiniciarBtn");
const radioOjos = document.querySelectorAll('input[name="ojo"]');
const camposDerechoDiv = document.getElementById("campos-derecho");
const camposIzquierdoDiv = document.getElementById("campos-izquierdo");
let filaSeleccionada = null;

// Crear botón para guardar cambios
const guardarBtn = document.createElement("button");
guardarBtn.type = "button";
guardarBtn.textContent = "Guardar cambios";
guardarBtn.style.display = "none";
form.appendChild(guardarBtn);

// === Lógica para mostrar/ocultar campos ===
const toggleCampos = (ojoSeleccionado) => {
    const lioIzquierdo = document.querySelector('input[name="lio_izquierdo"]');
    const dilatacionIzquierdo = document.querySelector('input[name="dilatacion_izquierdo"]');
    const lenteIzquierdo = document.querySelector('select[name="lente_izquierdo"]');
    const marcaIzquierdo = document.querySelector('input[name="marca_izquierdo"]');
    const catarataIzquierdo = document.querySelector('select[name="catarata_izquierdo"]');

    const lioDerecho = document.querySelector('input[name="lio_derecho"]');
    const dilatacionDerecho = document.querySelector('input[name="dilatacion_derecho"]');
    const lenteDerecho = document.querySelector('select[name="lente_derecho"]');
    const marcaDerecho = document.querySelector('input[name="marca_derecho"]');
    const catarataDerecho = document.querySelector('select[name="catarata_derecho"]');

    // Función auxiliar para establecer los atributos required
    const setRequired = (elements, isRequired) => {
        elements.forEach(el => {
            if (isRequired) {
                el.setAttribute('required', 'true');
            } else {
                el.removeAttribute('required');
            }
        });
    };

    if (ojoSeleccionado === "Ambos") {
        camposIzquierdoDiv.style.display = "block";
        camposDerechoDiv.style.display = "block";
        setRequired([lioIzquierdo, dilatacionIzquierdo, lenteIzquierdo, catarataIzquierdo], true);
        setRequired([lioDerecho, dilatacionDerecho, lenteDerecho, catarataDerecho], true);
    } else if (ojoSeleccionado === "Izquierdo") {
        camposIzquierdoDiv.style.display = "block";
        camposDerechoDiv.style.display = "none";
        setRequired([lioIzquierdo, dilatacionIzquierdo, lenteIzquierdo, catarataIzquierdo], true);
        setRequired([lioDerecho, dilatacionDerecho, lenteDerecho, catarataDerecho], false);
    } else if (ojoSeleccionado === "Derecho") {
        camposIzquierdoDiv.style.display = "none";
        camposDerechoDiv.style.display = "block";
        setRequired([lioIzquierdo, dilatacionIzquierdo, lenteIzquierdo, catarataIzquierdo], false);
        setRequired([lioDerecho, dilatacionDerecho, lenteDerecho, catarataDerecho], true);
    }
};

// Se ejecuta la función de toggle al cargar la página y al cambiar la selección
window.addEventListener('load', () => toggleCampos(document.querySelector('input[name="ojo"]:checked').value));
radioOjos.forEach(radio => radio.addEventListener('change', () => toggleCampos(radio.value)));


// === Función para agregar una fila a la tabla ===
const agregarFila = (datos) => {
    const fila = document.createElement("tr");

    // Datos comunes
    const nombre = datos.get("nombre") || "-";
    const dni = datos.get("dni") || "-";
    const derivador = datos.get("derivador") || "-";
    const cirujano = datos.get("cirujano") || "-";
    const obraSocial = datos.get("obra_social") || "-";
    const codigo = datos.get("codigo") || "-";
    const afecciones = datos.get("afecciones") || "-";

    const ojoSeleccionado = datos.get("ojo");

    // Datos para Ojo Izquierdo (se rellenan según la selección)
    let lioIzquierdo = "-", dilatacionIzquierdo = "-", lenteIzquierdo = "-", marcaIzquierdo = "-", catarataIzquierdo = "-";

    // Datos para Ojo Derecho (se rellenan según la selección)
    let lioDerecho = "-", dilatacionDerecho = "-", lenteDerecho = "-", marcaDerecho = "-", catarataDerecho = "-";

    // Lógica para asignar los valores a las variables correctas
    if (ojoSeleccionado === "Izquierdo" || ojoSeleccionado === "Ambos") {
        lioIzquierdo = datos.get("lio_izquierdo") || "-";
        dilatacionIzquierdo = datos.get("dilatacion_izquierdo") || "-";
        lenteIzquierdo = datos.get("lente_izquierdo") || "-";
        marcaIzquierdo = datos.get("marca_izquierdo") || "-";
        catarataIzquierdo = datos.get("catarata_izquierdo") || "-";
    }

    if (ojoSeleccionado === "Derecho" || ojoSeleccionado === "Ambos") {
        lioDerecho = datos.get("lio_derecho") || "-";
        dilatacionDerecho = datos.get("dilatacion_derecho") || "-";
        lenteDerecho = datos.get("lente_derecho") || "-";
        marcaDerecho = datos.get("marca_derecho") || "-";
        catarataDerecho = datos.get("catarata_derecho") || "-";
    }

    const celdas = [
        nombre, dni,
        lioIzquierdo, dilatacionIzquierdo, lenteIzquierdo, marcaIzquierdo, catarataIzquierdo,
        lioDerecho, dilatacionDerecho, lenteDerecho, marcaDerecho, catarataDerecho,
        derivador, cirujano, obraSocial, codigo, afecciones
    ];

    celdas.forEach(valor => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
    });

    // === NUEVO: Agregar botones para mover filas ===
    const celdaAcciones = document.createElement("td");
    const botonSubir = document.createElement("button");
    botonSubir.textContent = "▲";
    botonSubir.classList.add("mover-arriba");
    const botonBajar = document.createElement("button");
    botonBajar.textContent = "▼";
    botonBajar.classList.add("mover-abajo");

    celdaAcciones.appendChild(botonSubir);
    celdaAcciones.appendChild(botonBajar);
    fila.appendChild(celdaAcciones);

    fila.addEventListener("click", function(e) {
        // Ignorar el clic si se hace en los botones de mover
        if (e.target.classList.contains("mover-arriba") || e.target.classList.contains("mover-abajo")) {
            return;
        }

        if (filaSeleccionada) {
            filaSeleccionada.classList.remove("seleccionada");
        }
        filaSeleccionada = fila;
        fila.classList.add("seleccionada");
    });
    
    // Asignar eventos a los nuevos botones
    botonSubir.addEventListener("click", () => moverFila(fila, -1));
    botonBajar.addEventListener("click", () => moverFila(fila, 1));

    tablaBody.appendChild(fila);
};

// === NUEVO: Función para mover una fila ===
const moverFila = (fila, direccion) => {
    const filaVecina = direccion === -1 ? fila.previousElementSibling : fila.nextElementSibling;
    if (filaVecina) {
        if (direccion === -1) { // Mover arriba
            tablaBody.insertBefore(fila, filaVecina);
        } else { // Mover abajo
            tablaBody.insertBefore(filaVecina, fila);
        }
        // No es necesario guardar los datos en local storage ya que la estructura actual no usa persistencia
        // Si se implementa en un futuro, se debería llamar aquí la función de guardado
    }
};

// === Agregar paciente ===
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const datos = new FormData(form);
    agregarFila(datos); // Se llama a la función una sola vez
    form.reset();
    document.getElementById("mensaje").textContent = "Paciente agregado correctamente ✅";
    toggleCampos("Izquierdo"); // Resetear la vista del formulario
});

// === Borrar fila seleccionada ===
borrarBtn.addEventListener("click", function() {
    if (filaSeleccionada) {
        filaSeleccionada.remove();
        filaSeleccionada = null;
    } else {
        alert("Selecciona una fila para borrar");
    }
});

// === Editar fila seleccionada ===
editarBtn.addEventListener("click", function() {
    if (filaSeleccionada) {
        const celdas = filaSeleccionada.querySelectorAll("td");
        // Omitir la última celda que contiene los botones de mover
        if (celdas.length > 17) {
            // Rellenar los campos comunes del formulario
            form.querySelector('input[name="nombre"]').value = celdas[0].textContent;
            form.querySelector('input[name="dni"]').value = celdas[1].textContent;
            form.querySelector('input[name="derivador"]').value = celdas[12].textContent;
            form.querySelector('input[name="cirujano"]').value = celdas[13].textContent;
            form.querySelector('input[name="obra_social"]').value = celdas[14].textContent;
            form.querySelector('input[name="codigo"]').value = celdas[15].textContent;
            form.querySelector(`input[name="afecciones"][value="${celdas[16].textContent}"]`)?.click();
            // Rellenar los campos específicos del ojo
            const lioIzquierdo = celdas[2].textContent;
            const lioDerecho = celdas[7].textContent;
            if (lioIzquierdo !== "-" && lioDerecho !== "-") {
                form.querySelector('input[name="ojo"][value="Ambos"]').click();
                form.querySelector('input[name="lio_izquierdo"]').value = lioIzquierdo;
                form.querySelector('input[name="dilatacion_izquierdo"]').value = celdas[3].textContent;
                form.querySelector('select[name="lente_izquierdo"]').value = celdas[4].textContent;
                form.querySelector('input[name="marca_izquierdo"]').value = celdas[5].textContent;
                form.querySelector('select[name="catarata_izquierdo"]').value = celdas[6].textContent;
                form.querySelector('input[name="lio_derecho"]').value = lioDerecho;
                form.querySelector('input[name="dilatacion_derecho"]').value = celdas[8].textContent;
                form.querySelector('select[name="lente_derecho"]').value = celdas[9].textContent;
                form.querySelector('input[name="marca_derecho"]').value = celdas[10].textContent;
                form.querySelector('select[name="catarata_derecho"]').value = celdas[11].textContent;
            } else if (lioIzquierdo !== "-") {
                form.querySelector('input[name="ojo"][value="Izquierdo"]').click();
                form.querySelector('input[name="lio_izquierdo"]').value = lioIzquierdo;
                form.querySelector('input[name="dilatacion_izquierdo"]').value = celdas[3].textContent;
                form.querySelector('select[name="lente_izquierdo"]').value = celdas[4].textContent;
                form.querySelector('input[name="marca_izquierdo"]').value = celdas[5].textContent;
                form.querySelector('select[name="catarata_izquierdo"]').value = celdas[6].textContent;
            } else if (lioDerecho !== "-") {
                form.querySelector('input[name="ojo"][value="Derecho"]').click();
                form.querySelector('input[name="lio_derecho"]').value = lioDerecho;
                form.querySelector('input[name="dilatacion_derecho"]').value = celdas[8].textContent;
                form.querySelector('select[name="lente_derecho"]').value = celdas[9].textContent;
                form.querySelector('input[name="marca_derecho"]').value = celdas[10].textContent;
                form.querySelector('select[name="catarata_derecho"]').value = celdas[11].textContent;
            }
            // Mostrar botón de guardar y ocultar el de agregar
            form.querySelector('button[type="submit"]').style.display = "none";
            guardarBtn.style.display = "inline-block";

            // Evento para guardar cambios
            guardarBtn.onclick = function() {
                const datos = new FormData(form);
                const ojoSeleccionadoForm = document.querySelector('input[name="ojo"]:checked').value;
                // Actualizar celdas con los nuevos valores del formulario
                celdas[0].textContent = datos.get("nombre") || "-";
                celdas[1].textContent = datos.get("dni") || "-";
                celdas[12].textContent = datos.get("derivador") || "-";
                celdas[13].textContent = datos.get("cirujano") || "-";
                celdas[14].textContent = datos.get("obra_social") || "-";
                celdas[15].textContent = datos.get("codigo") || "-";
                celdas[16].textContent = datos.get("afecciones") || "-";
                // Actualizar datos de los ojos
                if (ojoSeleccionadoForm === "Izquierdo" || ojoSeleccionadoForm === "Ambos") {
                    celdas[2].textContent = datos.get("lio_izquierdo") || "-";
                    celdas[3].textContent = datos.get("dilatacion_izquierdo") || "-";
                    celdas[4].textContent = datos.get("lente_izquierdo") || "-";
                    celdas[5].textContent = datos.get("marca_izquierdo") || "-";
                    celdas[6].textContent = datos.get("catarata_izquierdo") || "-";
                } else { // Si solo se seleccionó Derecho, limpiar los campos del Izquierdo
                    celdas[2].textContent = "-";
                    celdas[3].textContent = "-";
                    celdas[4].textContent = "-";
                    celdas[5].textContent = "-";
                    celdas[6].textContent = "-";
                }
                if (ojoSeleccionadoForm === "Derecho" || ojoSeleccionadoForm === "Ambos") {
                    celdas[7].textContent = datos.get("lio_derecho") || "-";
                    celdas[8].textContent = datos.get("dilatacion_derecho") || "-";
                    celdas[9].textContent = datos.get("lente_derecho") || "-";
                    celdas[10].textContent = datos.get("marca_derecho") || "-";
                    celdas[11].textContent = datos.get("catarata_derecho") || "-";
                } else { // Si solo se seleccionó Izquierdo, limpiar los campos del Derecho
                    celdas[7].textContent = "-";
                    celdas[8].textContent = "-";
                    celdas[9].textContent = "-";
                    celdas[10].textContent = "-";
                    celdas[11].textContent = "-";
                }
                filaSeleccionada.classList.remove("seleccionada");
                filaSeleccionada = null;
                form.reset();
                form.querySelector('button[type="submit"]').style.display = "inline-block";
                guardarBtn.style.display = "none";
                document.getElementById("mensaje").textContent = "Cambios guardados correctamente.";
                toggleCampos("Izquierdo"); // Resetear la vista del formulario
            };
        }
    } else {
        alert("Selecciona una fila para editar");
    }
});

// === Botón de ordenar lista ===
const ordenarBtn = document.getElementById("ordenarBtn");

// Función auxiliar para obtener el valor de prioridad
function obtenerPrioridad(fila) {
    const lenteIzquierda = fila.cells?.[4]?.textContent?.trim() || "";
    const lenteDerecha = fila.cells?.[9]?.textContent?.trim() || "";
    const dilatacionIzquierda = parseFloat(fila.cells?.[5]?.textContent?.trim() || "0");
    const dilatacionDerecha = parseFloat(fila.cells?.[10]?.textContent?.trim() || "0");
    const afeccion = fila.cells?.[12]?.textContent?.trim() || "";
    const catarata = fila.cells?.[11]?.textContent?.trim() || "";

    let prioridad = 0;

    // 1. Prioridad de Lentes (la más alta)
    const lentesPremium = ["Full Range", "Vivity", "Panoptic", "tóricas"];
    const lentesMedia = ["Clareon", "Rayone", "Hanita", "Hanita_B", "IQ"];
    const lentesEconomicas = ["AcryFold"];

    if (lentesPremium.some(l => lenteIzquierda.includes(l) || lenteDerecha.includes(l))) {
        prioridad += 10000;
    } else if (lentesMedia.some(l => lenteIzquierda.includes(l) || lenteDerecha.includes(l))) {
        prioridad += 1000;
    } else if (lentesEconomicas.some(l => lenteIzquierda.includes(l) || lenteDerecha.includes(l))) {
        prioridad += 100;
    }

    // 2. Prioridad de Dilatación (factor de desempate clave)
    // Se toma la dilatación más alta entre los dos ojos para la priorización
    const dilatacionMaxima = Math.max(dilatacionIzquierda, dilatacionDerecha) || 0;

    if (dilatacionMaxima >= 7.5 && dilatacionMaxima <= 8) {
        prioridad += 50;
    } else if (dilatacionMaxima >= 7 && dilatacionMaxima < 7.5) {
        prioridad += 30;
    } else if (dilatacionMaxima >= 6 && dilatacionMaxima < 7) {
        prioridad += 10;
    }

    // 3. Prioridad por Afección
    if (afeccion.toLowerCase() === "presente") {
        prioridad += 5;
    }

    // 4. Prioridad por Catarata
    if (catarata.toLowerCase().includes("media") || catarata.toLowerCase().includes("normal")) {
        prioridad += 3;
    } else if (catarata.toLowerCase().includes("dura")) {
        prioridad += 1;
    }

    return prioridad;
}

ordenarBtn.addEventListener("click", function() {
    const filas = Array.from(tablaBody.querySelectorAll("tr"));
    filas.sort((filaA, filaB) => obtenerPrioridad(filaB) - obtenerPrioridad(filaA));
    tablaBody.innerHTML = "";
    filas.forEach(fila => tablaBody.appendChild(fila));
});

// === Botón de reiniciar programa ===
reiniciarBtn.addEventListener("click", function() {
    if (confirm("¿Estás seguro de que quieres borrar todos los datos?")) {
        tablaBody.innerHTML = "";
        form.reset();
        if (filaSeleccionada) {
            filaSeleccionada.classList.remove("seleccionada");
            filaSeleccionada = null;
        }
        form.querySelector('button[type="submit"]').style.display = "inline-block";
        guardarBtn.style.display = "none";
        document.getElementById("mensaje").textContent = "";
        toggleCampos("Izquierdo"); // Resetear la vista a un solo ojo
    }
});



// 
// Botón para descargar el PDF
const descargarPDFBtn = document.getElementById("descargarPDFBtn");

descargarPDFBtn.addEventListener("click", () => {
    // Selecciona la tabla completa
    const tabla = document.getElementById("tablaPacientes");

    // Usa html2canvas para renderizar la tabla como un canvas
    html2canvas(tabla, { scale: 2 }).then(canvas => {
        // Inicializa jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para formato horizontal

        // Obtiene las dimensiones del canvas y la página
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 297; // Ancho de la página A4 en mm (horizontal)
        const pageHeight = 210; // Altura de la página A4 en mm (horizontal)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Añade la imagen al PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Si la tabla es muy larga, añade páginas adicionales
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Guarda el PDF con un nombre
        pdf.save('lista_pacientes.pdf');
    });
});