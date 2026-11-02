/* ============ 1. DATOS DEL CUESTIONARIO ============ */
const QUESTIONS = [
  {
    text: "¿Cómo surge la creatividad en el cerebro?",
    options: [
      "Depende de una única zona del cerebro dedicada a crear",
      "De la interacción entre diferentes sistemas cerebrales",
      "Solo aparece en personas con talento artístico",
      "Se produce únicamente durante el sueño"
    ],
    correct: 1,
    explain: "El autor señala que no existe una sola parte del cerebro responsable de la creatividad: surge de la interacción entre varios sistemas."
  },
  {
    text: "¿Qué significa crear algo nuevo según el libro?",
    options: [
      "Inventarlo siempre desde cero, sin usar nada conocido",
      "Copiar exactamente una idea que ya existe",
      "Combinar elementos que ya conocemos para obtener resultados diferentes",
      "Esperar a tener una inspiración repentina"
    ],
    correct: 2,
    explain: "Crear no implica partir de la nada: la innovación suele combinar conocimientos y elementos existentes de una forma distinta."
  },
  {
    text: "¿Qué influencia tienen la cultura y la sociedad en la creatividad?",
    options: [
      "Ninguna, las ideas dependen solo de cada persona",
      "Solo afectan a los artistas profesionales",
      "Hacen que todas las ideas innovadoras sean aceptadas de inmediato",
      "Influyen en cómo pensamos y en cómo se valora una idea"
    ],
    correct: 3,
    explain: "La cultura moldea nuestra manera de pensar y la aceptación de una idea depende de cómo la sociedad la valore; algunas se adelantan tanto a su época que no son reconocidas."
  },
  {
    text: "¿Por qué es importante adaptarse a los cambios tecnológicos?",
    options: [
      "Porque el mundo cambia rápido y debemos aprender constantemente",
      "Porque la tecnología reemplaza toda forma de pensar",
      "Porque solo los inventores necesitan hacerlo",
      "No es importante si ya tenemos conocimientos suficientes"
    ],
    correct: 0,
    explain: "Los avances tecnológicos nos obligan a aprender y adaptarnos, y la creatividad ayuda a resolver problemas cotidianos, no solo a inventores, científicos o artistas."
  },
  {
    text: "¿Qué plantea el libro sobre la creatividad y la inteligencia artificial?",
    options: [
      "Que la inteligencia artificial hace innecesaria la creatividad humana",
      "Invita a reflexionar sobre el futuro de la relación entre humanos, tecnología e inteligencia artificial",
      "Que la creatividad es un don exclusivo de unas pocas personas",
      "Que la tecnología no tiene ninguna relación con las ideas nuevas"
    ],
    correct: 1,
    explain: "El libro invita a reflexionar sobre el futuro de la creatividad y la relación entre seres humanos, tecnología e inteligencia artificial."
  }
];

/* ============ 2. UTILIDADES ============ */
const $ = (selector) => document.querySelector(selector);
let quizChecked = false;

// Muestra u oculta un mensaje de alerta
function showAlert(el, message, isInfo = false) {
  el.textContent = message;
  el.classList.toggle("info", isInfo);
  el.hidden = false;
}

// Convierte el texto en una lista de ideas (una por línea o separadas por punto y coma)
function parseIdeas(text) {
  return text.split(/\n|;/).map((s) => s.trim()).filter(Boolean);
}

/* ============ 3. CUESTIONARIO ============ */
function renderQuiz() {
  const quiz = $("#quiz");
  quiz.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const card = document.createElement("fieldset");
    card.className = "card question";
    card.dataset.index = i;
    const legend = document.createElement("h3");
    legend.textContent = (i + 1) + ". " + q.text;
    card.appendChild(legend);
    q.options.forEach((opt, j) => {
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = '<input type="radio" name="q' + i + '" value="' + j + '"><span class="option-mark"></span><span class="option-text"></span>';
      label.querySelector(".option-text").textContent = opt;
      card.appendChild(label);
    });
    quiz.appendChild(card);
  });
}

// Marca la opción seleccionada y actualiza la barra de progreso
function handleSelection(event) {
  if (quizChecked || event.target.type !== "radio") return;
  const card = event.target.closest(".question");
  card.classList.remove("missing");
  card.querySelectorAll(".option").forEach((o) => o.classList.remove("selected"));
  event.target.closest(".option").classList.add("selected");
  updateProgress();
}

function countAnswered() {
  return QUESTIONS.filter((_, i) => document.querySelector('input[name="q' + i + '"]:checked')).length;
}

function updateProgress() {
  const answered = countAnswered();
  const pct = Math.round((answered / QUESTIONS.length) * 100);
  $("#progress-text").textContent = answered + " de " + QUESTIONS.length + " preguntas contestadas";
  $("#progress-pct").textContent = pct + "%";
  $("#progress-fill").style.width = pct + "%";
  if (answered === QUESTIONS.length) $("#quiz-alert").hidden = true;
}

// Mensaje según la calificación obtenida
function feedbackFor(score) {
  if (score === 5) return "Excelente. Comprendiste las ideas centrales del libro y las puedes explicar con claridad.";
  if (score === 4) return "Muy bien. Dominas casi todo el contenido; repasa la pregunta que fallaste.";
  if (score === 3) return "Buen intento. Vuelve a leer el resumen para reforzar los conceptos que se te escaparon.";
  return "Todavía hay conceptos por reforzar. Lee de nuevo el resumen y vuelve a intentarlo, equivocarse también es parte de aprender.";
}

