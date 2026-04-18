import React, { useMemo, useState } from 'react';

const incidents = [
  { id: 'INC-001', type: 'Phishing', source: 'secure-banc0-verif.com', severity: 'Crítico', status: 'Abierto', date: '2026-04-14 09:41', score: 97 },
  { id: 'INC-002', type: 'Log SSH', source: 'auth.log', severity: 'Alto', status: 'En análisis', date: '2026-04-14 10:12', score: 83 },
  { id: 'INC-003', type: 'Phishing', source: 'paypa1-center.net', severity: 'Alto', status: 'Abierto', date: '2026-04-14 10:44', score: 91 },
  { id: 'INC-004', type: 'Log Linux', source: 'journalctl', severity: 'Medio', status: 'Controlado', date: '2026-04-14 11:05', score: 58 }
];

const logRows = [
  { date: '2026-04-14 09:11', user: 'root', action: 'ssh login', result: 'fallido', risk: 'Medio' },
  { date: '2026-04-14 09:14', user: 'root', action: 'ssh login', result: 'fallido', risk: 'Medio' },
  { date: '2026-04-14 09:18', user: 'admin', action: 'sudo access', result: 'exitoso', risk: 'Bajo' }
];

const users = [
  { name: 'Alejandra', email: 'soc@centinelax.ai', role: 'Analista SOC', status: 'Activo' },
  { name: 'Carlos', email: 'linux@centinelax.ai', role: 'Administrador Linux', status: 'Activo' },
  { name: 'María', email: 'admin@centinelax.ai', role: 'Administrador', status: 'Activo' }
];

const correlations = [
  { title: 'URL maliciosa', detail: 'Dominio con typosquatting bancario' },
  { title: 'Coincidencia TI', detail: 'URLHaus y PhishTank positivos' },
  { title: 'Intentos SSH', detail: '15 intentos fallidos para root' },
  { title: 'Alerta correlacionada', detail: 'Riesgo compuesto alto' }
];

