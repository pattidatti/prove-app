# Firebase Oppsett for Prøve App

Dette dokumentet forklarer hvordan du konfigurerer Firebase for at appen skal fungere.

## 1. Opprett prosjekt
1. Gå til [Firebase Console](https://console.firebase.google.com/).
2. Trykk **"Add project"** og følg stegene for å opprette et nytt prosjekt (f.eks. `prove-app`).

## 2. Opprett en Web-app
1. I prosjektets oversikt, trykk på **Web-ikonet (</>)**.
2. Gi appen et navn (f.eks. `Prøve Frontend`).
3. Du får nå opp en `firebaseConfig` med API-nøkler. 
4. **VIKTIG:** Kopier disse verdiene inn i `.env`-filen i prosjektet ditt:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

## 3. Aktiver Authentication
1. Gå til **Authentication** i menyen til venstre.
2. Trykk **"Get Started"**.
3. Under **"Sign-in method"**, aktiver følgende tilbydere:
   - **Email/Password**: For lærere.
   - **Anonymous**: For elever.

## 4. Aktiver Cloud Firestore
1. Gå til **Firestore Database**.
2. Trykk **"Create database"**.
3. Velg lokasjon (f.eks. `europe-west3` Frankfurt).
4. Velg **"Production mode"**.
5. Gå til fanen **"Rules"** og lim inn innholdet fra `firestore.rules`-filen jeg har laget i prosjektet ditt.

Reglene sørger for at:
- Lærere kun kan endre sine egne prøver.
- Elever kun kan se og lagre svar i sin egen sesjon.
- Lærere har tilgang til å se (men ikke endre) elevenes sesjoner og svar for sine prøver.

## 5. Oppgrader til Blaze (Pay-as-you-go)
For at **AI-retting** skal fungere via Cloud Functions senere, må prosjektet oppgraderes til Blaze-planen. Dette koster vanligvis ingenting ved lav bruk.

## 6. GitHub Secrets
Hvis du bruker GitHub Actions for deploy, må du legge inn de samme `.env`-variablene som **GitHub Secrets** i repo-innstillingene dine.
