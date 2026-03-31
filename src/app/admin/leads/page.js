"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STATUS_LABELS = {
  NUEVO: { label: "Nuevo", class: "bg-blue-100 text-blue-800" },
  CONTACTADO: { label: "Contactado", class: "bg-yellow-100 text-yellow-800" },
  EN_PROGRESO: { label: "En progreso", class: "bg-purple-100 text-purple-800" },
  CERRADO_GANADO: { label: "Ganado", class: "bg-green-100 text-green-800" },
  CERRADO_PERDIDO: { label: "Perdido", class: "bg-red-100 text-red-800" },
};

const URGENCY_LABELS = {
  ALTA: { label: "Alta", class: "bg-red-100 text-red-800" },
  MEDIA: { label: "Media", class: "bg-yellow-100 text-yellow-800" },
  BAJA: { label: "Baja", class: "bg-gray-100 text-gray-700" },
};

const CHANNEL_LABELS = {
  WEB: { label: "Web", class: "bg-blue-100 text-blue-800" },
  WHATSAPP: { label: "WhatsApp", class: "bg-green-100 text-green-800" },
  EMAIL: { label: "Email", class: "bg-purple-100 text-purple-800" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    estado: "",
    urgencia: "",
    canal: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [filters, page]);

  async function fetchLeads() {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (filters.estado) params.set("estado", filters.estado);
    if (filters.urgencia) params.set("urgencia", filters.urgencia);
    if (filters.canal) params.set("canal", filters.canal);

    try {
      const res = await fetch(`/api/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Leads</h1>
        {pagination && (
          <span className="text-sm text-text-muted">
            {pagination.total} leads en total
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filters.estado}
          onChange={(e) =>
            setFilters((f) => ({ ...f, estado: e.target.value }))
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.urgencia}
          onChange={(e) =>
            setFilters((f) => ({ ...f, urgencia: e.target.value }))
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas las urgencias</option>
          {Object.entries(URGENCY_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.canal}
          onChange={(e) =>
            setFilters((f) => ({ ...f, canal: e.target.value }))
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Todos los canales</option>
          {Object.entries(CHANNEL_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-text-muted">Nombre</th>
              <th className="px-4 py-3 font-medium text-text-muted">Canal</th>
              <th className="px-4 py-3 font-medium text-text-muted">Intención</th>
              <th className="px-4 py-3 font-medium text-text-muted">Urgencia</th>
              <th className="px-4 py-3 font-medium text-text-muted">Score</th>
              <th className="px-4 py-3 font-medium text-text-muted">Estado</th>
              <th className="px-4 py-3 font-medium text-text-muted">Agente</th>
              <th className="px-4 py-3 font-medium text-text-muted">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                  Cargando...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                  No se encontraron leads
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {lead.nombre} {lead.apellidos || ""}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge {...(CHANNEL_LABELS[lead.canal] || { label: lead.canal, class: "bg-gray-100 text-gray-700" })} />
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {lead.intencion?.replace(/_/g, " ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.urgencia ? (
                      <Badge {...URGENCY_LABELS[lead.urgencia]} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.score != null ? (
                      <ScoreBar score={lead.score} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge {...(STATUS_LABELS[lead.estado] || { label: lead.estado, class: "bg-gray-100 text-gray-700" })} />
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {lead.agente?.nombre || "Sin asignar"}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-sm text-text-muted px-3">
            Página {page} de {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

function Badge({ label, class: className }) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
    >
      {label}
    </span>
  );
}

function ScoreBar({ score }) {
  const color =
    score >= 70 ? "bg-red-500" : score >= 40 ? "bg-yellow-500" : "bg-gray-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-text-muted">{score}</span>
    </div>
  );
}
