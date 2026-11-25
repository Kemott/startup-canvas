(() => {
  let state = CanvasStorage.load();
  let editing = null;
  const $ = id => document.getElementById(id);
  const dialog = $("noteDialog");
  const sections = {
    partners:"Kluczowi partnerzy", activities:"Kluczowe działania", resources:"Kluczowe zasoby",
    value:"Propozycja wartości", relationships:"Relacje z klientami", channels:"Kanały",
    segments:"Segmenty klientów", costs:"Struktura kosztów", revenue:"Strumienie przychodów"
  };
  let toastTimer;
  function toast(message) {
    const el = $("toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
  }
  function save() {
    CanvasStorage.save(state);
    $("lastSaved").textContent = "Zapisano lokalnie • " + new Date().toLocaleTimeString("pl-PL", {hour:"2-digit",minute:"2-digit"});
  }
  function render() {
    $("projectName").value = state.projectName;
    $("canvasProjectTitle").textContent = state.projectName || "Bez nazwy";
    CanvasView.render(state, openEdit, openAdd);
  }
  function openAdd(section) { openEditor(section, null); }
  function openEdit(section, id) { openEditor(section, id); }
  function openEditor(section, id) {
    editing = { section, id };
    const note = id ? state.notes[section].find(n => n.id === id) : null;
    $("dialogTitle").textContent = note ? "Edytuj notatkę" : "Dodaj notatkę";
    $("noteText").value = note?.text || "";
    $("noteStatus").value = note?.status || "question";
    $("deleteNoteBtn").hidden = !note;
    dialog.showModal();
    $("noteText").focus();
  }
  function closeDialog() { dialog.close(); editing = null; }
  $("noteForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!editing) return;
    const text = $("noteText").value.trim();
    if (!text) return;
    const list = state.notes[editing.section];
    const note = { id: editing.id || crypto.randomUUID(), text, status: $("noteStatus").value, updatedAt: new Date().toISOString() };
    const index = list.findIndex(n => n.id === editing.id);
    if (index >= 0) list[index] = note; else list.push(note);
    save(); render(); closeDialog(); toast("Notatka zapisana");
  });
  $("deleteNoteBtn").addEventListener("click", () => {
    if (!editing) return;
    state.notes[editing.section] = state.notes[editing.section].filter(n => n.id !== editing.id);
    save(); render(); closeDialog(); toast("Notatka usunięta");
  });
  $("closeDialog").addEventListener("click", closeDialog);
  $("cancelDialog").addEventListener("click", closeDialog);
  $("projectName").addEventListener("input", e => {
    state.projectName = e.target.value; $("canvasProjectTitle").textContent = state.projectName || "Bez nazwy"; save();
  });
  $("printBtn").addEventListener("click", () => window.print());
  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `${safeName(state.projectName)}-canvas.json`; a.click(); URL.revokeObjectURL(url);
    toast("Wyeksportowano plik JSON");
  });
  $("importBtn").addEventListener("click", () => $("fileInput").click());
  $("fileInput").addEventListener("change", async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const incoming = JSON.parse(await file.text());
      const validKeys = Object.keys(CanvasStorage.emptyState().notes);
      if (!incoming.notes || !validKeys.some(k => Array.isArray(incoming.notes[k]))) throw new Error("Nieprawidłowy format");
      const fresh = CanvasStorage.emptyState();
      state = {...fresh, ...incoming, notes:Object.fromEntries(validKeys.map(k => [k, Array.isArray(incoming.notes[k]) ? incoming.notes[k].filter(n => n && typeof n.text === "string").map(n => ({id:n.id || crypto.randomUUID(),text:n.text,status:["question","hypothesis","confirmed","rejected"].includes(n.status)?n.status:"question"})) : []]))};
      save(); render(); toast("Zaimportowano Canvas");
    } catch { toast("Nie udało się odczytać pliku JSON"); }
    e.target.value = "";
  });
  $("newProjectBtn").addEventListener("click", () => {
    if (!confirm("Utworzyć nowy, pusty Canvas? Najpierw wyeksportuj obecny projekt, jeśli chcesz go zachować.")) return;
    state = CanvasStorage.emptyState(); save(); render(); toast("Utworzono nowy Canvas");
  });
  $("addIdeaBtn").addEventListener("click", () => {
    const section = prompt("Do którego obszaru dodać notatkę?\n" + Object.entries(sections).map(([k,v])=>`${k} — ${v}`).join("\n") + "\n\nWpisz nazwę techniczną, np. value, segments lub revenue:");
    if (section && sections[section.trim()]) openAdd(section.trim());
    else if (section) toast("Nie rozpoznano pola. Użyj np. value lub segments.");
  });
  function safeName(value) { return (value || "startup").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "startup"; }
  render();
  if (!state.updatedAt) save();
})();