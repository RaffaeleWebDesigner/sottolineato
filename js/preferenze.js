// Preferenze dell'utente. Per ora: le categorie scelte nell'onboarding (sott-interessi).
import { store } from "./store.js";

export const interessi = () => store.get("sott-interessi", []) || [];
export function impostaInteressi(ids) { store.set("sott-interessi", [...new Set(ids)]); }