function Pill({ children, tone = 'default' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Card({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-head">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function Sidebar({ current, setCurrent }) {
  const items = [
    ['dashboard', 'Dashboard'],
    ['url', 'Análisis URL'],
    ['incidents', 'Incidentes'],
    ['logs', 'Logs Linux'],
    ['correlation', 'Correlación'],
    ['users', 'Usuarios'],
    ['profile', 'Perfil'],
    ['login', 'Login']
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">CX</div>
        <div>
          <strong>CentinelaX</strong>
          <span>AI Security</span>
        </div>
      </div>

      <nav className="nav">
        {items.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={current === key ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrent(key)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Header({ title, subtitle }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-actions">
        <button type="button" className="btn btn-secondary">Filtros</button>
        <button type="button" className="btn btn-primary">Nuevo análisis</button>
      </div>
    </header>
  );
}

function DashboardView() {
  const kpis = [
    ['Incidentes', '24', 'Total semanal'],
    ['Críticos', '5', 'Requieren acción'],
    ['Riesgo', '72/100', 'Score promedio'],
    ['Fuentes TI', '3', 'Activas']
  ];

  return (
    <>
      <Header title="Dashboard" subtitle="Resumen operativo y visual del entorno CentinelaX." />

      <div className="grid grid-4">
        {kpis.map(([label, value, sub]) => (
          <Card key={label} className="kpi-card">
            <span className="muted small">{label}</span>
            <strong className="kpi-value">{value}</strong>
            <span className="muted small">{sub}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-2">
        <Card title="Tendencia de incidentes" subtitle="Evolución semanal">
          <div className="chart-box">
            <div className="line blue"></div>
            <div className="line orange"></div>
          </div>
        </Card>

        <Card title="Distribución de severidad" subtitle="Vista consolidada">
          <div className="donut"></div>
        </Card>
      </div>

      <Card title="Incidentes recientes" subtitle="Eventos priorizados">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Severidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {incidents.slice(0, 3).map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>
                  <Pill tone={item.severity === 'Crítico' ? 'critical' : 'high'}>
                    {item.severity}
                  </Pill>
                </td>
                <td>{item.status}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function UrlView() {
  const [url, setUrl] = useState('https://secure-banc0-verif.com/login');

  const result = useMemo(() => {
    const suspicious = /secure|verif|banc0|paypa1|login/i.test(url);
    return suspicious
      ? {
          label: 'Phishing',
          score: 91,
          risk: 'Alto',
          reasons: [
            'Dominio con typosquatting bancario',
            'Ruta asociada a captura de credenciales',
            'Coincidencia parcial con threat intelligence'
          ]
        }
      : {
          label: 'Legítima',
          score: 14,
          risk: 'Bajo',
          reasons: ['No se detectaron indicadores de riesgo relevantes']
        };
  }, [url]);

  return (
    <>
      <Header title="Análisis de URL" subtitle="Detección de phishing asistida por IA." />

      <Card>
        <div className="form-inline">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
          <button type="button" className="btn btn-primary">Analizar</button>
        </div>
      </Card>

      <div className="grid grid-3">
        <Card>
          <span className="muted small">Clasificación</span>
          <strong className="kpi-value medium">{result.label}</strong>
        </Card>
        <Card>
          <span className="muted small">Score</span>
          <strong className="kpi-value medium">{result.score}/100</strong>
        </Card>
        <Card>
          <span className="muted small">Riesgo</span>
          <strong className="kpi-value medium">{result.risk}</strong>
        </Card>
      </div>

      <div className="grid grid-2">
        <Card title="Explicación del resultado">
          <ul className="list">
            {result.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </Card>

        <Card title="Threat Intelligence">
          <ul className="list">
            <li>URLHaus: coincidencia parcial</li>
            <li>PhishTank: señal positiva</li>
            <li>Abuse.ch: reputación sospechosa</li>
          </ul>
        </Card>
      </div>
    </>
  );
}

function IncidentsView() {
  return (
    <>
      <Header title="Incidentes" subtitle="Consola operativa para investigación y priorización." />

      <Card>
        <div className="toolbar">
          <input placeholder="Buscar incidente" />
          <button type="button" className="btn btn-secondary">Filtrar</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Origen</th>
              <th>Severidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.source}</td>
                <td>
                  <Pill tone={item.severity === 'Crítico' ? 'critical' : item.severity === 'Alto' ? 'high' : 'medium'}>
                    {item.severity}
                  </Pill>
                </td>
                <td>{item.status}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function LogsView() {
  return (
    <>
      <Header title="Logs Linux" subtitle="Monitoreo de eventos y anomalías de infraestructura." />

      <Card>
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Resultado</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {logRows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                <td>{row.user}</td>
                <td>{row.action}</td>
                <td>{row.result}</td>
                <td>
                  <Pill tone={row.risk === 'Bajo' ? 'low' : 'medium'}>
                    {row.risk}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="warn-card" title="Insight IA">
        <p>Posible patrón de brute force detectado por múltiples intentos fallidos sobre el usuario root.</p>
      </Card>
    </>
  );
}

function CorrelationView() {
  return (
    <>
      <Header title="Correlación" subtitle="Relación de eventos entre dominios Web, TI y Linux." />

      <Card>
        <div className="scorebar">
          <div>
            <span className="muted small">Score del caso</span>
            <strong className="kpi-value medium">88/100</strong>
          </div>
          <div>
            <span className="muted small">Riesgo compuesto</span>
            <strong className="kpi-value medium">Alto</strong>
          </div>
        </div>

        <div className="timeline">
          {correlations.map((item, idx) => (
            <div className="timeline-item" key={item.title}>
              <div className="timeline-dot">{idx + 1}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function UsersView() {
  return (
    <>
      <Header title="Usuarios y roles" subtitle="Gestión de acceso y permisos del sistema." />

      <Card>
        <div className="toolbar end">
          <button type="button" className="btn btn-primary">Crear usuario</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td><Pill tone="low">{u.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function ProfileView() {
  return (
    <>
      <Header title="Perfil" subtitle="Información del usuario autenticado y preferencias básicas." />

      <div className="grid grid-2">
        <Card title="Información general">
          <p><strong>Nombre:</strong> Alejandro Ramírez</p>
          <p><strong>Email:</strong> soc@centinelax.ai</p>
          <p><strong>Rol:</strong> Analista SOC</p>
        </Card>

        <Card title="Preferencias">
          <p>Idioma: Español</p>
          <p>Tema: Claro</p>
          <p>Notificaciones: Activadas</p>
        </Card>
      </div>
    </>
  );
}

function LoginView() {
  return (
    <div className="login-page">
      <section className="login-hero">
        <span className="chip">CentinelaX AI</span>
        <h1>Plataforma inteligente multidominio para ciberseguridad.</h1>
        <p>Accede al dashboard, analiza URLs sospechosas, revisa incidentes y consolida tu operación de seguridad.</p>
      </section>

      <section className="login-card">
        <h2>Acceso al sistema</h2>
        <p className="muted">Demo visual local</p>
        <label>
          Correo
          <input defaultValue="soc@centinelax.ai" />
        </label>
        <label>
          Contraseña
          <input type="password" defaultValue="123456" />
        </label>
        <button type="button" className="btn btn-primary">Iniciar sesión</button>
      </section>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState('dashboard');

  return (
    <div className="app-shell">
      <Sidebar current={current} setCurrent={setCurrent} />

      <main className="content">
        {current === 'dashboard' && <DashboardView />}
        {current === 'url' && <UrlView />}
        {current === 'incidents' && <IncidentsView />}
        {current === 'logs' && <LogsView />}
        {current === 'correlation' && <CorrelationView />}
        {current === 'users' && <UsersView />}
        {current === 'profile' && <ProfileView />}
        {current === 'login' && <LoginView />}
      </main>
    </div>
  );
}
