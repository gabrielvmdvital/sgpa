# SGPA - Sistema de Gerenciamento de Planos de Aula

O SGPA (Sistema de Gerenciamento de Planos de Aula) é uma plataforma web completa desenvolvida para auxiliar educadores e instituições no planejamento, estruturação, busca e otimização de planos de ensino e planos de aula. O sistema foi concebido com uma arquitetura moderna que une robustez no tratamento de dados a uma interface visualmente rica e fluida, incluindo recursos de inteligência artificial (Smart Assist) para complementação automática e enriquecimento pedagógico.

### 🎥 Vídeo de Apresentação

Vídeo demonstrativo:

[Assistir ao Vídeo de Apresentação do Projeto](https://drive.google.com/file/d/1UOgmn86BndcIt4DmBCAP79Yfkzb6TMb1/view?usp=sharing)

---

## Funcionalidades do Sistema

A plataforma engloba uma série de funcionalidades que garantem a eficiência e a facilidade de uso na rotina de planejamento escolar:

- **CRUD Completo de Planos de Aula**: Cadastro, listagem, visualização detalhada, edição e remoção definitiva de planos de aula.
- **Campos Estruturados**: Controle de dados como título, disciplina, data, resumo, conteúdo programático, tópicos complementares e tags de identificação.
- **Filtros e Buscas Dinamicas**: Filtragem avançada por disciplina, ordenação cronológica e de relevância, e busca textual instantânea que varre títulos e resumos.
- **Paginacao Inteligente**: Navegação paginada que otimiza a transferência de dados entre o servidor e a interface visual.
- **Smart Assist (Modulo IA)**: Integração com APIs de Grandes Modelos de Linguagem (OpenAI/Gemini) que gera automaticamente tópicos de conteúdo e tags a partir do título, disciplina e resumo informados.
- **Interface Premium**: Experiência do usuário de alto padrão construída com glassmorphism (efeito vidro), transições de micro-interação, luzes dinâmicas de fundo em modo escuro e layout totalmente responsivo.

---

## Arquitetura do Sistema

A arquitetura do SGPA é dividida em três camadas principais estruturadas de forma independente e isolada:

- **Frontend (Camada de Apresentacao)**: Single Page Application (SPA) reativa construída com React e Vite. Faz o consumo da API REST de forma assíncrona, tratando erros de rede e conectividade de maneira elegante para o usuário. No container, é servido pelo Vite Dev Server na porta 5173 com suporte a hot-reload.
- **Backend (Camada de Lógica de Negocio e API)**: API REST robusta em Python com o micro-framework Flask. É responsável por expor as rotas de manipulação de dados, aplicar regras de negócio e intermediar a integração com os serviços de inteligência artificial externa.
- **Banco de Dados (Camada de Persistencia)**: SQLite gerenciado via Flask-SQLAlchemy (ORM). Facilita o desenvolvimento e portabilidade com persistência local em arquivo físico volumétrico.

---

## Tecnologias Utilizadas

### Frontend
- React 19
- Vite
- CSS Vanilla Moderno
- Lucide React
- Node.js

### Backend
- Python 3.12
- Flask
- Flask-SQLAlchemy
- SQLite
- Pydantic v2
- Flasgger
- UV

### DevOps e Containerizacao
- Docker
- Docker Compose

---

## Organizacao do Projeto

O repositório do projeto está dividido de forma lógica e organizada:

```text
sgpa/
├── backend/                # Codigo-fonte do backend da aplicacao (Python/Flask)
│   ├── app/                # Estrutura interna MVC (routes, models, services, schemas)
│   ├── instance/           # Pasta criada automaticamente para abrigar o banco SQLite (sgpa.db)
│   ├── tests/              # Testes unitarios e de integracao do backend
│   ├── Dockerfile          # Arquivo para empacotar o backend em container
│   ├── pyproject.toml      # Dependencias do Python gerenciadas pelo UV
│   └── README.md           # Documentacao especifica do modulo backend
├── frontend/               # Codigo-fonte do frontend da aplicacao (React/Vite)
│   ├── src/                # Componentes, estilos e aplicacao principal
│   ├── Dockerfile          # Arquivo para rodar o frontend em ambiente de desenvolvimento com Vite
│   ├── package.json        # Arquivo de definicao e dependencias npm
│   └── README.md           # Documentacao especifica do modulo frontend
├── docker-compose.yml      # Arquivo de orquestracao geral para rodar todo o sistema com um comando
├── REQUISITOS.pdf          # Documento de especificacoes funcionais do sistema
├── backend_requisitos.md   # Especificacoes do crud e integracoes do backend
├── frontend_requisitos.md  # Especificacoes detalhadas de interface e fluxo do frontend
├── LICENSE                 # Arquivo de licenca do projeto
└── README.md               # Esta documentacao geral da solucao
```

---

## Como Executar o Sistema

Você pode rodar todo o ecossistema do SGPA de duas maneiras principais: via Docker Compose (altamente recomendado e prático) ou executando os serviços de forma híbrida e manual.

### Metodo A: Executando com Docker Compose (Mais Pratico)

Este método sobe o frontend (porta 5173) e o backend (porta 5000) de forma totalmente configurada e integrada em poucos segundos.

#### 1. Pre-requisitos
- Ter o Docker e o Docker Compose instalados em sua máquina.

#### 2. Configurar a chave de IA
Crie ou edite o arquivo `.env` na raiz do projeto ou passe a variável diretamente no terminal. O backend requer o token `LLM_API_KEY` para as funções do Smart Assist:
```env
LLM_API_KEY=sua_chave_do_gemini_ou_openai_aqui
```

#### 3. Iniciar as aplicacoes
Abra o terminal na pasta raiz do projeto e execute:
```bash
docker compose up --build
```
O Docker irá baixar as imagens base, compilar o código do backend e do frontend de forma isolada, e iniciar ambos.

#### 4. Acessar o sistema
Após a inicialização dos containers, abra o seu navegador e digite os endereços:
- **Frontend (Interface do Usuário)**: `http://localhost:5173`
- **Backend (API REST)**: `http://localhost:5000`
- **Documentação de API (Swagger)**: `http://localhost:5000/apidocs`

Para parar o sistema, basta usar a combinação de teclas `Ctrl + C` no terminal ou executar `docker compose down` em outra instância de terminal na raiz do projeto.

---

### Metodo B: Executando Localmente de Forma Hibrida (Desenvolvimento)

Caso queira fazer alterações no código e testar com Hot Reload instantâneo, você pode rodar os servidores separadamente.

#### 1. Executando o Backend
1. Entre na pasta `backend` no terminal.
2. Crie o ambiente virtual com `uv venv` e ative-o (`.venv\Scripts\activate` no Windows PowerShell ou `source .venv/bin/activate` no Linux).
3. Instale as dependências com `uv sync`.
4. Crie o arquivo `.env` baseado no `.env.example` e coloque sua chave `LLM_API_KEY`.
5. Inicie o backend com:
   ```bash
   uv run python run.py
   ```
O backend rodará em `http://localhost:5000`.

#### 2. Executando o Frontend
1. Abra outro terminal na pasta `frontend`.
2. Instale as dependências com:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento com:
   ```bash
   npm run dev
   ```
O frontend rodará em `http://localhost:5173`.

---

## Integracao Continua (CI/CD)

O projeto conta com um pipeline de integracao continua (CI) configurado via GitHub Actions para garantir a qualidade do codigo e a estabilidade das entregas:

- **Nome do Workflow**: SGPA - Backend CI
- **Gatilhos**: Execucao automatica em qualquer `push` ou `pull_request` direcionado a branch principal `main`.
- **Ambiente**: Executado em maquina virtual Ubuntu (`ubuntu-latest`) utilizando Python 3.12.
- **Etapas do Pipeline**:
  - **Checkout do Codigo**: Clonagem do repositorio na maquina virtual para execucao dos passos.
  - **Configuracao do Python**: Inicializacao do interpretador Python na versao 3.12.
  - **Instalacao do UV**: Instalacao do gerenciador de pacotes ultra-rapido da Astral.
  - **Instalacao de Dependencias**: Criacao de ambiente virtual e sincronizacao sincronizada das dependencias do projeto.
  - **Verificacao de Formatacao (Black)**: Checagem estetica do codigo em busca de problemas de padronizacao.
  - **Analise Estatica de Codigo (Flake8)**: Verificacao de sintaxe, imports nao utilizados e outros alertas de qualidade.
  - **Testes Automatizados (Pytest)**: Execucao automatizada da suite de testes para validar rotas, persistencia do SQLite e integracao com IA de forma isolada.
