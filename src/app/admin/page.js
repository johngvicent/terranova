import Link from "next/link";

async function getStats() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/leads/stats`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-8">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label="Leads Hoy"
          value={stats?.leadsHoy ?? "—"}
          color="bg-accent"
        />
        <KPICard
          label="Leads Esta Semana"
          value={stats?.leadsSemana ?? "—"}
          color="bg-primary"
        />
        <KPICard
          label="Total Leads"
          value={stats?.totalLeads ?? "—"}
          color="bg-primary-light"
        />
        <KPICard
          label="Tasa Conversión"
          value={stats?.tasaConversion != null ? `${stats.tasaConversion}%` : "—"}
          color="bg-green-600"
        />
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DistributionCard
          title="Por Estado"
          data={stats?.porEstado}
          colorMap={{
            NUEVO: "bg-blue-100 text-blue-800",
            CONTACTADO: "bg-yellow-100 text-yellow-800",
            EN_PROGRESO: "bg-purple-100 text-purple-800",
            CERRADO_GANADO: "bg-green-100 text-green-800",
            CERRADO_PERDIDO: "bg-red-100 text-red-800",
          }}
        />
        <DistributionCard
          title="Por Urgencia"
          data={stats?.porUrgencia}
          colorMap={{
            ALTA: "bg-red-100 text-red-800",
            MEDIA: "bg-yellow-100 text-yellow-800",
            BAJA: "bg-gray-100 text-gray-800",
            SIN_CLASIFICAR: "bg-gray-100 text-gray-500",
          }}
        />
        <DistributionCard
          title="Por Canal"
          data={stats?.porCanal}
          colorMap={{
            WEB: "bg-blue-100 text-blue-800",
            WHATSAPP: "bg-green-100 text-green-800",
            EMAIL: "bg-purple-100 text-purple-800",
          }}
        />
      </div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Ver todos los leads →
        </Link>
      </div>
    </div>
  );
}

function KPICard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="text-3xl font-heading font-bold text-text">{value}</p>
    </div>
  );
}

function DistributionCard({ title, data, colorMap }) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-text mb-4">{title}</h3>
        <p className="text-sm text-text-muted">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-text mb-4">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, count]) => (
          <div key={key} className="flex items-center justify-between">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                colorMap[key] || "bg-gray-100 text-gray-800"
              }`}
            >
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-semibold text-text">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
