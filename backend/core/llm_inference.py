import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import json

# Modelo base sugerido (puede cambiarse por la versión entrenada posteriormente)
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    device_map="auto" # Asigna automáticamente a la GPU
)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

def generate_study_material(chunk_text, target_lang="es"):
    """Genera el JSON de estudio utilizando el modelo Transformer local."""
    
    prompt = f"""[INST] Actúa como un profesor universitario. Analiza este texto y extrae conceptos clave generando un JSON estricto con arreglos de 'topics', 'flashcards' y 'quizzes'. El idioma debe ser {target_lang}.
    Texto: {chunk_text}
    Responde SOLO con JSON válido. [/INST]"""

    outputs = pipe(
        prompt, 
        max_new_tokens=1500, 
        temperature=0.3,
        return_full_text=False
    )
    
    generated_text = outputs[0]['generated_text']
    
    try:
        # Extracción segura del JSON generada por la IA
        start_idx = generated_text.find('{')
        end_idx = generated_text.rfind('}') + 1
        clean_text = generated_text[start_idx:end_idx]
        return json.loads(clean_text)
    except json.JSONDecodeError:
        return {"topics": []}