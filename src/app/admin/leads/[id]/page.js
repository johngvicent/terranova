"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  async function fetchLead() {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        setLead(await res.json());
      }
    } catch (err) {
      console.error("Error fetching lead:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(estado) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        setLead((prev) => ({ ...prev, estado }));
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        Cargando...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted mb-4">Lead no encontrado</p>
        <Link href="/admin/leads" className="text-primary hover:underline">
          ← Volver a leads
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/admin/leads" className="hover:text-primary">
          Leads
        </Link>
        <span>/</span>
        <span className="text-text">{lead.nombre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-heading font-bold text-text">
                  {lead.nombre} {lead.apellidos || ""}
                </h1>
                <p className="text-sm text-text-muted mt-1">
                  {lead.canal} · {new Date(lead.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
              {lead.score != null && (
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    lead.score >= 70
                      ? "bg-red-500"
                      : lead.score >= 40
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                >
                  {lead.score}
                </div>
              )}
            </div>

            {/* AI Summary */}
            {lead.resumenIA && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-text-muted mb-1">
                  Resumen IA
                </p>
                <p className="text-sm text-text">{lead.resumenIA}</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {lead.intencion && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {lead.intencion}
                </span>
              )}
              {lead.urgencia && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    lead.urgencia === "ALTA"
                      ? "bg-red-100 text-red-800"
                      : lead.urgencia === "MEDIA"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Urgencia: {lead.urgencia}
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-text mb-4">
              Historial de mensajes ({lead.mensajes?.length || 0})
            </h2>
            <div className="space-y-4">
              {lead.mensajes?.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg p-4 ${
                    msg.direccion === "INBOUND"
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium ${
                        msg.direccion === "INBOUND"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {msg.direccion === "INBOUND" ? "← Recibido" : "→ Enviado"}
                    </span>
                    <span className="text-xs text-text-muted">
                      {msg.canal} ·{" "}
                      {new Date(msg.createdAt).toLocaleString("es-ES")}
                    </span>
                  </div>
                  <p className="text-sm text-text whitespace-pre-wrap">
                    {msg.contenido}
                  </p>
                </div>
              ))}
              {(!lead.mensajes || lead.mensajes.length === 0) && (
                <p className="text-sm text-text-muted">Sin mensajes</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-text mb-3">Estado</h3>
            <div className="space-y-2">
              {[
                "NUEVO",
                "CONTACTADO",
                "EN_PROGRESO",
                "CERRADO_GANADO",
                "CERRADO_PERDIDO",
              ].map((estado) => (
                <button
                  key={estado}
                  onClick={() => updateStatus(estado)}
                  disabled={updating || lead.estado === estado}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    lead.estado === estado
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-gray-100 text-text-muted"
                  } disabled:opacity-60`}
                >
                  {estado.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Agent assignment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-text mb-3">
              Agente Asignado
            </h3>
            <p className="text-sm text-text-muted">
              {lead.agente?.nombre || "Sin asignar"}
            </p>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-text mb-3">
              Contacto
            </h3>
            <div className="space-y-2 text-sm">
              {lead.email && (
                <p className="text-text-muted">
                  <span className="font-medium text-text">Email:</span>{" "}
                  {lead.email}
                </p>
              )}
              {lead.telefono && (
                <p className="text-text-muted">
                  <span className="font-medium text-text">Teléfono:</span>{" "}
                  {lead.telefono}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