function checkQuiz() {
  const missing = QUESTIONS.map((_, i) => i).filter((i) => !document.querySelector('input[name="q' + i + '"]:checked'));
  if (missing.length > 0) {
    missing.forEach((i) => document.querySelector('.question[data-index="' + i + '"]').classList.add("missing"));
    showAlert($("#quiz-alert"), "Faltan " + missing.length + " pregunta(s) por contestar. Responde todas para comprobar tus respuestas.");
    document.querySelector('.question[data-index="' + missing[0] + '"]').scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  quizChecked = true;
  let correct = 0;
  QUESTIONS.forEach((q, i) => {
    const card = document.querySelector('.question[data-index="' + i + '"]');
    const chosen = Number(document.querySelector('input[name="q' + i + '"]:checked').value);
    const options = card.querySelectorAll(".option");
    options.forEach((o) => (o.querySelector("input").disabled = true));
    options[q.correct].classList.add("correct");
    const isRight = chosen === q.correct;
    if (isRight) correct++; else options[chosen].classList.add("incorrect");
    const note = document.createElement("div");
    note.className = "explanation";
    note.innerHTML = '<strong class="' + (isRight ? "ok" : "bad") + '">' + (isRight ? "Respuesta correcta." : "Respuesta incorrecta.") + "</strong> ";
    note.appendChild(document.createTextNode(q.explain));
    card.appendChild(note);
  });
  $("#quiz").classList.add("quiz-done");
  showResult(correct);
  $("#check-quiz").hidden = true;
  $("#retry-quiz").hidden = false;
  $("#quiz-alert").hidden = true;
}

function showResult(correct) {
  const total = QUESTIONS.length;
  const percent = Math.round((correct / total) * 100);
  const card = $("#quiz-result");
  card.style.setProperty("--pct", percent);
  card.innerHTML =
    '<div class="score-ring" style="--pct:' + percent + '"><span>' + correct + "/" + total + "</span></div>" +
    '<div><h3>Resultado del cuestionario</h3>' +
    '<div class="result-stats"><span>Correctas: <b class="ok">' + correct + "</b></span>" +
    '<span>Incorrectas: <b class="bad">' + (total - correct) + "</b></span>" +
    "<span>Calificación: <b>" + correct + " sobre 5</b></span>" +
    "<span>Equivalente: <b>" + percent + " sobre 100</b></span></div>" +
    "<p></p></div>";
  card.querySelector("p").textContent = feedbackFor(correct);
  card.hidden = false;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetQuiz() {
  quizChecked = false;
  renderQuiz();
  updateProgress();
  $("#quiz").classList.remove("quiz-done");
  $("#quiz-result").hidden = true;
  $("#quiz-alert").hidden = true;
  $("#check-quiz").hidden = false;
  $("#retry-quiz").hidden = true;
}

/* ============ 4. ACTIVIDAD 2: IDEAS ============ */
function shareIdeas() {
  const alertBox = $("#ideas-alert");
  const output = $("#ideas-output");
  const ideas = parseIdeas($("#ideas-input").value);
  if (ideas.length === 0) {
    output.hidden = true;
    showAlert(alertBox, "Escribe al menos una idea antes de compartirla. No hay respuestas incorrectas.");
    return;
  }
  alertBox.hidden = true;
  output.innerHTML = "<h3>Tus ideas para la botella (" + ideas.length + ")</h3><ul class=\"idea-list\"></ul>" +
    '<p class="motivation">Cada idea nueva abre la puerta a otra. Sigue pensando diferente: ¿qué más podría ser esa botella?</p>';
  const list = output.querySelector(".idea-list");
  ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.textContent = idea;
    list.appendChild(li);
  });
  output.hidden = false;
}

/* ============ 5. ACTIVIDAD 3: INVENTO ============ */
function presentInvention() {
  const alertBox = $("#invention-alert");
  const output = $("#invention-output");
  const text = $("#invention-input").value.trim();
  if (!text) {
    output.hidden = true;
    showAlert(alertBox, "Advertencia: describe tu invento antes de presentarlo.");
    return;
  }
  alertBox.hidden = true;
  output.innerHTML = '<h3>Tu invento: reloj + bicicleta + inteligencia artificial</h3><p class="idea-text"></p>' +
    '<p class="motivation">Así funciona la creatividad: combinando conocimientos que ya existen puedes crear algo que nadie había imaginado.</p>';
  output.querySelector(".idea-text").textContent = text;
  output.hidden = false;
}

/* ============ 6. REINICIO GENERAL ============ */
function resetAll() {
  resetQuiz();
  ["#ideas-input", "#invention-input"].forEach((s) => ($(s).value = ""));
  ["#ideas-output", "#invention-output", "#ideas-alert", "#invention-alert"].forEach((s) => ($(s).hidden = true));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============ 7. INICIALIZACION ============ */
document.addEventListener("DOMContentLoaded", () => {
  if (!$("#quiz")) return; // Solo se ejecuta en actividad.html
  renderQuiz();
  $("#quiz").addEventListener("change", handleSelection);
  $("#check-quiz").addEventListener("click", checkQuiz);
  $("#retry-quiz").addEventListener("click", resetQuiz);
  $("#share-ideas").addEventListener("click", shareIdeas);
  $("#present-invention").addEventListener("click", presentInvention);
  $("#reset-all").addEventListener("click", resetAll);
});
