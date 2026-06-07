/**
 * app.js — Incidencias TIC (Supabase + GitHub Pages)
 */

const SUPABASE_URL = "https://egupopypccnucniurcha.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndXBvcHlwY2NudWNuaXVyY2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTI2MTIsImV4cCI6MjA5NjQyODYxMn0.h5kkiEotYCFTJXe5dlTbK3Th7B67sCZ96qJUCR1z47Q";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM
const msg = document.getElementById("msg");
const authPanel = document.getElementById("authPanel");
const appPanel = document.getElementById("appPanel");
const userEmail = document.getElementById("userEmail");

const email = document.getElementById("email");
const password = document.getElementById("password");

const btnSignUp = document.getElementById("btnSignUp");
const btnSignIn = document.getElementById("btnSignIn");
const btnSignOut = document.getElementById("btnSignOut");

const formIncidencia = document.getElementById("formIncidencia");

const aula = document.getElementById("aula");
const equipo = document.getElementById("equipo");
const tipo = document.getElementById("tipo");
const descripcion = document.getElementById("descripcion");

const tbody = document.getElementById("tbodyIncidencias");

// UI
function showMsg(text, kind = "ok") {
  msg.className = `msg ${kind}`;
  msg.textContent = text;
}

function setLoggedUI(session) {
  const logged = !!session;
  authPanel.classList.toggle("hidden", logged);
  appPanel.classList.toggle("hidden", !logged);

  userEmail.textContent = session?.user?.email ?? "—";
}

// SESSION
async function loadSessionAndInit() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) showMsg(error.message, "err");

  setLoggedUI(data?.session);

  if (data?.session) {
    await loadIncidencias();
  }
}

// AUTH
btnSignUp.addEventListener("click", async () => {
  try {
    const { error } = await supabaseClient.auth.signUp({
      email: email.value.trim(),
      password: password.value,
    });

    if (error) throw error;

    showMsg("Usuario creado. Revisa email si se solicita verificación.", "ok");
  } catch (e) {
    showMsg(e.message, "err");
  }
});

btnSignIn.addEventListener("click", async () => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    });

    if (error) throw error;

    setLoggedUI(data.session);
    showMsg("Sesión iniciada.", "ok");
    await loadIncidencias();
  } catch (e) {
    showMsg(e.message, "err");
  }
});

btnSignOut.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  setLoggedUI(null);
  tbody.innerHTML = "";
  showMsg("Sesión cerrada.", "ok");
});

// CREATE
formIncidencia.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const uid = sessionData?.session?.user?.id;

    if (!uid) throw new Error("No hay sesión activa.");

    const payload = {
      user_id: uid,
      aula: aula.value.trim(),
      equipo: equipo.value.trim(),
      tipo: tipo.value,
      descripcion: descripcion.value.trim(),
      estado: "abierta",
    };

    const { error } = await supabaseClient
      .from("incidencias")
      .insert(payload);

    if (error) throw error;

    formIncidencia.reset();
    showMsg("Incidencia creada.", "ok");

    await loadIncidencias();
  } catch (e) {
    showMsg(e.message, "err");
  }
});

// READ
async function loadIncidencias() {
  try {
    const { data, error } = await supabaseClient
      .from("incidencias")
      .select("id, created_at, aula, equipo, tipo, estado")
      .order("created_at", { ascending: false });

    if (error) throw error;

    renderIncidencias(data ?? []);
  } catch (e) {
    showMsg(e.message, "err");
  }
}

// RENDER
function renderIncidencias(rows) {
  tbody.innerHTML = "";

  for (const r of rows) {
    const tr = document.createElement("tr");

    const dt = new Date(r.created_at).toLocaleString();

    tr.innerHTML = `
      <td>${dt}</td>
      <td>${escapeHtml(r.aula)}</td>
      <td>${escapeHtml(r.equipo)}</td>
      <td>${escapeHtml(r.tipo)}</td>
      <td>${escapeHtml(r.estado)}</td>
      <td>
        ${
          r.estado === "abierta"
            ? `<button class="btnCerrar" data-id="${r.id}">Cerrar</button>`
            : ""
        }
      </td>
    `;

    tbody.appendChild(tr);
  }

  document.querySelectorAll(".btnCerrar").forEach(btn => {
    btn.addEventListener("click", async () => {
      await cerrarIncidencia(btn.dataset.id);
    });
  });
}

// UPDATE
async function cerrarIncidencia(id) {
  try {
    const { error } = await supabaseClient
      .from("incidencias")
      .update({ estado: "cerrada" })
      .eq("id", id);

    if (error) throw error;

    showMsg("Incidencia cerrada.", "ok");
    await loadIncidencias();
  } catch (e) {
    showMsg(e.message, "err");
  }
}

// SECURITY UI
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// AUTH LISTENER
supabaseClient.auth.onAuthStateChange((_event, session) => {
  setLoggedUI(session);

  if (session) loadIncidencias();
  else tbody.innerHTML = "";
});

// INIT
loadSessionAndInit();