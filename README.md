# Startup Canvas

Prosta, statyczna aplikacja Business Model Canvas. Nie wymaga Node.js, Pythona ani backendu.

## Uruchomienie lokalne

1. Rozpakuj archiwum.
2. Otwórz `index.html` w przeglądarce.
3. Notatki zapisują się automatycznie w LocalStorage tej przeglądarki.

## Darmowe publikowanie przez GitHub Pages

1. Zaloguj się do GitHub i utwórz nowe repozytorium, np. `startup-canvas`.
2. Rozpakuj archiwum i wgraj do głównego katalogu repozytorium pliki `index.html`, katalog `css/`, katalog `js/` oraz ten plik README.
3. W repozytorium otwórz **Settings → Pages**.
4. W sekcji **Build and deployment** wybierz **Deploy from a branch**.
5. Wybierz gałąź `main` oraz katalog `/ (root)`, a następnie zapisz.
6. Po chwili GitHub pokaże adres strony w sekcji Pages, zwykle `https://NAZWA-UZYTKOWNIKA.github.io/startup-canvas/`.

GitHub Pages jest darmowy dla publicznych repozytoriów na planie GitHub Free. Kod strony będzie publiczny, ale notatki wpisywane w aplikacji nie są wysyłane do GitHuba — pozostają w LocalStorage przeglądarki.

## Ważne o zapisie

- Dane są przechowywane lokalnie w konkretnej przeglądarce na konkretnym urządzeniu.
- Hosting strony online nie synchronizuje automatycznie notatek między urządzeniami.
- Używaj **Eksport JSON**, aby robić kopie zapasowe lub przenosić dane. Na drugim urządzeniu użyj **Importuj**.
- Wyczyść dane przeglądarki dopiero po wykonaniu eksportu.

## Import danych przygotowanych przez asystenta

Aplikacja przyjmuje JSON o strukturze:

```json
{
  "schemaVersion": 1,
  "projectName": "Nazwa projektu",
  "notes": {
    "partners": [],
    "activities": [],
    "resources": [],
    "value": [
      { "id": "note-1", "text": "Opis propozycji wartości", "status": "hypothesis" }
    ],
    "relationships": [],
    "channels": [],
    "segments": [],
    "costs": [],
    "revenue": []
  }
}
```

Dozwolone statusy: `question`, `hypothesis`, `confirmed`, `rejected`.
