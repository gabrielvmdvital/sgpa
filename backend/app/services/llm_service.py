import os
import json
import time
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self, model="gemini-2.5-flash"):
        self.api_key = os.environ.get("LLM_API_KEY")
        self.base_url = os.environ.get("LLM_BASE_URL")
        self.model = model

        self.client = None
        if self.api_key:
            client_kwargs = {"api_key": self.api_key}
            if self.base_url:
                client_kwargs["base_url"] = self.base_url
            self.client = OpenAI(**client_kwargs)
        else:
            logger.warning("Chave de API LLM não configurada ou inválida. LLMService operará em modo mock.")

    def generate_lesson_recommendations(self, title: str, subject: str, summary: str) -> dict:
        if not self.client:
            return {
                "suggested_content": "1. Introdução Teórica Avançada\n2. Dinâmica de Grupo\n3. Exercícios de Fixação",
                "related_topics": "História do conceito, Aplicações no mercado de trabalho",
                "tags": "teoria, prática, dinâmico"
            }

        try:
            system_prompt = """
                Você atua como um "Assistente Pedagógico".
                Sua tarefa é complementar um plano de aula gerando recomendações.
                Responda ESTRITAMENTE num formato JSON válido contendo as seguintes chaves em português:
                - "suggested_content": uma string com conteúdos complementares sugeridos.
                - "related_topics": uma string com tópicos relacionados em formato de texto.
                - "tags": uma string com exatamente 3 tags recomendadas separadas por vírgula.
            """

            user_prompt = f"""
                Com base nas seguintes informações de um plano de aula:
                Título: {title}
                Disciplina: {subject}
                Ementa/Resumo: {summary}
            """

            start_time = time.time()
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            latency = time.time() - start_time
            token_usage = response.usage.total_tokens if response.usage else 0

            text_response = response.choices[0].message.content
            
            text_response = text_response.replace("```json", "").replace("```", "").strip()

            parsed_json = json.loads(text_response)
            
            logger.info(f'AI Request: Title="{title}", Discipline="{subject}", TokenUsage={token_usage}, Latency={latency:.1f}s.')
            return parsed_json
            
        except Exception as e:
            logger.error(f'AI Request Failed: Title="{title}", Error="{str(e)}"')
            raise Exception(f"Erro ao processar recomendações da IA: {str(e)}")
