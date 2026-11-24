import torch
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel

BASE_MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"
LORA_PATH = "./studyai_custom_lora"

print("⏳ Cargando modelo base y adaptadores LoRA...")

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

tokenizer = AutoTokenizer.from_pretrained(LORA_PATH)
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL_ID,
    quantization_config=bnb_config,
    device_map="auto"
)

# Aplicamos tu entrenamiento encima del modelo base
model = PeftModel.from_pretrained(base_model, LORA_PATH)
model.eval()
print("✅ Modelo StudyAI cargado en GPU y listo para inferencia.")

def generate_study_material(chunk_text: str):
    """Genera el resumen y cuestionario usando el modelo entrenado."""
    
    # Usamos exactamente el mismo formato ChatML con el que se entrenó
    prompt = (
        "<|im_start|>system\n"
        "Eres StudyAI, un profesor universitario. Analiza el texto y responde ÚNICAMENTE con un JSON válido "
        "que contenga 'summary' (lista de objetos con 'title' y 'body') y 'questions' (lista de objetos con "
        "'question', 'options', 'answer' como índice numérico y 'explanation').<|im_end|>\n"
        f"<|im_start|>user\n{chunk_text}<|im_end|>\n"
        "<|im_start|>assistant\n"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=1024,
            temperature=0.2,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    # Decodificamos solo los tokens nuevos generados por el asistente
    generated_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    generated_text = tokenizer.decode(generated_tokens, skip_special_tokens=True)

    try:
        start_idx = generated_text.find("{")
        end_idx = generated_text.rfind("}") + 1
        clean_json = generated_text[start_idx:end_idx]
        return json.loads(clean_json)
    except Exception as e:
        print(f"⚠️ Error parseando JSON del modelo: {e}\nSalida cruda:\n{generated_text}")
        return {"summary": [], "questions": []}