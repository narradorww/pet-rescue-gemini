import google.generativeai as genai
from dotenv import load_dotenv
import base64
import os


print("Carregando variáveis de ambiente...")
load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
#print(f"API Key: {API_KEY}")  #

API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

def encode_image_to_base64(image_path):
    print(f"Codificando a imagem: {image_path}")
    with open(image_path, "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode('utf-8')
    print("Imagem codificada.")
    return encoded

# Configuração de geração e segurança do modelo
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 0,
    "max_output_tokens": 100000
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
]



# Inicializando o modelo
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro-latest",
    generation_config=generation_config,
    safety_settings=safety_settings
)

# Iniciar uma conversa
def start_chat():
    history = [
        {"role": "user", "parts": ["Eu vou te apresentar fotos de um animal. Eu posso adicionar diferentes características desse animal como nome, espécie, sinais de nascença. Guarde essas características. Se eu apresentar uma segunda foto você deverá me dizer se é o mesmo indivíduo ou não. Me diga se podemos começar."]},
        {"role": "model", "parts": ["Sim, podemos começar! Estou pronto para analisar as fotos e características dos animais. Vamos lá!"]}
    ]
    return model.start_chat(history=history)

def send_message(history, text, model, image_base64=None, mime_type="image/jpeg"):
    # Monta a mensagem do usuário com texto
    message_parts = [{"text": text}]
    
    # Se uma imagem e seu MIME type forem fornecidos, adiciona ao mesmo 'parts'
    if image_base64:
        message_parts.append({
            "inline_data": {
                "mime_type": mime_type,  # Usa o MIME type fornecido
                "data": image_base64
            }
        })
    
    user_message = {"role": "user", "parts": message_parts}
    history.append(user_message)

    # Cria a requisição para o modelo com os 'parts' que agora podem incluir texto e/ou imagem
    model_response = model.generate_content({"parts": message_parts})
    model_message = {"role": "model", "parts": [{"text": model_response.text}]}

    # Adiciona a resposta do modelo ao histórico
    history.append(model_message)

    # Retorna o histórico atualizado e a resposta do modelo
    return history, model_response.text



def chat_until_goodbye(conversation):
    while True:
        user_input = input("Você: ")  # Recebe entrada do usuário
        if user_input.lower() == "tchau":
            print("Modelo: Tchau! Até a próxima.")
            break  # Encerra o loop se o usuário disser "tchau"

        # Codifica a mensagem em uma estrutura adequada e envia para o modelo
        message = {"role": "user", "parts": [{"text": user_input}]}
        response = conversation.send_message(message)
        print("Modelo:", response.text)

if __name__ == "__main__":
    print("Script iniciado.")
    convo = start_chat()
    chat_until_goodbye(convo)
