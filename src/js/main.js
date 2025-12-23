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

  calcularTodo();
});

function calcularTodo() {
  const { base, macrosPerc, ajuste } = leerFormulario();
  const tmb = calcularTMB(base);
  const get = calcularGET(tmb, base.actividad);
  const caloriasFinales = calcularCaloriasFinales(
    get,
    ajuste.porcentajeAjuste,
    ajuste.manualCals
  );
  const macros = calcularMacros(caloriasFinales, macrosPerc, base.peso);

  mostrarAlertaSumaMacros(Math.abs(macros.sumaPorcentajes - 100) <= 0.1);
  actualizarResultados({ tmb, get, caloriasFinales, macros });
}

async function enviar() {
  const errores = validarFormulario();

  if (errores.length > 0) {
    alert("Errores en el formulario:\n" + errores.join("\n"));
    return;
  }

  setLoading(true);

  const payload = {
    cliente: {
      nombre: document.getElementById("nombre").value,
      edad: document.getElementById("edad").value,
      peso: document.getElementById("peso").value,
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
      metodo_usado: document.getElementById("calorias-manuales").value
        ? "Manual"
        : "Calculado con Ajuste",
    },
    configuracion_dieta: {
      numero_comidas: document.getElementById("num-comidas").value,
      observaciones: document.getElementById("observaciones").value,
    },
    macros_objetivo: {
      proteina_g: document.getElementById("g-prot").textContent,
      grasas_g: document.getElementById("g-fat").textContent,
      carbohidratos_g: document.getElementById("g-carb").textContent,
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
