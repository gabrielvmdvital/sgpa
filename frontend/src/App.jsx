import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen, Search, Filter, Calendar, TrendingUp, TrendingDown,
  Plus, Edit2, Trash2, Eye, Sparkles, Loader2, CheckCircle,
  AlertCircle, X, ArrowLeft, Save, ServerCrash, Clock
} from 'lucide-react';

const globalStyles = `
  :root {
    /* HSL Variables for Premium Dark Theme */
    --h-bg: 220; --s-bg: 10%; --l-bg: 8%;
    --bg-main: hsl(var(--h-bg), var(--s-bg), var(--l-bg));
    
    --h-surface: 220; --s-surface: 14%; --l-surface: 14%;
    --surface: hsl(var(--h-surface), var(--s-surface), var(--l-surface));
    --surface-hover: hsl(var(--h-surface), var(--s-surface), 20%);
    
    --h-primary: 270; --s-primary: 80%; --l-primary: 60%;
    --primary: hsl(var(--h-primary), var(--s-primary), var(--l-primary));
    --primary-glow: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.5);
    
    --text-main: hsl(0, 0%, 95%);
    --text-muted: hsl(220, 10%, 60%);
    
    --danger: hsl(350, 80%, 60%);
    --success: hsl(150, 70%, 40%);
    
    --border: hsl(220, 14%, 25%);
    --radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background-color: var(--bg-main);
    color: var(--text-main);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* Layout */
  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Typography */
  h1, h2, h3 { font-weight: 600; letter-spacing: -0.02em; }
  h1 { font-size: 2rem; display: flex; align-items: center; gap: 0.75rem; }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.9rem;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--primary), hsl(290, 80%, 55%));
    color: white;
    box-shadow: 0 4px 15px var(--primary-glow);
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--primary-glow);
    filter: brightness(1.1);
  }
  
  .btn-secondary {
    background: var(--surface);
    color: var(--text-main);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover:not(:disabled) {
    background: var(--surface-hover);
    border-color: var(--text-muted);
  }
  
  .btn-danger {
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
  }
  .btn-danger:hover:not(:disabled) {
    background: var(--danger);
    color: white;
  }

  .btn-icon {
    padding: 0.5rem;
    border-radius: 6px;
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: var(--transition);
  }
  .btn-icon:hover {
    background: var(--surface-hover);
    color: var(--primary);
  }
  .btn-icon.delete:hover { color: var(--danger); }

  /* Inputs & Forms */
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.2rem; }
  .form-group label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); }
  
  .input-control {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-main);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: var(--transition);
    width: 100%;
    font-family: inherit;
  }
  .input-control:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-glow);
  }
  textarea.input-control { min-height: 100px; resize: vertical; }

  /* Header & Stats */
  .header-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--surface);
    padding: 1.5rem 2rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  .stats-container { display: flex; gap: 2rem; }
  .stat-box { display: flex; flex-direction: column; }
  .stat-value { font-size: 1.8rem; font-weight: 700; color: var(--primary); line-height: 1.1; }
  .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

  /* Filters Bar */
  .filters-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    background: var(--surface);
    padding: 1.2rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    align-items: end;
  }
  .input-with-icon { position: relative; }
  .input-with-icon svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; width: 18px; height: 18px; }
  .input-with-icon input, .input-with-icon select { padding-left: 2.5rem; }

  /* Plan Grid */
  .plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  /* Plan Card */
  .plan-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }
  .plan-card:hover {
    transform: scale(1.02);
    border-color: var(--primary);
    box-shadow: 0 0 20px var(--primary-glow);
    z-index: 10;
  }
  .card-header { margin-bottom: 1rem; }
  .card-subject { font-size: 0.75rem; font-weight: 600; color: var(--primary); text-transform: uppercase; margin-bottom: 0.25rem; }
  .card-title { font-size: 1.2rem; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-date { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-muted); }
  .card-body { flex: 1; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  
  .tags-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
  .tag-pill {
    background: hsla(var(--h-primary), var(--s-primary), var(--l-primary), 0.15);
    color: hsl(var(--h-primary), 80%, 75%);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  /* Smart Assist Overlay & Modals */
  .smart-assist-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .smart-assist-overlay.active {
    opacity: 1;
    pointer-events: all;
  }
  
  .ai-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--surface);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite, pulseGlow 2s ease-in-out infinite alternate;
    margin-bottom: 2rem;
  }

  .ai-message {
    font-size: 1.5rem;
    font-weight: 300;
    text-align: center;
    max-width: 600px;
    animation: fadeMessage 3s ease-in-out infinite;
    background: linear-gradient(90deg, #fff, var(--primary), #fff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulseGlow { to { box-shadow: 0 0 30px var(--primary-glow); } }
  @keyframes fadeMessage {
    0% { opacity: 0; transform: translateY(10px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  /* View Container (Form / Details) */
  .view-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  /* Utilities & Validation Errors */
  .error-message {
    background: hsla(350, 80%, 60%, 0.1);
    border: 1px solid var(--danger);
    color: var(--danger);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* Borda Vermelha no Input Inválido */
  .input-error {
    border-color: var(--danger) !important;
    box-shadow: 0 0 0 2px hsla(350, 80%, 60%, 0.2) !important;
  }
  
  /* Texto explicativo abaixo do Input Inválido */
  .field-error-text {
    color: var(--danger);
    font-size: 0.75rem;
    margin-top: 0.2rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-muted);
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    .app-container { padding: 1rem; }
    .header-panel { flex-direction: column; align-items: flex-start; }
    .stats-container { width: 100%; justify-content: space-between; }
    .btn { width: 100%; }
    .filters-bar { grid-template-columns: 1fr; }
  }
`;

