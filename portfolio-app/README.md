# Portfolio Inversiones 📈

App de seguimiento de inversiones con Firebase Firestore en tiempo real.

## Deploy en Netlify

### Opción 1 — Drag & Drop (más fácil)
1. Instalá Node.js si no lo tenés: https://nodejs.org
2. En la carpeta del proyecto, corré:
   ```
   npm install
   npm run build
   ```
3. Arrastrá la carpeta `build/` a https://app.netlify.com/drop

### Opción 2 — GitHub + Netlify (recomendado para actualizaciones)
1. Subí esta carpeta a un repo de GitHub
2. En Netlify: "Add new site" → "Import from Git"
3. Build command: `npm run build`
4. Publish directory: `build`

## Reglas de seguridad en Firebase

Una vez desplegado, en Firebase Console → Firestore → Rules, cambiá:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Solo durante desarrollo
    }
  }
}
```

Para producción, restringí por dominio o autenticación.

## Estructura Firestore

- `movimientos/` — colección de movimientos (se agregan desde la app)
- `arqueos/` — arqueos mensuales (ID = "YYYY-MM")
