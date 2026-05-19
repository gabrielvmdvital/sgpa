FROM python:3.12-slim

WORKDIR /app

# Instalar uv
RUN pip install uv

# Copiar dependências primeiro para aproveitar o cache do Docker
COPY pyproject.toml uv.lock ./

# Instalar dependências no sistema
RUN uv pip install --system -r pyproject.toml

# Copiar todo o resto do projeto
COPY . .

# Variáveis de ambiente padrão
ENV FLASK_APP=run.py
ENV FLASK_DEBUG=0
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# iniciar o servidor
CMD ["python", "run.py"]
