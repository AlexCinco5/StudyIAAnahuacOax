import easyocr
from pdf2image import convert_from_path
import numpy as np

# Inicializa el lector para extraer texto en español e inglés
reader = easyocr.Reader(['es', 'en'], gpu=True)

def extract_text_from_image(image_bytes):
    """Extrae texto de imágenes subidas desde el frontend."""
    result = reader.readtext(image_bytes, detail=0)
    return " ".join(result)

def extract_text_from_scanned_pdf(pdf_path):
    """Convierte un PDF escaneado a imágenes y extrae su texto."""
    pages = convert_from_path(pdf_path, 300)
    full_text = []
    for page in pages:
        page_np = np.array(page)
        text = reader.readtext(page_np, detail=0)
        full_text.append(" ".join(text))
    return "\n".join(full_text)