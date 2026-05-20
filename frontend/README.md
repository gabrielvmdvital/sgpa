# SGPA - Frontend (Sistema de Gerenciamento de Planos de Aula)

Este é o módulo frontend do SGPA, uma aplicação web baseada em React e Vite construída para fornecer uma interface do usuário elegante, responsiva e moderna para o gerenciamento de planos de aula, incorporando o recurso Smart Assist potenciado por Inteligência Artificial.

## Tecnologias Utilizadas

O desenvolvimento do frontend foi guiado pelas seguintes tecnologias de ponta:

- **React 19**: Biblioteca moderna para construção de interfaces SPA (Single Page Applications) eficientes baseadas em componentes.
- **Vite**: Ferramenta de build e servidor de desenvolvimento ultra-rápido para projetos frontend modernos.
- **CSS Vanilla (Customizado)**: Estilização limpa utilizando variáveis CSS, efeitos avançados de transparência (glassmorphism), efeitos de iluminação dinâmica no plano de fundo e animações de micro-interação.
- **Lucide React**: Conjunto de ícones vetoriais limpos e consistentes para interface rica.

## Organizacao do Diretorio do Frontend

A estrutura interna dos arquivos está organizada da seguinte maneira:

```text
frontend/
├── public/                 # Recursos públicos do sistema
├── src/
│   ├── components/         # Componentes React reutilizáveis e modulares (Modais, Cards, Filtros, etc.)
│   ├── App.jsx             # Componente central que gerencia o estado da SPA, estilização e fluxos principais
│   ├── main.jsx            # Ponto de entrada que renderiza a aplicação na árvore DOM
│   └── index.css           # Estilos globais adicionais e definições de layout
├── Dockerfile              # Configuração de build de container em produção (multi-stage com Nginx)
├── .dockerignore           # Lista de arquivos ignorados no contexto do Docker
├── package.json            # Manifesto do projeto com dependências e scripts npm
├── vite.config.js          # Arquivo de configuração do compilador Vite
└── README.md               # Esta documentação do frontend
```

## Como Executar o Frontend

Existem duas abordagens principais para executar o frontend localmente: no modo de desenvolvimento tradicional ou empacotado em um container Docker.

### Opcao A: Executando Localmente (Sem Docker)

Esta opção é recomendada para desenvolvimento rápido e modificação do código em tempo real.

#### 1. Pre-requisitos
- Ter o Node.js instalado (versão 20 LTS ou superior é recomendada).
- Ter o gerenciador de pacotes npm instalado (instalado por padrão com o Node.js).

#### 2. Instalar as dependencias
No terminal, acesse a pasta `frontend` e execute:
```bash
npm install
```

#### 3. Iniciar o servidor de desenvolvimento
Após instalar as dependências, inicie o servidor local executando:
```bash
npm run dev
```
O servidor será aberto por padrão em `http://localhost:5173`. O código possui suporte a recarregamento automático (HMR - Hot Module Replacement), refletindo as alterações no navegador instantaneamente.

---

### Opcao B: Executando via Container Docker de Desenvolvimento

O frontend está configurado com um Dockerfile simplificado focado em desenvolvimento. O Node.js executa o servidor de desenvolvimento do Vite (`npm run dev`) em primeiro plano na porta 5173, permitindo a sincronização de código instantânea por meio de volumes.

#### 1. Construir a imagem Docker do frontend
No terminal, a partir do diretório `frontend`, execute:
```bash
docker build -t sgpa-frontend .
```

#### 2. Executar o container do frontend
Após a construção da imagem, inicie o container mapeando a porta 5173 do container para a porta 5173 da sua máquina local:
```bash
docker run -d -p 5173:5173 --name sgpa_frontend_app sgpa-frontend
```
O frontend estará acessível diretamente no seu navegador em `http://localhost:5173`.

---

## Integracao com a API (Backend)

O frontend consome a API RESTful do SGPA que roda, por padrão, em `http://localhost:5000`. 
As principais rotas consumidas no backend são:

- `GET /lesson-plans`: Listagem, paginação, filtros e ordenações de planos de aula.
- `POST /lesson-plans`: Criação de planos de aula.
- `GET /lesson-plans/<id>`: Detalhamento de planos de aula.
- `PUT /lesson-plans/<id>`: Edição e atualização de dados.
- `DELETE /lesson-plans/<id>`: Exclusão de planos de aula.
- `POST /smart-assist`: Módulo de inteligência artificial para otimização de planos.

As requisições HTTP do frontend capturam erros de rede de maneira resiliente e amigável, apresentando avisos visuais elegantes caso a API do backend fique indisponível.
