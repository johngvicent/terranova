"use client";

import { useState, useRef } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = formRef.current;
    const data = {
      nombre: form.name.value,
      apellidos: form.lastname.value,
      email: form.email.value,
      telefono: form.phone.value,
      interes: form.interest.value,
      mensaje: form.message.value,
      privacidad: form.privacy.checked,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error || "Error al enviar el mensaje");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Inténtalo de nuevo.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nombre" id="name" type="text" required placeholder="Tu nombre" />
        <Field label="Apellidos" id="lastname" type="text" placeholder="Tus apellidos" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Correo electrónico" id="email" type="email" required placeholder="correo@ejemplo.com" />
        <Field label="Teléfono" id="phone" type="tel" placeholder="+34 600 000 000" />
      </div>

      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
          Tipo de interés
        </label>
        <select
          id="interest"
          name="interest"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#003e3c] focus:border-transparent transition-shadow"
        >
          <option value="">Seleccionar...</option>
          <option value="compra">Comprar una propiedad</option>
          <option value="alquiler">Alquilar una propiedad</option>
          <option value="vender">Vender mi propiedad</option>
          <option value="info">Solicitar información general</option>
          <option value="reserva">Reservar visita</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
          Mensaje <span className="text-[#e35336]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Cuéntanos qué estás buscando..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] resize-none focus:outline-none focus:ring-2 focus:ring-[#003e3c] focus:border-transparent transition-shadow"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="privacy"
          name="privacy"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[#003e3c] cursor-pointer"
        />
        <label htmlFor="privacy" className="text-xs text-[#6b7280] leading-relaxed">
          Acepto la{" "}
          <span className="text-[#003e3c] font-medium underline cursor-pointer">
            política de privacidad
          </span>{" "}
          y el tratamiento de mis datos personales para gestionar mi consulta.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 rounded-full bg-[#e35336] hover:bg-[#c44729] text-white font-semibold text-base transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e35336] focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>

      {status === "success" && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 flex items-center gap-3">
          <span className="text-green-500 text-lg">✓</span>
          <span>
            ¡Mensaje enviado! Nos pondremos en contacto contigo en menos de 24 horas.
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 flex items-center gap-3">
          <span className="text-red-500 text-lg">✗</span>
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
}

function Field({ label, id, type, required, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {label} {required && <span className="text-[#e35336]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003e3c] focus:border-transparent transition-shadow"
      />
    </div>
  );
}
