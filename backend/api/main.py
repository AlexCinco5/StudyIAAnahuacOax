from io import BytesIO
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from core.ocr_engine import extract_text_from_image
from core.llm_inference import generate_study_material

app = FastAPI(title="StudyAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate")
async def generate_material(
    file: UploadFile = File(None),
    text_input: str = Form(None)
):
    extracted_text = ""

    if file:
        content = await file.read()
        filename = (file.filename or "").lower()

        if file.content_type.startswith("image/"):
            extracted_text = extract_text_from_image(content)

        elif file.content_type == "application/pdf" or filename.endswith(".pdf"):
            reader = PdfReader(BytesIO(content))
            pages_text = [page.extract_text() or "" for page in reader.pages]
            extracted_text = "\n".join(pages_text).strip()

        elif file.content_type == "text/plain" or filename.endswith(".txt"):
            extracted_text = content.decode("utf-8", errors="ignore").strip()

    if not extracted_text and text_input:
        extracted_text = text_input.strip()

    if not extracted_text:
        return {"error": "No se pudo extraer texto del archivo. Verifica que el PDF no sea solo imágenes escaneadas."}

    # Limitamos el texto para no saturar la ventana de contexto del modelo local
    material = generate_study_material(extracted_text[:4000])
    return material