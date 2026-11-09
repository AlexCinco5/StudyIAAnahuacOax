from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
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
        if file.content_type.startswith("image/"):
            extracted_text = extract_text_from_image(content)
        # Aquí se invoca PyPDF o pdf2image según el MIME type del documento
    elif text_input:
        extracted_text = text_input
        
    if not extracted_text:
        return {"error": "Proporciona un archivo o fragmento de texto."}
        
    # Ejecuta el Transformer local y retorna el JSON estructurado al frontend
    material = generate_study_material(extracted_text)
    return material