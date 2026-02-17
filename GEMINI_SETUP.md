# Oppsett av Gemini AI (Google AI SDK)

For å bruke AI-retting i appen trenger du en API-nøkkel fra Google.

### 1. Hent API-nøkkel
1. Gå til [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/app/apikey).
2. Logg inn med Google-kontoen din.
3. Klikk på den blå knappen **"Create API key in new project"** eller velg et eksisterende prosjekt.
4. Kopier nøkkelen som starter med `AIza...`.

### 2. Legg til nøkkelen lokalt
Åpne fila `.env` i prosjektmappen din og legg til denne linja nederst:
```env
VITE_GEMINI_API_KEY=din_nøkkel_her
```

### 3. Godkjenning og bruk
- Gemini-nøkkelen brukes direkte fra nettleseren din i dette prosjektet.
- **Viktig**: Siden vi bruker en "VITE_" prefix, blir nøkkelen inkludert i den ferdige koden. Dette er greit for et lukket skoleprosjekt, men husk at hvem som helst med teknisk innsikt kan finne nøkkelen i kildekoden. For maksimal sikkerhet i et stort prosjekt ville vi brukt en server (Backend), men for denne appen er dette den raskeste måten å komme i gang på.

### 4. Legg til på GitHub (for deployment)
Husk å også legge til `VITE_GEMINI_API_KEY` som en **Secret** på GitHub, på samme måte som du gjorde med Firebase-nøklene. (Se `GITHUB_DEPLOYMENT.md`).

---

**Neste steg**: Når nøkkelen er lagt inn, kan jeg begynne å skrive selve logikken som sender elevsvar til Gemini for automatisk vurdering.
