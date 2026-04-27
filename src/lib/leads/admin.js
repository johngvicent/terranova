import "server-only";

import { decrypt } from "@/lib/crypto";

function decryptValue(value) {
  if (!value) return null;

  try {
    return decrypt(value);
  } catch (error) {
    console.error("[decryptValue]", error);
    return null;
  }
}

export function getLeadContactInfo(lead) {
  return {
    email: decryptValue(lead?.email),
    telefono: decryptValue(lead?.telefono),
  };
}

export function serializeLeadForAdmin(lead) {
  if (!lead) return null;

  const { email, telefono } = getLeadContactInfo(lead);

  return {
    ...lead,
    email,
    telefono,
  };
}