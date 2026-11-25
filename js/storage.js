(() => {
  const KEY = "startupCanvas.v1";
  const emptyState = () => ({
    schemaVersion: 1,
    projectName: "Mój pomysł biznesowy",
    updatedAt: new Date().toISOString(),
    notes: {
      partners: [], activities: [], resources: [], value: [],
      relationships: [], channels: [], segments: [], costs: [], revenue: []
    }
  });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyState();
      const data = JSON.parse(raw);
      const base = emptyState();
      return {
        ...base, ...data,
        notes: Object.fromEntries(Object.keys(base.notes).map(k => [k, Array.isArray(data.notes?.[k]) ? data.notes[k] : []]))
      };
    } catch { return emptyState(); }
  }
  function save(state) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  window.CanvasStorage = { load, save, emptyState };
})();