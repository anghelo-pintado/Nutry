export function leerFormulario() {
  const peso = parseFloat(document.getElementById("peso").value) || 0;
  const estatura = parseFloat(document.getElementById("estatura").value) || 0;
  const edad = parseFloat(document.getElementById("edad").value) || 0;
  const genero = document.querySelector('input[name="genero"]:checked').value;
  const formula = document.getElementById("formula").value;
  const actividad =
    parseFloat(document.getElementById("actividad").value) || 1.2;

  const pProt = parseFloat(document.getElementById("perc-prot").value) || 0;
  const pFat = parseFloat(document.getElementById("perc-fat").value) || 0;
  const pCarb = parseFloat(document.getElementById("perc-carb").value) || 0;

  const manualCals = parseFloat(
    document.getElementById("calorias-manuales").value
  );
  const porcentajeAjuste =
    parseFloat(document.getElementById("ajuste-porcentaje").value) || 0;

  return {
    base: { peso, estatura, edad, genero, formula, actividad },
    macrosPerc: { pProt, pFat, pCarb },
    ajuste: { manualCals, porcentajeAjuste },
  };
}

export function validarFormulario() {
  const errores = [];

  const nombre = document.getElementById("nombre").value.trim();
  const peso = parseFloat(document.getElementById("peso").value);
  const estatura = parseFloat(document.getElementById("estatura").value);
  const edad = parseFloat(document.getElementById("edad").value);

  const genero = document.querySelector('input[name="genero"]:checked');

  if (!nombre) errores.push("El nombre es obligatorio");
  if (!peso || peso <= 0) errores.push("Peso inválido");
  if (!estatura || estatura <= 0) errores.push("Estatura inválida");
  if (!edad || edad <= 0) errores.push("Edad inválida");
  if (!genero) errores.push("Selecciona un género");

  return errores;
}