const api = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });

    // Captura do corpo do erro enviado pela API
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const error = new Error(errData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errData; // Acopla o JSON de erro para acessarmos no catch
      throw error;
    }
    return await response.json();
  } catch (error) {
    // Apenas loga no console se não for um erro de "Failed to fetch" (servidor offline),
    // para não poluir o console desnecessariamente quando estamos apenas desconectados.
    if (error.name !== 'TypeError' || !error.message.includes('fetch')) {
      console.error(`[SGPA API Error] Falha na rota ${endpoint}:`, error);
    }
    throw error;
  }
};

const SmartAssistOverlay = ({ active }) => {
  const messages = [
    "Analisando o tema da sua aula...",
    "Consultando o assistente pedagógico...",
    "Estruturando conteúdos complementares...",
    "Mapeando recursos e ferramentas de apoio...",
    "Gerando tags de catalogação personalizadas..."
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (active) {
      setMsgIndex(0);
      interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className={`smart-assist-overlay ${active ? 'active' : ''}`}>
      <div className="ai-spinner"></div>
      <div className="ai-message" key={msgIndex}>
        {messages[msgIndex]}
      </div>
    </div>
  );
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return 'Sem data';
  const safeDateStr = dateString.length === 10 ? `${dateString}T12:00:00` : dateString;
  return new Date(safeDateStr).toLocaleDateString('pt-BR');
};

// Dicionário/Função para traduzir erros comuns de bibliotecas de validação de backend (ex: Pydantic)
const translateError = (msg) => {
  if (!msg) return "Campo inválido.";
  const lowerMsg = msg.toLowerCase();

  if (lowerMsg.includes("field required") || lowerMsg.includes("missing")) {
    return "Este campo é obrigatório.";
  }
  if (lowerMsg.includes("at least") || lowerMsg.includes("too_short")) {
    return "O texto inserido é muito curto.";
  }
  if (lowerMsg.includes("at most") || lowerMsg.includes("too_long")) {
    return "O limite de caracteres foi excedido.";
  }
  if (lowerMsg.includes("valid date") || lowerMsg.includes("datetime")) {
    return "Insira uma data válida.";
  }
  if (lowerMsg.includes("not a valid string") || lowerMsg.includes("string_type")) {
    return "O valor deve ser um texto válido.";
  }

  // Retorna a mensagem original se não houver mapeamento, mas você pode adicionar mais condições acima
  return msg;
};

export default function App() {
  const [view, setView] = useState('grid');
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({ total: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Form State and Error Control
  const [currentPlan, setCurrentPlan] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Stores validation errors for each field

  // Confirm Delete Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [filters, setFilters] = useState({
    title: '', subject: '', tags: '', scheduled_date: '', sort_by: 'created_at', sort_order: 'desc', page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [aiProcessing, setAiProcessing] = useState(false);

  const checkHealthAndLoad = async () => {
    try {
      await fetch('http://localhost:5000/health').then(res => res.ok ? res : Promise.reject());
      setBackendStatus('online');
    } catch (e) {
      setBackendStatus('offline');
      // Removemos o setError daqui para não forçar uma tela vermelha constante.
      // O aviso sutil "Desconectado do Backend" ao lado do título já avisa o usuário.
    }
    loadPlans();
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      params.append('_t', Date.now());

      const response = await api(`/lesson-plans?${params.toString()}`);
      setPlans(response.data || []);
      setTotalPages(response.pages || 1);

      const uniqueSubjects = new Set((response.data || []).map(p => p.subject).filter(Boolean));
      setStats({
        total: response.total || (response.data ? response.data.length : 0),
        subjects: uniqueSubjects.size
      });
      setError(null);
    } catch (err) {
      // Quando der erro de fetch, garante que a interface não quebre
      setPlans([]);
      setTotalPages(1);
      // Evita poluir a UI com erro genérico se for apenas offline, o cabeçalho já sinaliza.
      if (backendStatus === 'online') {
        setError("Falha ao carregar planos de aula.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateNew = () => {
    setCurrentPlan({
      title: '', subject: '', scheduled_date: '', objective: '',
      summary: '', content: '', support_materials: '', tags: ''
    });
    setFieldErrors({}); // Limpa erros antigos
    setError(null);
    setView('form');
  };

  const handleEdit = async (id) => {
    setLoading(true);
    setFieldErrors({});
    setError(null);
    try {
      const plan = await api(`/lesson-plans/${id}`);
      setCurrentPlan(plan);
      setView('form');
    } catch (e) {
      setError("Erro ao carregar detalhes do plano.");
    } finally { setLoading(false); }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const plan = await api(`/lesson-plans/${id}`);
      setCurrentPlan(plan);
      setView('details');
    } catch (e) {
      setError("Erro ao carregar detalhes.");
    } finally { setLoading(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setLoading(true);
    try {
      await api(`/lesson-plans/${deleteConfirmId}`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      loadPlans();
    } catch (e) {
      setError("Erro ao excluir plano.");
      setDeleteConfirmId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({}); // Reset error mapping
    setError(null);
    try {
      if (currentPlan.id) {
        await api(`/lesson-plans/${currentPlan.id}`, { method: 'PUT', body: JSON.stringify(currentPlan) });
      } else {
        await api(`/lesson-plans`, { method: 'POST', body: JSON.stringify(currentPlan) });
      }
      setView('grid');
      loadPlans();
    } catch (e) {
      // Captura erros de validação (400 ou 422) e mapeia os campos problemáticos
      if (e.status === 400 || e.status === 422) {
        const backendErrors = e.data?.errors || e.data?.detail || {};
        let mapped = {};

        // Pydantic FastAPI retorna um array 'detail'
        if (Array.isArray(backendErrors)) {
          backendErrors.forEach(err => {
            const field = err.loc[err.loc.length - 1]; // Pega o nome do campo
            mapped[field] = translateError(err.msg);   // Aplica a tradução
          });
        } else if (typeof backendErrors === 'object') {
          // Caso venha como um objeto simples { titulo: "error msg" }
          Object.keys(backendErrors).forEach(key => {
            mapped[key] = translateError(backendErrors[key]);
          });
        }

        setFieldErrors(mapped);
        setError("Não foi possível salvar. Verifique os campos destacados em vermelho.");
      } else {
        setError(e.message || "Erro de conexão ao salvar plano de aula.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setCurrentPlan({ ...currentPlan, [field]: value });
    // Se o campo tinha um erro, removemos o alerta visual assim que o usuário digita algo
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSmartAssist = async () => {
    if (!currentPlan.title || !currentPlan.subject || !currentPlan.summary) {
      setError("Smart Assist: Preencha Título, Disciplina e Resumo/Ementa primeiro.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setAiProcessing(true);
    setError(null);
    try {
      const response = await api('/smart-assist', {
        method: 'POST',
        body: JSON.stringify({
          title: currentPlan.title, subject: currentPlan.subject, summary: currentPlan.summary
        })
      });

      setCurrentPlan(prev => ({
        ...prev,
        content: response.suggested_content || prev.content,
        support_materials: response.related_topics || prev.support_materials,
        tags: response.tags || prev.tags
      }));
    } catch (e) {
      setError("Falha ao comunicar com a IA. Seus dados não foram perdidos.");
    } finally {
      setAiProcessing(false);
    }
  };

  const renderDashboardHeader = () => (
    <div className="header-panel">
      <div>
        <h1><BookOpen color="hsl(var(--h-primary), var(--s-primary), var(--l-primary))" /> SGPA</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          V-lab: Sistema de Gerenciamento de Planos de Aula
          {backendStatus === 'offline' && (
            <span style={{ marginLeft: '10px', color: 'var(--danger)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ServerCrash size={14} /> Desconectado do Backend
            </span>
          )}
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Planos Cadastrados</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{stats.subjects}</span>
          <span className="stat-label">Disciplinas Ativas</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleCreateNew}>
        <Plus size={18} /> Novo Plano de Aula
      </button>
    </div>
  );

  const renderFiltersBar = () => {
    const availableSubjects = [...new Set(plans.map(p => p.subject).filter(Boolean))];

    const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
      <div className="filters-bar">
        <div className="input-with-icon">
          <Search />
          <input type="text" className="input-control" placeholder="Buscar por título..."
            value={filters.title} onChange={e => handleFilterChange('title', e.target.value)} />
        </div>

        <div className="input-with-icon">
          <Filter />
          <select className="input-control" value={filters.subject}
            onChange={e => handleFilterChange('subject', e.target.value)}>
            <option value="">Todas as Disciplinas</option>
            {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>

        <div className="input-with-icon">
          <BookOpen />
          <input type="text" className="input-control" placeholder="Filtrar por tags..."
            value={filters.tags} onChange={e => handleFilterChange('tags', e.target.value)} />
        </div>

        <div className="input-with-icon">
          <Calendar />
          <input type="date" className="input-control"
            value={filters.scheduled_date} onChange={e => handleFilterChange('scheduled_date', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select className="input-control" style={{ flex: 1 }} value={filters.sort_by}
            onChange={e => handleFilterChange('sort_by', e.target.value)}>
            <option value="created_at">Data de Cadastro</option>
            <option value="scheduled_date">Data Programada</option>
            <option value="title">Título</option>
          </select>
          <button type="button" className="btn btn-secondary" style={{ padding: '0 0.8rem' }}
            onClick={() => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}>
            {filters.sort_order === 'asc' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </button>
        </div>
      </div>
    );
  };

  const renderPlanGrid = () => {
    if (loading) return <div className="empty-state"><Loader2 className="ai-spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }} /></div>;
    if (plans.length === 0) return <div className="empty-state">Nenhum plano de aula encontrado com os filtros atuais.</div>;

    const sortedPlans = [...plans].sort((a, b) => {
      let valA = a[filters.sort_by];
      let valB = b[filters.sort_by];

      if (filters.sort_by === 'scheduled_date' || filters.sort_by === 'created_at') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return filters.sort_order === 'asc' ? -1 : 1;
      if (valA > valB) return filters.sort_order === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <div className="plan-grid">
        {sortedPlans.map(plan => {
          const tagsArray = plan.tags ? plan.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
          const displayTags = tagsArray.slice(0, 3);
          const hasMoreTags = tagsArray.length > 3;

          return (
            <div key={plan.id} className="plan-card">
              <div className="card-header">
                <div className="card-subject">{plan.subject}</div>
                <h3 className="card-title" title={plan.title}>{plan.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.8rem' }}>
                  <div className="card-date" title="Data programada para a aula">
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    <span><strong>Aula:</strong> {formatDisplayDate(plan.scheduled_date)}</span>
                  </div>
                  <div className="card-date" title="Data em que o plano foi criado" style={{ opacity: 0.8 }}>
                    <Clock size={14} />
                    <span><strong>Cadastro:</strong> {plan.created_at ? new Date(plan.created_at).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {plan.summary || "Nenhum resumo fornecido para esta aula."}
              </div>

              <div className="tags-container">
                {displayTags.map((tag, idx) => <span key={idx} className="tag-pill">#{tag}</span>)}
                {hasMoreTags && <span className="tag-pill" style={{ opacity: 0.7 }}>+{tagsArray.length - 3}</span>}
              </div>

              <div className="card-actions">
                <button className="btn-icon" title="Visualizar" onClick={() => handleViewDetails(plan.id)}><Eye size={18} /></button>
                <button className="btn-icon" title="Editar" onClick={() => handleEdit(plan.id)}><Edit2 size={18} /></button>
                <button className="btn-icon delete" title="Excluir" onClick={() => setDeleteConfirmId(plan.id)}><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          className="btn btn-secondary" disabled={filters.page === 1 || loading}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          Anterior
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Página {filters.page} de {totalPages}
        </span>
        <button
          className="btn btn-secondary" disabled={filters.page === totalPages || loading}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          Próxima
        </button>
      </div>
    );
  };

  const renderConfirmModal = () => {
    if (!deleteConfirmId) return null;
    return (
      <div className="smart-assist-overlay active" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000 }}>
        <div className="view-container" style={{ maxWidth: '400px', textAlign: 'center', pointerEvents: 'auto' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Excluir Plano de Aula?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Esta ação é definitiva e não poderá ser desfeita.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)} disabled={loading}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleConfirmDelete} disabled={loading}>
              {loading ? <Loader2 className="ai-spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }} /> : 'Confirmar Exclusão'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Criar ou editar plano de aula.
  const renderForm = () => (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{currentPlan.id ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}</h2>
        <button className="btn btn-secondary" onClick={() => setView('grid')}><ArrowLeft size={18} /> Voltar</button>
      </div>

      {error && <div className="error-message"><AlertCircle size={20} /> {error}</div>}

      <form onSubmit={handleSaveForm} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Título da Aula *</label>
            <input required type="text"
              className={`input-control ${fieldErrors.title ? 'input-error' : ''}`}
              value={currentPlan.title}
              onChange={e => handleFieldChange('title', e.target.value)} />
            {fieldErrors.title && <span className="field-error-text"><X size={14} /> {fieldErrors.title}</span>}
          </div>
          <div className="form-group">
            <label>Disciplina *</label>
            <input required type="text"
              className={`input-control ${fieldErrors.subject ? 'input-error' : ''}`}
              value={currentPlan.subject}
              onChange={e => handleFieldChange('subject', e.target.value)} />
            {fieldErrors.subject && <span className="field-error-text"><X size={14} /> {fieldErrors.subject}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Data Programada</label>
            <input type="date"
              className={`input-control ${fieldErrors.scheduled_date ? 'input-error' : ''}`}
              value={currentPlan.scheduled_date ? currentPlan.scheduled_date.split('T')[0] : ''}
              onChange={e => handleFieldChange('scheduled_date', e.target.value)} />
            {fieldErrors.scheduled_date && <span className="field-error-text"><X size={14} /> {fieldErrors.scheduled_date}</span>}
          </div>
          <div className="form-group">
            <label>Objetivo da Aula</label>
            <input type="text"
              className={`input-control ${fieldErrors.objective ? 'input-error' : ''}`}
              value={currentPlan.objective || ''}
              onChange={e => handleFieldChange('objective', e.target.value)} />
            {fieldErrors.objective && <span className="field-error-text"><X size={14} /> {fieldErrors.objective}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Ementa / Resumo *</label>
          <textarea required
            className={`input-control ${fieldErrors.summary ? 'input-error' : ''}`} style={{ minHeight: '80px' }}
            value={currentPlan.summary || ''}
            onChange={e => handleFieldChange('summary', e.target.value)} />
          {fieldErrors.summary && <span className="field-error-text"><X size={14} /> {fieldErrors.summary}</span>}
        </div>

        {/* AI Action Area */}
        <div style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
          <div>
            <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Smart Assist
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gere automaticamente conteúdo, materiais e tags baseados no título, disciplina e resumo.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSmartAssist} disabled={aiProcessing}>
            Gerar com IA
          </button>
        </div>

        <div className="form-group">
          <label>Conteúdos</label>
          <textarea
            className={`input-control ${fieldErrors.content ? 'input-error' : ''}`} value={currentPlan.content || ''}
            onChange={e => handleFieldChange('content', e.target.value)} />
          {fieldErrors.content && <span className="field-error-text"><X size={14} /> {fieldErrors.content}</span>}
        </div>

        <div className="form-group">
          <label>Materiais de Apoio / Tópicos Relacionados</label>
          <textarea
            className={`input-control ${fieldErrors.support_materials ? 'input-error' : ''}`} style={{ minHeight: '60px' }} value={currentPlan.support_materials || ''}
            onChange={e => handleFieldChange('support_materials', e.target.value)} />
          {fieldErrors.support_materials && <span className="field-error-text"><X size={14} /> {fieldErrors.support_materials}</span>}
        </div>

        <div className="form-group">
          <label>Tags (separadas por vírgula)</label>
          <input type="text"
            className={`input-control ${fieldErrors.tags ? 'input-error' : ''}`} value={currentPlan.tags || ''}
            onChange={e => handleFieldChange('tags', e.target.value)} />
          {fieldErrors.tags && <span className="field-error-text"><X size={14} /> {fieldErrors.tags}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setView('grid')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="ai-spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }} /> : <Save size={18} />}
            Salvar Plano
          </button>
        </div>
      </form>
    </div>
  );

  // Exibir detalhes do plano de aula.
  const renderDetails = () => (
    <div className="view-container">
      <button className="btn btn-secondary" onClick={() => setView('grid')} style={{ marginBottom: '2rem' }}><ArrowLeft size={18} /> Voltar</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>{currentPlan.subject}</div>
          <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{currentPlan.title}</h2>
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Calendar size={16} /> {currentPlan.scheduled_date ? formatDisplayDate(currentPlan.scheduled_date) : 'Sem data agendada'}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setView('form')}><Edit2 size={18} /> Editar</button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Objetivo</h4>
          <p style={{ color: 'var(--text-muted)' }}>{currentPlan.objective || '-'}</p>
        </div>

        <div>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Resumo / Ementa</h4>
          <p style={{ color: 'var(--text-muted)' }}>{currentPlan.summary || '-'}</p>
        </div>

        <div>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Conteúdo Detalhado</h4>
          <pre style={{ color: 'var(--text-muted)', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{currentPlan.content || '-'}</pre>
        </div>

        <div>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Materiais de Apoio</h4>
          <p style={{ color: 'var(--text-muted)' }}>{currentPlan.support_materials || '-'}</p>
        </div>

        <div>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Tags</h4>
          <div className="tags-container" style={{ marginBottom: 0 }}>
            {currentPlan.tags ? currentPlan.tags.split(',').map((t, i) => (
              <span key={i} className="tag-pill">#{t.trim()}</span>
            )) : '-'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{globalStyles}</style>

      <div className="app-container">
        {view === 'grid' && (
          <>
            {renderDashboardHeader()}
            {renderFiltersBar()}
            {renderPlanGrid()}
            {renderPagination()}
          </>
        )}

        {view === 'form' && renderForm()}
        {view === 'details' && renderDetails()}
      </div>

      <SmartAssistOverlay active={aiProcessing} />
      {renderConfirmModal()}
    </>
  );
}