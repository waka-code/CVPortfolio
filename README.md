# CV Portfolio - Waddimi Saint-Louis

Portfolio web personal desarrollado con React, TypeScript, Tailwind CSS y Vite.

## 🌐 Deploy en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando haces push a la rama `main`.

### Configuración inicial (solo una vez):

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. Haz push de tus cambios a la rama `main`
5. El workflow se ejecutará automáticamente
6. Tu sitio estará disponible en: `https://waka-code.github.io/CVPortfolio/`

## 🚀 Desarrollo

```bash
npm install
npm run dev
```

## 🔧 Troubleshooting

### Pantalla en blanco en algunos navegadores

Si la aplicación muestra una pantalla en blanco pero funciona en modo incógnito, prueba estas soluciones:

1. **Limpiar caché del navegador:**
   - **Chrome/Edge:** `Ctrl+Shift+Delete` (Windows) o `Cmd+Shift+Delete` (Mac) → Selecciona "Imágenes y archivos en caché"
   - **Firefox:** `Ctrl+Shift+Delete` → Selecciona "Caché"
   - **Safari:** `Cmd+Option+E` para vaciar cachés

2. **Desactivar extensiones del navegador** temporalmente para verificar si alguna está bloqueando recursos

3. **Forzar recarga completa:**
   - `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)

4. **Verificar la consola del navegador** (F12) para ver errores específicos

## 📦 Build

```bash
npm run build
npm run preview
```

## 🛠️ Tecnologías

- React 18
- TypeScript
- Tailwind CSS
- Vite
- i18next (internacionalización)
- Lucide React (iconos)

- Firebase Realtime Database (likes del blog)

## Implementaciones Pendientes

### Comentarios en el Blog
- Permitir a los visitantes dejar comentarios en articulos publicados
- Almacenar comentarios en Firebase Realtime Database en `comments/{slug}/{commentId}`
- Campos por comentario: `author`, `text`, `timestamp`
- Comentarios en tiempo real con `onValue`
- Guardar nombre del autor en localStorage para conveniencia
- Anti-spam basico: rate limit client-side, max 1000 caracteres

### Imagenes en el Blog Editor
- Subir imagenes a Firebase Storage desde el editor de articulos
- Insertar URL de la imagen como markdown: `![descripcion](url)`
- Ruta en Storage: `blog-images/{slug}/{timestamp}-{filename}`
- Max 5MB por imagen, solo tipos image/*
- Configurar reglas de Firebase Storage para `blog-images/`

### Reglas de Firebase necesarias

**Realtime Database:**
```json
{
  "rules": {
    "likes": {
      ".read": true,
      ".write": true
    },
    "comments": {
      "$slug": {
        ".read": true,
        "$commentId": {
          ".write": "!data.exists()",
          ".validate": "newData.hasChildren(['author', 'text', 'timestamp'])"
        }
      }
    }
  }
}
```

**Storage:**
```
match /blog-images/{slug}/{allPaths=**} {
  allow read: if true;
  allow write: if request.resource.size < 5 * 1024 * 1024
               && request.resource.contentType.matches('image/.*');
}
```