# SGPA - Backend (Sistema de Gerenciamento de Planos de Aula)

O backend do **SGPA** é uma API RESTful robusta construída em Python utilizando o framework **Flask**. Ele gerencia o cadastro, filtros, buscas e ordenações de planos de aula, além de integrar o módulo **Smart Assist** (Inteligência Artificial utilizando a API do Gemini/OpenAI).

A arquitetura segue o padrão MVC simplificado dividido em:
*   `app/models/`: Estruturação das tabelas do banco de dados (SQLAlchemy).
*   `app/schemas/`: Esquemas de validação de dados de entrada e saída (Pydantic).
*   `app/routes/`: Definição de endpoints/Blueprints da API.
*   `app/services/`: Lógica de negócio e integrações externas (Serviço de LLM/IA).

---

## Tecnologias Principais
*   **Python 3.10+**
*   **Flask** (Micro-framework web)
*   **Flask-SQLAlchemy** (ORM para banco de dados)
*   **SQLite** (Banco de dados relacional leve para desenvolvimento)
*   **Pydantic v2** (Validação rigorosa de dados)
*   **Flasgger** (Geração automática de documentação Swagger)
*   **UV** (Gerenciador moderno, ultra-rápido de pacotes e ambientes virtuais Python)

---

## Como Executar a Aplicação

Você pode executar o backend de duas formas: **Localmente (Sem Docker)** ou **Utilizando Docker/Docker Compose**.

### Opção A: Executando Localmente (Sem Docker) - RECOMENDADO PARA DESENVOLVIMENTO

Esta opção utiliza o gerenciador **UV** para configurar o ambiente virtual de forma extremamente rápida.

#### 1. Instalar o `uv` (Caso não possua)
Abra o seu terminal e execute:
*   **Windows (PowerShell)**:
    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```
*   **Linux / macOS**:
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

#### 2. Criar e ativar o ambiente virtual (.venv)
Navegue até a pasta `backend` no seu terminal e execute:
```bash
# Criar o ambiente virtual na pasta
uv venv
```

Para **ativar** o ambiente virtual:
*   **Windows (PowerShell)**:
    ```powershell
    .venv\Scripts\activate
    ```
*   **Windows (CMD)**:
    ```cmd
    .venv\Scripts\activate.bat
    ```
*   **Linux / macOS**:
    ```bash
    source .venv/bin/activate
    ```

*(Você verá a indicação `(backend)` ou similar no início da linha de comando do seu terminal indicando que o ambiente está ativo).*

#### 3. Instalar as dependências sincronizadas
Com o ambiente virtual ativo, execute o comando abaixo para instalar as bibliotecas do projeto (incluindo dependências de desenvolvimento, CORS, etc.):
```bash
uv sync
```

#### 4. Configurar as variáveis de ambiente (.env)
Copie o arquivo `.env.example` da pasta do backend e renomeie-o para `.env`:
```bash
# No Windows PowerShell:
Copy-Item .env.example .env

# No Linux/macOS ou Git Bash:
cp .env.example .env
```
Abra o arquivo `.env` gerado e configure sua chave da API de Inteligência Artificial:
```env
LLM_API_KEY=sua_chave_do_gemini_ou_openai_aqui
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/sgpa.db
```

#### 5. Executar o servidor de desenvolvimento
Para inicializar o servidor local, simplesmente execute:
```bash
uv run python run.py
```
A API estará rodando em **`http://localhost:5000`**.

---

### Opção B: Executando com Docker e Docker Compose

Se preferir rodar a aplicação em containers isolados:

#### 1. Pré-requisitos
*   Ter o [Docker](https://www.docker.com/products/docker-desktop/) instalado e rodando em sua máquina.

#### 2. Executando com um único comando (Docker Compose)
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o terminal e rode:
```bash
docker compose up --build
```
Este comando irá:
1.  Construir a imagem Docker do backend contendo todas as dependências necessárias.
2.  Mapear a porta `5000` do container para a porta `5000` da sua máquina física.
3.  Montar um volume local para persistir o banco SQLite em `./backend/instance`.
4.  Iniciar o servidor Flask automaticamente.

---

## Rodando os Testes Automatizados

A suíte de testes unitários roda em um banco de dados SQLite efêmero em memória para não alterar seus dados locais de desenvolvimento.

Para executar os testes locais (com o ambiente `.venv` ativo):
```bash
uv run pytest
```
Ou simplesmente:
```bash
pytest
```

---

## Endpoints Principais e Documentação Swagger

Com o backend ativo, acesse o link de documentação interativa:
*   **Swagger UI**: [http://localhost:5000/apidocs](http://localhost:5000/apidocs)

Através do Swagger, você pode testar diretamente no navegador as seguintes rotas:

| Rota | Método | Descrição |
|---|---|---|
| `/health` | `GET` | Health Check ativo da API e conectividade do banco de dados SQLite. |
| `/lesson-plans` | `POST` | Criação de um novo Plano de Aula (Validação Pydantic). |
| `/lesson-plans` | `GET` | Listagem paginada de planos (suporta filtros, busca textual e ordenação). |
| `/lesson-plans/<id>` | `GET` | Detalhamento de um plano específico. |
| `/lesson-plans/<id>` | `PUT` | Edição/atualização de um plano existente. |
| `/lesson-plans/<id>` | `DELETE` | Remoção definitiva de um plano de aula do banco de dados. |
| `/smart-assist` | `POST` | Envia Título, Disciplina e Resumo para gerar conteúdos complementares, tópicos e tags inteligentes via IA. |
