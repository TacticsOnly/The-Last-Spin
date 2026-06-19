# Marble Roulette Roguelike

Ein statisches Webspiel im Stil eines Retro-Roguelikes: Roulette-Brett, 5 Start-Murmeln, 3 Spins pro Runde, Shop nach jedem geschafften Level, 25 Murmeln und Glücksbringer mit skalierenden Synergien.

## Lokal starten

Öffne `index.html` direkt im Browser oder nutze einen lokalen Server:

```bash
python3 -m http.server 8000
```

Danach im Browser öffnen:

```text
http://localhost:8000
```

## GitHub Pages

1. Repository erstellen.
2. `index.html`, `styles.css`, `game.js` und `README.md` hochladen.
3. In GitHub unter **Settings → Pages** den Branch aktivieren.

## Spielregeln

- Du startest mit 5 klassischen Murmeln.
- Vor jedem Spin werden alle aktiven Murmeln zufällig auf unterschiedliche Roulette-Zahlen gesetzt.
- Pro Runde hast du normalerweise 3 Spins.
- Triffst du eine Zahl mit Murmel, wird der Basiswert der Roulette-Zahl plus Murmel- und Glücksbringer-Effekte gewertet.
- Erreichst du das Levelziel, kommt der Überschuss in deine Bank und du darfst im Shop kaufen.
- Die Ziele steigen exponentiell, sind aber durch Multiplikatoren, permanente Effekte und Shop-Synergien erreichbar.

## Dateien

- `index.html` – Oberfläche
- `styles.css` – Retro-Pixel-Optik
- `game.js` – komplette Spiellogik, Murmeln, Glücksbringer, Shop und Progression
