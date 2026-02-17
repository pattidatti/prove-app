# Sette opp GitHub Secrets for automatisk deployment

Siden vi bruker GitHub Actions for å sende nettsiden til GitHub Pages, må GitHub vite om dine Firebase-nøkler slik at de blir inkludert i den ferdige nettsiden.

### 1. Finn dine verdier
Åpne din lokale `.env` i prosjektet. Du trenger disse 6 verdiene:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 2. Legg dem til i GitHub
1. Gå til ditt repository på GitHub.com.
2. Klikk på fanen **Settings** (tannhjulet øverst).
3. I menyen til venstre, se etter **Secrets and variables** og klikk på **Actions**.
4. Klikk på den grønne knappen **New repository secret**.
5. I feltet **Name**, skriv inn f.eks. `VITE_FIREBASE_API_KEY`.
6. I feltet **Secret**, lim inn verdien fra din `.env`.
7. Klikk **Add secret**.

**Repeter dette for alle 6 verdiene.**

### 3. Aktiver GitHub Pages
1. Gå til **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, velg **GitHub Actions**.

### 4. Deploy!
Neste gang du gjør en `git push` til `main`, vil GitHub automatisk bygge og publisere nettsiden din. Du kan se fremgangen under fanen **Actions**.

> [!TIP]
> Hvis du vil deploye manuelt nå med en gang:
> `npm run deploy` (krever at du har installert `gh-pages` pakken og satt opp "homepage" i package.json).
