# Mau Diary Cover Strategy

## Ziel
Jeder Tagebucheintrag soll visuell ein warmes, stimmiges Cover haben — ohne dass die App kaputt oder unfertig wirkt, wenn noch kein echtes Bild vorhanden ist.

## Aktueller Stand
Derzeit liest die App die erste Markdown-Bildzeile eines Eintrags als `coverImage` aus.

Das führt aktuell zu zwei unschönen Effekten, wenn die Datei noch nicht existiert:
- In der Übersicht erscheint nur der Text `Bild` als Marker.
- Auf der Detailseite erscheint der Alt-Text `Diary Cover`, wenn das Bild nicht geladen werden kann.

Technisch ist das okay, atmosphärisch aber nur so mittel. Ein fehlendes Cover sollte cozy wirken, nicht nach kaputtem Platzhalter.

## Empfehlung: Hybrid-Modell
Beste Lösung: **echtes KI-Cover + hübscher automatischer Fallback**.

### Modus A – Echtes Cover vorhanden
Wenn eine Datei existiert, z. B.
`/assets/diary-covers/2026-04-06.jpg`

Dann soll die App:
- das Bild normal anzeigen
- in der Übersicht gern einen kleinen Cover-Hinweis oder Thumbnail zeigen
- auf der Detailseite das Bild prominent und schön eingebettet rendern

### Modus B – Kein Cover vorhanden
Wenn kein Bild existiert, soll die App **kein kaputtes `<img>`** rendern.
Stattdessen sollte sie automatisch ein visuelles Default-Cover anzeigen.

Das Default-Cover soll sich anfühlen wie:
- pixel-art / retro UI
- cozy coffeehouse / cat vibe
- warmes Papierkarten-Gefühl
- Datum + Titel als Gestaltungselement
- kleine Deko (Kaffee, Sternchen, Cat-Ears, Tape, Cursor, Mini-Window, Herzchen sehr sparsam)

## UX-Zielbild
Ein Eintrag darf nie "nackt" oder halb kaputt aussehen.

Stattdessen gilt:
- echtes Bild = schön
- kein Bild = trotzdem schön

Die Seite soll immer bewusst gestaltet wirken.

## Empfohlene technische Umsetzung

### 1. Cover-Metadaten sauber trennen
Statt nur blind die erste Markdown-Bildzeile als Wahrheit zu nehmen, sollte die App zusätzlich einen abgeleiteten Cover-Status kennen:

- `coverImage`: der in Markdown referenzierte Pfad
- `coverExists`: existiert die Datei wirklich im Repo/public export?
- `coverMode`: `image` | `fallback`

Empfohlene Regel:
- Wenn `coverImage` gesetzt **und Datei vorhanden** → `coverMode = image`
- Sonst → `coverMode = fallback`

### 2. Fallback-Cover als eigene Komponente
Empfehlung:
`components/DiaryCover.tsx`

Diese Komponente entscheidet zentral:
- echtes Bild rendern
- oder Fallback-Cover rendern

Vorteile:
- keine kaputten Bilder mehr
- einheitliches Verhalten auf Karten + Detailseiten
- später leichter erweiterbar

### 3. Fallback-Cover dynamisch aus Entry-Daten erzeugen
Inputs:
- `title`
- `date`
- optional `excerpt`
- optional `mood` / `theme`

Der Fallback muss nicht generativ sein. Ein gut gestaltetes CSS/HTML-Cover reicht völlig.

### 4. Übersicht verbessern
Aktuell zeigt die Card nur `Bild`, wenn `coverImage` gesetzt ist.
Besser wäre:
- `Mit Cover`, wenn echte Datei vorhanden
- `Auto-Cover`, wenn Fallback aktiv ist
- oder gar kein Textbadge, wenn stattdessen direkt ein kleines visuelles Cover/Thumbnail genutzt wird

### 5. Markdown-Bildzeile weiter erlauben
Die Markdown-Zeile im Entry darf bleiben:

`![Diary Cover](assets/diary-covers/YYYY-MM-DD.jpg)`

Das ist gut für:
- einfache menschliche Pflege
- späteren Austausch durch echte Bilder
- klare Konvention im Repo

Aber: die App sollte nicht davon ausgehen, dass die Datei bereits existiert.

## Zwei sinnvolle Ausbau-Stufen

### Stufe 1 – Robust & hübsch
- fehlende Bilder erkennen
- Fallback-Cover anzeigen
- kein Alt-Text-Leak mehr
- Übersicht schöner markieren

### Stufe 2 – Richtig magisch
- optional KI-generierte Covers pro Eintrag
- Prompt automatisch aus Datum/Titel/Stimmung ableiten
- Cover-Datei nach Konvention speichern
- App zeigt automatisch das neue Bild, sobald es vorhanden ist

## Dateikonvention für echte Cover
Empfohlen:
- `assets/diary-covers/YYYY-MM-DD.jpg`
- Beispiel: `assets/diary-covers/2026-04-06.jpg`

Optional später:
- `.webp` bevorzugen für kleinere Dateigröße
- `.jpg` als kompatibler Standard okay

## Entscheidungsregel für die Zukunft
Wenn ein neuer Eintrag entsteht:
1. Markdown-Zeile für das Cover bleibt im Entry stehen.
2. Wenn ein echtes Cover generiert wurde, wird es unter der Datums-Konvention gespeichert.
3. Wenn noch kein echtes Bild da ist, zeigt die App automatisch ein hübsches Default-Cover.
4. Dadurch wirkt der Eintrag vom ersten Moment an vollständig.

## Empfohlene nächste Implementierung
Wenn wir das als nächstes in Code bauen wollen, ist die sauberste Reihenfolge:

1. `lib/diary.ts` um echten Cover-Existenz-Check erweitern
2. `DiaryCover.tsx` als zentrale Komponente bauen
3. `DiaryEntryCard.tsx` auf Badge/Thumbnail/Fallback umstellen
4. `MarkdownRenderer.tsx` so umbauen, dass fehlende Bilder nicht roh als kaputtes Bild erscheinen
5. optional später Cover-Pipeline automatisieren
