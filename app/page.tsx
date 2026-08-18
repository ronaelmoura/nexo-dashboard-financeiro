"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Eye,
  EyeOff,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Transaction = {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  kind: "income" | "expense";
  color: string;
  initials: string;
};

const monthlyData = [
  { month: "Mar", receitas: 11200, despesas: 7600 },
  { month: "Abr", receitas: 12400, despesas: 8150 },
  { month: "Mai", receitas: 11900, despesas: 6900 },
  { month: "Jun", receitas: 13700, despesas: 9200 },
  { month: "Jul", receitas: 14200, despesas: 7850 },
  { month: "Ago", receitas: 14840, despesas: 8295 },
];

const expenses = [
  { name: "Moradia", value: 2950, color: "#2525e8" },
  { name: "Alimentação", value: 1810, color: "#7857ff" },
  { name: "Transporte", value: 1245, color: "#18a6a6" },
  { name: "Lazer", value: 990, color: "#f1a43b" },
  { name: "Outros", value: 1300, color: "#d8d8e8" },
];

const initialTransactions: Transaction[] = [
  { id: 1, title: "Salário mensal", category: "Receita", date: "Hoje, 09:42", amount: 9800, kind: "income", color: "green", initials: "SM" },
  { id: 2, title: "Supermercado Mambo", category: "Alimentação", date: "Hoje, 08:15", amount: -348.72, kind: "expense", color: "orange", initials: "SM" },
  { id: 3, title: "Aluguel", category: "Moradia", date: "Ontem, 14:30", amount: -2850, kind: "expense", color: "purple", initials: "AL" },
  { id: 4, title: "Uber", category: "Transporte", date: "12 ago, 19:20", amount: -42.9, kind: "expense", color: "blue", initials: "UB" },
  { id: 5, title: "Netflix", category: "Lazer", date: "11 ago, 10:00", amount: -55.9, kind: "expense", color: "red", initials: "N" },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.name}><i style={{ background: item.color }} />{item.name}: {currency.format(item.value)}</span>
      ))}
    </div>
  );
}

