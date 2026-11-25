(() => {
  const labels = {
    question: "Do sprawdzenia", hypothesis: "Hipoteza",
    confirmed: "Potwierdzone", rejected: "Odrzucone"
  };
  const dotClass = { question: "status-question", hypothesis: "status-hypothesis", confirmed: "status-confirmed", rejected: "status-rejected" };
  const noteClass = { question: "note-question", hypothesis: "note-hypothesis", confirmed: "note-confirmed", rejected: "note-rejected" };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  function render(state, onEdit, onAdd) {
    document.querySelectorAll(".canvas-cell").forEach(cell => {
      const key = cell.dataset.section;
      const holder = cell.querySelector(".notes");
      const notes = state.notes[key] || [];
      holder.innerHTML = "";
      if (!notes.length) {
        const hint = document.createElement("div");
        hint.className = "empty-hint no-print";
        hint.textContent = "Brak notatek. Dodaj pierwszą, gdy pojawi się pomysł lub ustalenie.";
        holder.appendChild(hint);
      }
      notes.forEach(note => {
        const el = document.createElement("div");
        el.className = `note ${noteClass[note.status] || noteClass.question}`;
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `Edytuj notatkę: ${note.text}`);
        el.innerHTML = `<p>${esc(note.text)}</p><div class="note-meta"><i class="dot ${dotClass[note.status] || dotClass.question}"></i>${labels[note.status] || labels.question}</div>`;
        el.addEventListener("click", () => onEdit(key, note.id));
        el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEdit(key, note.id); } });
        holder.appendChild(el);
      });
      cell.querySelector(".add-note").addEventListener("click", () => onAdd(key), { once: true });
    });
  }
  window.CanvasView = { render };
})();