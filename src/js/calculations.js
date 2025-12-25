export function calcularTMB({ peso, estatura, edad, genero, formula }) {
  let tmb = 0;
  if (formula === "mifflin") {
    tmb =
      10 * peso + 6.25 * estatura - 5 * edad + (genero === "hombre" ? 5 : -161);
  } else if (formula === "harris") {
    tmb =
      genero === "hombre"
        ? 88.36 + 13.4 * peso + 4.8 * estatura - 5.7 * edad
        : 447.6 + 9.2 * peso + 3.1 * estatura - 4.3 * edad;
  } else if (formula === "fao") {
    if (genero === "hombre") {
      if (edad < 30) tmb = 15.3 * peso + 679;
      else if (edad < 60) tmb = 11.6 * peso + 879;
      else tmb = 13.5 * peso + 487;
    } else {
      if (edad < 30) tmb = 14.7 * peso + 496;
      else if (edad < 60) tmb = 8.7 * peso + 829;
      else tmb = 10.5 * peso + 596;
    }
  } else if (formula === "valencia") {
    if (genero === "hombre") {
      if (edad < 30) tmb = 13.37 * peso + 747;
      else if (edad < 60) tmb = 13.08 * peso + 693;
      else tmb = 14.21 * peso + 429;
    } else {
      if (edad < 30) tmb = 11.02 * peso + 679;
      else if (edad < 60) tmb = 10.92 * peso + 677;
      else tmb = 10.98 * peso + 520;
    }
  }
  return tmb;
}

export const calcularGET = (tmb, actividad) => tmb * actividad;

export function calcularCaloriasFinales(get, porcentajeAjuste, manualCals) {
  if (manualCals > 0) return manualCals;
  return get * (1 + (porcentajeAjuste || 0) / 100);
}

export function calcularMacros(
  caloriasFinales,
  { modo, pProt, pFat, pCarb, factorProt, factorFat },
  peso,
  lbm
) {
  let gProt, gFat, gCarb;
  let sumaPorcentajes = 100;

  const pesoReferencia = lbm && lbm > 0 ? lbm : peso;

  if (modo === "gkg") {
    // 1. Calcular gramos de Proteína y Grasa basados en el factor seleccionado
    gProt = pesoReferencia * factorProt;
    gFat = pesoReferencia * factorFat;

    // 2. Calcular calorías consumidas por Proteína y Grasa
    const calsProt = gProt * 4;
    const calsFat = gFat * 9;

    // 3. Asignar el RESTANTE a Carbohidratos
    const calsRestantes = caloriasFinales - (calsProt + calsFat);

    gCarb = Math.max(0, calsRestantes / 4);
  } else {
    gProt = (caloriasFinales * (pProt / 100)) / 4;
    gFat = (caloriasFinales * (pFat / 100)) / 9;
    gCarb = (caloriasFinales * (pCarb / 100)) / 4;
    sumaPorcentajes = pProt + pFat + pCarb;
  }

  return {
    gProt: Math.round(gProt),
    gFat: Math.round(gFat),
    gCarb: Math.round(gCarb),
    gKgProt: peso > 0 ? (gProt / peso).toFixed(2) : "0",
    gKgFat: peso > 0 ? (gFat / peso).toFixed(2) : "0",
    gKgCarb: peso > 0 ? (gCarb / peso).toFixed(2) : "0",
    sumaPorcentajes: sumaPorcentajes,
    modoUsado: modo,
  };
}