export default function Home() {
  const [period, setPeriod] = useState("6 meses");
  const [category, setCategory] = useState("Todas as categorias");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexo-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    // localStorage/matchMedia are unavailable during SSR, so the real theme
    // can only be resolved after mount; setting it here (once) avoids a
    // hydration mismatch instead of computing it at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("nexo-theme", theme);
  }, [theme]);

  const chartData = useMemo(() => {
    if (period === "3 meses") return monthlyData.slice(-3);
    if (period === "Este mês") return monthlyData.slice(-1);
    return monthlyData;
  }, [period]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = category === "Todas as categorias" || transaction.category === category;
    const matchesSearch = transaction.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "Nova transação");
    const amount = Number(form.get("amount"));
    const kind = String(form.get("kind")) as "income" | "expense";
    const newTransaction: Transaction = {
      id: Date.now(), title, category: kind === "income" ? "Receita" : "Outros", date: "Agora",
      amount: kind === "income" ? amount : -amount, kind, color: kind === "income" ? "green" : "blue", initials: title.slice(0, 2).toUpperCase(),
    };
    setTransactions((current) => [newTransaction, ...current]);
    setModalOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className={mobileMenu ? "sidebar open" : "sidebar"}>
        <div className="brand"><span className="brand-mark"><TrendingUp size={18} /></span><span>Nexo</span></div>
        <button className="sidebar-close" aria-label="Fechar menu" onClick={() => setMobileMenu(false)}><X size={20} /></button>
        <nav className="nav-menu" aria-label="Navegação principal">
          <a className="active" href="#overview"><LayoutDashboard size={19} /> Visão geral</a>
          <a href="#transactions"><ArrowDownLeft size={19} /> Transações</a>
          <a href="#accounts"><WalletCards size={19} /> Contas</a>
          <a href="#cards"><CreditCard size={19} /> Cartões</a>
          <a href="#goals"><Target size={19} /> Metas</a>
        </nav>
        <div className="sidebar-bottom">
          <a href="#settings"><Settings size={19} /> Configurações</a>
          <div className="profile-card">
            <div className="avatar">RC</div>
            <div><strong>Rafael Costa</strong><span>Plano Essencial</span></div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" aria-label="Abrir menu" onClick={() => setMobileMenu(true)}><Menu size={22} /></button>
          <div className="mobile-brand">Nexo</div>
          <label className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar transações..." /></label>
          <button className="icon-button theme-button" aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} title={theme === "dark" ? "Modo claro" : "Modo escuro"} onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className="icon-button" aria-label="Notificações"><Bell size={20} /><span className="notification-dot" /></button>
          <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={18} /> Nova transação</button>
        </header>

        <div className="content" id="overview">
          <section className="page-heading">
            <div><p className="eyebrow">SEXTA-FEIRA, 14 DE AGOSTO</p><h1>Olá, Rafael <span>👋</span></h1><p>Veja como está a sua vida financeira hoje.</p></div>
            <div className="filters">
              <label><span>Período</span><select value={period} onChange={(e) => setPeriod(e.target.value)}><option>Este mês</option><option>3 meses</option><option>6 meses</option></select><ChevronDown size={14} /></label>
              <label><span>Categoria</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todas as categorias</option><option>Moradia</option><option>Alimentação</option><option>Transporte</option><option>Lazer</option><option>Receita</option></select><ChevronDown size={14} /></label>
            </div>
          </section>

          <section className="summary-grid" aria-label="Resumo financeiro">
            <article className="metric-card balance-card">
              <div className="metric-top"><span className="metric-icon balance"><WalletCards size={20} /></span><button aria-label={balanceVisible ? "Ocultar saldo" : "Mostrar saldo"} onClick={() => setBalanceVisible(!balanceVisible)}>{balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}</button></div>
              <span>Saldo total</span><strong>{balanceVisible ? "R$ 24.580,90" : "••••••••"}</strong><small><b>+8,4%</b> em relação ao mês passado</small>
            </article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon income"><ArrowUpRight size={20} /></span><span className="tag positive">+5,2%</span></div><span>Receitas</span><strong>R$ 14.840,00</strong><small>R$ 740,00 a mais que em julho</small></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon expense"><ArrowDownLeft size={20} /></span><span className="tag negative">+2,1%</span></div><span>Despesas</span><strong>R$ 8.295,40</strong><small>56% da sua receita mensal</small></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon saved"><CircleDollarSign size={20} /></span><span className="tag positive">+12,7%</span></div><span>Economia do mês</span><strong>R$ 6.544,60</strong><small>44% da sua receita mensal</small></article>
          </section>

          <section className="charts-grid">
            <article className="panel cashflow-panel">
              <div className="panel-heading"><div><h2>Fluxo de caixa</h2><p>Receitas e despesas no período</p></div><div className="legend"><span><i className="income-dot" /> Receitas</span><span><i className="expense-dot" /> Despesas</span></div></div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                    <defs><linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2525e8" stopOpacity={0.25}/><stop offset="100%" stopColor="#2525e8" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid vertical={false} stroke={theme === "dark" ? "#30303d" : "#ececf2"} strokeDasharray="3 3" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme === "dark" ? "#9696a7" : "#8b8b99", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === "dark" ? "#9696a7" : "#8b8b99", fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#2525e8" fill="url(#incomeGradient)" strokeWidth={3} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#18a6a6" fill="transparent" strokeWidth={2.5} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel expenses-panel">
              <div className="panel-heading"><div><h2>Despesas por categoria</h2><p>Distribuição no mês atual</p></div><button aria-label="Mais opções"><MoreHorizontal size={20}/></button></div>
              <div className="donut-layout">
                <div className="donut-chart">
                  <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expenses} dataKey="value" innerRadius={58} outerRadius={78} paddingAngle={3} stroke="none">{expenses.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => currency.format(Number(value))} /></PieChart></ResponsiveContainer>
                  <div className="donut-center"><strong>R$ 8,2k</strong><span>Total</span></div>
                </div>
                <div className="category-list">{expenses.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><strong>{currency.format(item.value)}</strong></div>)}</div>
              </div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel transactions-panel" id="transactions">
              <div className="panel-heading"><div><h2>Transações recentes</h2><p>{filteredTransactions.length} movimentações encontradas</p></div><button className="text-button" onClick={() => { setCategory("Todas as categorias"); setSearch(""); }}>Ver todas</button></div>
              <div className="transaction-list">
                {filteredTransactions.length ? filteredTransactions.slice(0, 5).map((transaction) => (
                  <div className="transaction" key={transaction.id}><span className={`transaction-icon ${transaction.color}`}>{transaction.initials}</span><div><strong>{transaction.title}</strong><span>{transaction.category} • {transaction.date}</span></div><strong className={transaction.kind}>{transaction.amount > 0 ? "+ " : "− "}{currency.format(Math.abs(transaction.amount))}</strong>
                  </div>
                )) : <div className="empty-state">Nenhuma transação encontrada.</div>}
              </div>
            </article>

            <article className="panel goal-panel" id="goals">
              <div className="panel-heading"><div><h2>Meta de economia</h2><p>Reserva de emergência</p></div><span className="goal-badge">2026</span></div>
              <div className="goal-amount"><strong>R$ 18.500</strong><span>de R$ 30.000</span></div>
              <div className="progress-track"><span /></div>
              <div className="goal-meta"><span><b>62%</b> concluído</span><span>Faltam <b>R$ 11.500</b></span></div>
              <div className="monthly-progress"><div><Target size={18}/><span><b>R$ 1.250</b> guardados em agosto</span></div><span>83% da meta mensal</span></div>
            </article>
          </section>
        </div>
      </main>

      {mobileMenu && <button className="backdrop" aria-label="Fechar menu" onClick={() => setMobileMenu(false)} />}
      {modalOpen && (
        // Mouse-only convenience for closing on backdrop click; the
        // keyboard/AT-accessible close path is the button below.
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <form className="modal" onSubmit={addTransaction} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header"><div><h2>Nova transação</h2><p>Registre uma entrada ou saída.</p></div><button type="button" aria-label="Fechar" onClick={() => setModalOpen(false)}><X size={20}/></button></div>
            <label>Descrição<input name="title" required placeholder="Ex.: Compra no mercado" /></label>
            <label>Valor<input name="amount" required min="0.01" step="0.01" type="number" placeholder="0,00" /></label>
            <label>Tipo<select name="kind"><option value="expense">Despesa</option><option value="income">Receita</option></select></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button className="primary-button" type="submit">Adicionar transação</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
