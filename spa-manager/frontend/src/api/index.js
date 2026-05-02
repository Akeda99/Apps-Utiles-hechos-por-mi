const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

async function request(url, options = {}) {
  const token = localStorage.getItem('spa_token');
  const res = await fetch(BASE + url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  // Sesión expirada → redirigir a login
  if (res.status === 401) {
    localStorage.removeItem('spa_token');
    localStorage.removeItem('spa_user');
    window.location.href = '/login';
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error del servidor');
  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  // Empleados
  getEmployees:    ()         => request('/employees'),
  createEmployee:  (data)     => request('/employees',       { method: 'POST',   body: JSON.stringify(data) }),
  updateEmployee:  (id, data) => request(`/employees/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteEmployee:  (id)       => request(`/employees/${id}`, { method: 'DELETE' }),

  // Clientes
  getClients:       ()         => request('/clients'),
  getClientHistory: (id)       => request(`/clients/${id}/history`),
  createClient:     (data)     => request('/clients',       { method: 'POST',   body: JSON.stringify(data) }),
  updateClient:     (id, data) => request(`/clients/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteClient:     (id)       => request(`/clients/${id}`, { method: 'DELETE' }),

  // Servicios
  getServices:    ()         => request('/services'),
  createService:  (data)     => request('/services',       { method: 'POST',   body: JSON.stringify(data) }),
  updateService:  (id, data) => request(`/services/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteService:  (id)       => request(`/services/${id}`, { method: 'DELETE' }),

  // Atenciones
  getAppointments:   (params = {}) => request('/appointments?' + new URLSearchParams(params)),
  createAppointment: (data)        => request('/appointments',       { method: 'POST',   body: JSON.stringify(data) }),
  updateAppointment: (id, data)    => request(`/appointments/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteAppointment: (id)          => request(`/appointments/${id}`, { method: 'DELETE' }),

  // Agenda
  getSchedule:    (params = {}) => request('/schedule?' + new URLSearchParams(params)),
  createSchedule: (data)        => request('/schedule',       { method: 'POST',   body: JSON.stringify(data) }),
  updateSchedule: (id, data)    => request(`/schedule/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteSchedule: (id)          => request(`/schedule/${id}`, { method: 'DELETE' }),

  // Reportes (admin)
  getReportEmployees: (params = {}) => request('/reports/employees?' + new URLSearchParams(params)),
  getDailyIncome:     (params = {}) => request('/reports/daily-income?' + new URLSearchParams(params)),
  getTopServices:     ()            => request('/reports/top-services'),
  getSummary:         (params = {}) => request('/reports/summary?' + new URLSearchParams(params)),

  // Reporte personal (worker)
  getMySummary: () => request('/reports/my-summary'),

  // Cierre del día
  getDayClosing: (date) => request('/reports/day-closing' + (date ? `?date=${date}` : '')),

  // Gastos
  getExpenses:    (params = {}) => request('/expenses?' + new URLSearchParams(params)),
  createExpense:  (data)        => request('/expenses',       { method: 'POST',   body: JSON.stringify(data) }),
  updateExpense:  (id, data)    => request(`/expenses/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteExpense:  (id)          => request(`/expenses/${id}`, { method: 'DELETE' }),

  // Comisiones (alias de reportes con énfasis en comisión)
  getCommissions: (params = {}) => request('/reports/employees?' + new URLSearchParams(params)),
};
