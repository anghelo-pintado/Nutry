import { leerFormulario, validarFormulario } from "./formState.js";
import {
  calcularTMB,
  calcularGET,
  calcularCaloriasFinales,
  calcularMacros,
} from "./calculations.js";
import {
  actualizarResultados,
  mostrarAlertaSumaMacros,
  setLoading,
} from "./ui.js";
import { enviarAN8N } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", calcularTodo);
    input.addEventListener("change", calcularTodo);
  });

  document.getElementById("btn-generar").addEventListener("click", enviar);

  document
    .getElementById("modo-calculo-macros")
    .addEventListener("change", (e) => {
      const modo = e.target.value;
      const containerPerc = document.getElementById("container-porcentaje");
      const containerGkg = document.getElementById("container-gkg");
      const subTitle = document.getElementById("macro-subtitle");

      if (modo === "gkg") {
        containerPerc.classList.add("hidden");
        containerGkg.classList.remove("hidden");
        subTitle.textContent =
          "Selecciona los gramos por kg. Carbohidratos serán el restante.";
        document.getElementById("suma-macros-alert").classList.add("hidden");
      } else {
        containerPerc.classList.remove("hidden");
        containerGkg.classList.add("hidden");
        subTitle.textContent = "Ajusta los porcentajes. Deben sumar 100%.";
      }
      calcularTodo();
    });

  calcularTodo();
});

function calcularTodo() {
  const { base, macrosConfig, ajuste } = leerFormulario();

  const tmb = calcularTMB(base);
  const get = calcularGET(tmb, base.actividad);
  const caloriasFinales = calcularCaloriasFinales(
    get,
    ajuste.porcentajeAjuste,
    ajuste.manualCals
  );

  const macros = calcularMacros(
    caloriasFinales,
    macrosConfig,
    base.peso,
    base.lbm
  );

  if (macrosConfig.modo === "porcentaje") {
    mostrarAlertaSumaMacros(Math.abs(macros.sumaPorcentajes - 100) <= 0.1);
  } else {
    mostrarAlertaSumaMacros(true);
  }

  actualizarResultados({ tmb, get, caloriasFinales, macros });
}

async function enviar() {
  const errores = validarFormulario();

  if (errores.length > 0) {
    alert("Errores en el formulario:\n" + errores.join("\n"));
    return;
  }

  setLoading(true);

  const modoMacros = document.getElementById("modo-calculo-macros").value;
  const lbmValue = document.getElementById("lbm").value;

  const payload = {
    cliente: {
      nombre: document.getElementById("nombre").value,
      edad: document.getElementById("edad").value,
      peso: document.getElementById("peso").value,
      masa_libre_grasa: lbmValue ? lbmValue : null,
      estatura: document.getElementById("estatura").value,
      genero: document.querySelector('input[name="genero"]:checked').value,
      actividad: document.getElementById("actividad").value,
      objetivo:
        document.getElementById("ajuste-porcentaje").selectedOptions[0].text,
    },
    calculos: {
      tmb: document.getElementById("res-tmb").textContent,
      get: document.getElementById("res-get").textContent,
      calorias_objetivo: document.getElementById("res-final-cals").textContent,
      metodo_calorias: document.getElementById("calorias-manuales").value
        ? "Manual"
        : "Calculado con Ajuste",
      metodo_macros: modoMacros === "gkg" ? "Gramos por Kg" : "Porcentajes",
    },
    configuracion_macros: {
      modo: modoMacros,
      // Enviamos los factores solo si se usó modo g/kg
      factores_g_kg:
        modoMacros === "gkg"
          ? {
              proteina: document.getElementById("factor-prot").value,
              grasas: document.getElementById("factor-fat").value,
            }
          : null,
      // Enviamos porcentajes solo si se usó modo porcentaje
      porcentajes:
        modoMacros === "porcentaje"
          ? {
              proteina: document.getElementById("perc-prot").value,
              grasas: document.getElementById("perc-fat").value,
              carbos: document.getElementById("perc-carb").value,
            }
          : null,
    },
    configuracion_dieta: {
      numero_comidas: document.getElementById("num-comidas").value,
      observaciones: document.getElementById("observaciones").value,
    },
    macros_objetivo: {
      proteina_g: document.getElementById("g-prot").textContent,
      grasas_g: document.getElementById("g-fat").textContent,
      carbohidratos_g: document.getElementById("g-carb").textContent,
      proteina_real_g_kg: document.getElementById("gkg-prot").textContent,
      grasas_real_g_kg: document.getElementById("gkg-fat").textContent,
      carbos_real_g_kg: document.getElementById("gkg-carb").textContent,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await enviarAN8N(payload);

    alert(
      "Los datos del paciente han sido enviados correctamente. En minutos recibirá el plan nutricional en su correo."
    );
  } catch (error) {
    alert(
      "Ocurrió un error al enviar los datos. Por favor intenta nuevamente."
    );
    console.error(error);
  } finally {
    setLoading(false);
  }
}
