const API_BASE = resolveApiBase();
const MAX_QUESTIONS = 9;

const copy = {
  es: {
    hint: "",
    yes: "Si",
    dontKnow: "No sé",
    no: "No",
    resultLabel: "Perunator recomienda",
    restart: "Empezar otra vez",
    loading: "Preparando la siguiente pregunta...",
    error: "No pude conectar con Perunator. Revisa que el backend este corriendo.",
    retry: "Intentar otra vez",
    backendHint: "Backend",
  },
  en: {
    hint: "",
    yes: "Yes",
    dontKnow: "Don't know",
    no: "No",
    resultLabel: "Perunator recommends",
    restart: "Start again",
    loading: "Preparing the next question...",
    error: "Could not connect to Perunator. Check that the backend is running.",
    retry: "Try again",
    backendHint: "Backend",
  },
};

const browserLanguages = getBrowserLanguages();
const answerIcons = {
  yes: "✔",
  dontKnow: "🤔",
  no: "❌",
};

const state = {
  browserLanguages,
  language: chooseLanguage(browserLanguages),
  sessionId: null,
  question: null,
  questionCount: 0,
  busy: false,
};

const elements = {
  statusText: document.querySelector("#statusText"),
  questionText: document.querySelector("#questionText"),
  hintText: document.querySelector("#hintText"),
  answerActions: document.querySelector("#answerActions"),
  answerButtons: document.querySelectorAll(".answer"),
  errorActions: document.querySelector("#errorActions"),
  result: document.querySelector("#result"),
  dishName: document.querySelector("#dishName"),
  restartButton: document.querySelector("#restartButton"),
  retryButton: document.querySelector("#retryButton"),
  progressBar: document.querySelector("#progressBar"),
};

function resolveApiBase() {
  const explicitBase = window.PERUNATOR_API_BASE;
  if (explicitBase) {
    return explicitBase.replace(/\/$/, "");
  }

  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:8000";
  }

  const host = window.location.hostname || "127.0.0.1";
  return `${window.location.protocol}//${host}:8000`;
}

function getBrowserLanguages() {
  const languages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];
  return languages.filter(Boolean);
}

function chooseLanguage(languages) {
  return languages.some((language) => language.toLowerCase().startsWith("es"))
    ? "es"
    : "en";
}

function t(key) {
  return copy[state.language][key];
}

function setStatusText(text) {
  if (elements.statusText) {
    elements.statusText.textContent = text;
  }
}

function setBusy(value) {
  state.busy = value;
  elements.answerButtons.forEach((button) => {
    button.disabled = value;
  });
  elements.restartButton.disabled = value;
  elements.retryButton.disabled = value;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.perunatorLanguage = state.language;
  document.documentElement.dataset.browserLanguages =
    state.browserLanguages.join(",");
  document.documentElement.dataset.languageCheckEnglishOnly = chooseLanguage([
    "en-US",
    "en-GB",
  ]);
  document.documentElement.dataset.languageCheckSpanishPresent = chooseLanguage([
    "en-US",
    "es-PE",
  ]);
  document.documentElement.dataset.languageCheckSpanishFirst = chooseLanguage([
    "es-ES",
    "en-US",
  ]);
  document.documentElement.dataset.languageCheckOther = chooseLanguage(["fr-FR"]);
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  setAnswerButton(0, answerIcons.yes, t("yes"));
  setAnswerButton(1, answerIcons.dontKnow, t("dontKnow"));
  setAnswerButton(2, answerIcons.no, t("no"));
  setRestartButton();
  elements.retryButton.textContent = t("retry");
  elements.retryButton.title = t("retry");
  if (state.question) {
    elements.hintText.textContent = t("hint");
    setStatusText("");
  }
}

function setAnswerButton(index, icon, label) {
  const button = elements.answerButtons[index];
  if (!button) {
    return;
  }
  button.textContent = icon;
  button.setAttribute("aria-label", label);
  button.title = label;
}

function setRestartButton() {
  elements.restartButton.textContent = "🔄";
  elements.restartButton.setAttribute("aria-label", t("restart"));
  elements.restartButton.title = t("restart");
}

function renderQuestion(question) {
  state.question = question;
  state.questionCount += 1;
  elements.result.classList.add("hidden");
  elements.errorActions.classList.add("hidden");
  elements.answerActions.classList.remove("hidden");
  setStatusText("");
  elements.questionText.textContent = question.text;
  elements.hintText.textContent = t("hint");
  elements.progressBar.style.width = `${Math.min(
    (state.questionCount / MAX_QUESTIONS) * 100,
    100,
  )}%`;
}

function renderResult(result) {
  const best = result?.recommendations?.[0] || result;
  elements.answerActions.classList.add("hidden");
  elements.errorActions.classList.add("hidden");
  elements.result.classList.remove("hidden");
  setStatusText("");
  elements.questionText.textContent = "";
  elements.hintText.textContent = "";
  elements.dishName.textContent = best?.dish || "Perunator";
  elements.progressBar.style.width = "100%";
}

function renderError(error) {
  console.error(error);
  setStatusText("");
  elements.questionText.textContent = t("error");
  elements.hintText.textContent = `${t("backendHint")}: ${API_BASE}`;
  elements.answerActions.classList.add("hidden");
  elements.result.classList.add("hidden");
  elements.errorActions.classList.remove("hidden");
  elements.progressBar.style.width = "0%";
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function startSession() {
  setBusy(true);
  state.sessionId = null;
  state.question = null;
  state.questionCount = 0;
  elements.progressBar.style.width = "0%";
  setStatusText("");
  elements.questionText.textContent = t("loading");
  elements.hintText.textContent = "";
  elements.result.classList.add("hidden");
  elements.errorActions.classList.add("hidden");
  elements.answerActions.classList.add("hidden");
  try {
    const response = await postJson("/api/session/start", {
      language: state.language,
    });
    state.sessionId = response.session_id;
    if (response.done) {
      renderResult(response.result);
    } else {
      renderQuestion(response.question);
    }
  } catch (error) {
    renderError(error);
  } finally {
    setBusy(false);
  }
}

async function answerCurrent(answer) {
  if (state.busy || !state.sessionId || !state.question) {
    return;
  }
  setBusy(true);
  try {
    const response = await postJson("/api/session/answer", {
      session_id: state.sessionId,
      question_id: state.question.id,
      answer,
      language: state.language,
    });
    if (response.done) {
      renderResult(response.result);
    } else {
      renderQuestion(response.question);
    }
  } catch (error) {
    renderError(error);
  } finally {
    setBusy(false);
  }
}

elements.answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    answerCurrent(button.dataset.answer);
  });
});

elements.restartButton.addEventListener("click", startSession);
elements.retryButton.addEventListener("click", startSession);

applyLanguage();
startSession();
