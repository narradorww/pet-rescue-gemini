import google.generativeai as genai
from dotenv import load_dotenv
import base64
import os
print("Carregando variáveis de ambiente...")
load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"API Key: {API_KEY}")  #

API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

def encode_image_to_base64(image_path):
    print(f"Codificando a imagem: {image_path}")
    with open(image_path, "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode('utf-8')
    print("Imagem codificada.")
    return encoded

def query_model(text, image_base64):
    model = genai.GenerativeModel('gemini-pro-vision')
    request_data = {
        "parts": [  # Diretamente `parts`, sem envolver `contents` como um dicionário adicional
            {"text": text},
            {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": image_base64
                }
            }
        ]
    }
    response = model.generate_content(request_data)  # Assegure-se de que os dados estão corretos
    return response.text

    print("Consultando o modelo...")
    model = genai.GenerativeModel('gemini-pro-vision')
    request_data = {
        "contents": [
            {
                "parts": [
                    {"text": text},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_base64
                        }
                    }
                ]
            }
        ]
    }
    response = model.generate_content(request_data)
    print("Resposta recebida do modelo.")
    return response.text

if __name__ == "__main__":
    print("Script iniciado.")
    image_path = "/home/rodrigo/Projetos/Alura/imersaoIA/pet-rescue-gemini/mistery-machine/data/apollo.jpg"
    image_base64 = encode_image_to_base64(image_path)
    text_description = "Describe this image"
    response_text = query_model(text_description, image_base64)
    print(f"Resposta do Modelo: {response_text}")
