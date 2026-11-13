// Vibrazione leggera dopo la risposta a un quiz. Nella fase 6 queste due funzioni verranno collegate
// alla vibrazione nativa di Capacitor; il resto del codice non cambia.
// Dove il browser non la supporta (iPhone) non succede nulla.
function vibra(schema) { try { navigator.vibrate?.(schema); } catch { /* non supportata */ } }

// Risposta giusta: una vibrazione breve e leggera.
export function gioia() { vibra(30); }

// Risposta sbagliata: due vibrazioni decise.
export function errore() { vibra([60, 40, 60]); }
