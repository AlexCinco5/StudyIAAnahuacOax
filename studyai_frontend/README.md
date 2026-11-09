# StudyAI — Frontend demo

Prototipo de interfaz para el proyecto académico StudyAI.

## Qué incluye
- Interfaz responsive en React.
- Selección/arrastre de archivos PDF, Word, TXT e imágenes.
- Área para pegar texto.
- Vistas de resumen y cuestionario.
- Cuestionario interactivo con calificación.
- Estado explícito de demostración.

## Importante
Esta versión es **solo frontend**. No ejecuta OCR, no lee el contenido de PDF/Word/imágenes y no llama a ningún modelo Transformer. Al pulsar “Generar material de estudio”, muestra resultados de ejemplo para demostrar el flujo y la interfaz. Los resultados no se generan a partir del archivo seleccionado.

Para la versión conectada, se debe integrar con el backend FastAPI:
1. Enviar el archivo o texto al endpoint del backend.
2. Procesar el archivo con OCR cuando corresponda.
3. Pasar el texto a los modelos Transformer.
4. Mostrar en React la respuesta real de la API.

## Requisitos
- Node.js 18 o posterior
- npm

## Ejecutar en Mac
Desde Terminal, entra a la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

Vite mostrará una dirección local, normalmente `http://localhost:5173`. Ábrela en el navegador.

## Generar build de producción
```bash
npm run build
npm run preview
```

## Estructura
```text
studyai-frontend/
├── index.html
├── package.json
├── src/
│   ├── main.jsx
│   └── styles.css
└── README.md
```
