export function actualizarResultados({ tmb, get, caloriasFinales, macros }) {
  document.getElementById("res-tmb").textContent = Math.round(tmb);
  document.getElementById("res-get").textContent = Math.round(get);
  document.getElementById("res-final-cals").textContent =
    Math.round(caloriasFinales);

  document.getElementById("g-prot").textContent = macros.gProt;
  document.getElementById("gkg-prot").textContent = `${macros.gKgProt} g/kg`;

  document.getElementById("g-fat").textContent = macros.gFat;
  document.getElementById("gkg-fat").textContent = `${macros.gKgFat} g/kg`;

  document.getElementById("g-carb").textContent = macros.gCarb;
  document.getElementById("gkg-carb").textContent = `${macros.gKgCarb} g/kg`;
}

export function mostrarAlertaSumaMacros(esValida) {
  const alertBox = document.getElementById("suma-macros-alert");
  if (!esValida) alertBox.classList.remove("hidden");
  else alertBox.classList.add("hidden");
}

export function setLoading(isLoading) {
  const btn = document.getElementById("btn-generar");

  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "Enviando...";
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || "Generar Plan Nutricional";
  }
}
