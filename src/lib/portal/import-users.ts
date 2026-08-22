// ============================================================================
// EXCEL ACCOUNT IMPORT — parser for the admin bulk-import sheet.
// First sheet, first row = headers (case/spacing insensitive, EN/NL synonyms).
// Used by /api/portal/users/import; unit-tested via scripts (transpiled).
// ============================================================================
import { randomBytes } from 'crypto';
import * as XLSX from 'xlsx';
import { normalizeAccountType, PRICE_MARKETS } from './types';

export type ImportRow = {
  email: string;
  password: string;
  passwordGenerated: boolean;
  company: string | null;
  contactName: string | null;
  phone: string | null;
  vat: string | null;
  country: string | null;
  city: string | null;
  office: string | null;
  accountType: 'producer' | 'installer' | 'b2c' | 'architect';
  markets: string[];
  allMarkets: boolean;
};

export const MAX_ROWS = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


/** "Contact name" / "contact_name" / "CONTACT" → 'contact' etc. */
function normHeader(h: unknown): string {
  return String(h ?? '').toLowerCase().replace(/[^a-z]/g, '');
}

const HEADER_MAP: Record<string, string> = {
  email: 'email', emailaddress: 'email', mail: 'email',
  password: 'password', temppassword: 'password', temporarypassword: 'password',
  company: 'company', companyname: 'company', bedrijf: 'company',
  contact: 'contact', contactname: 'contact', contactperson: 'contact', name: 'contact', naam: 'contact',
  phone: 'phone', telephone: 'phone', tel: 'phone', telefoon: 'phone',
  vat: 'vat', vatnumber: 'vat', btw: 'vat',
  country: 'country', land: 'country',
  city: 'city', stad: 'city',
  office: 'office',
  type: 'type', accounttype: 'type', tier: 'type',
  markets: 'markets', market: 'markets', pricegroups: 'markets', pricegroup: 'markets',
};

function canonicalMarket(v: string): string | null {
  const s = v.trim().toLowerCase();
  if (!s) return null;
  if (s.includes('producer') || s.includes('reseller')) return 'Producer/Reseller';
  if (s.includes('installer')) return 'Installer';
  if (s === 'b2c' || s.includes('private')) return 'B2C';
  const exact = (PRICE_MARKETS as readonly string[]).find((m) => m.toLowerCase() === s);
  return exact ?? null;
}

function generatePassword(): string {
  // 12 chars from a homoglyph-free alphabet — typed by clients, so no 0/O/1/l.
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(12);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

export function parseRows(buffer: Buffer): { rows: ImportRow[]; problems: { row: number; email: string; reason: string }[] } {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return { rows: [], problems: [{ row: 0, email: '', reason: 'The file has no sheets.' }] };
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  const rows: ImportRow[] = [];
  const problems: { row: number; email: string; reason: string }[] = [];
  raw.slice(0, MAX_ROWS + 50).forEach((r, i) => {
    // Map whatever headers the sheet uses onto our canonical field names.
    const rec: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      const key = HEADER_MAP[normHeader(k)];
      if (key && !(key in rec)) rec[key] = String(v ?? '').trim();
    }
    const rowNo = i + 2; // 1-based + header row
    const email = (rec.email ?? '').toLowerCase();
    if (!email) {
      // Fully empty line → ignore; data without an email → report it.
      if (Object.values(rec).some(Boolean)) {
        problems.push({ row: rowNo, email: '', reason: 'Missing email address.' });
      }
      return;
    }
    if (!EMAIL_RE.test(email)) {
      problems.push({ row: rowNo, email, reason: 'Invalid email address.' });
      return;
    }
    let password = rec.password ?? '';
    let passwordGenerated = false;
    if (!password) {
      password = generatePassword();
      passwordGenerated = true;
    } else if (password.length < 8) {
      problems.push({ row: rowNo, email, reason: 'Password shorter than 8 characters.' });
      return;
    }
    const accountType = normalizeAccountType((rec.type ?? '').toLowerCase() || 'installer');
    const marketsRaw = (rec.markets ?? '').trim();
    const allMarkets = /^all/i.test(marketsRaw);
    // "Producer/Reseller" may split on its own slash — canonicalMarket maps
    // both halves back to the same market, the Set dedupes.
    const markets = allMarkets
      ? []
      : [...new Set(marketsRaw.split(/[,;|/]+/).map(canonicalMarket).filter((m): m is string => Boolean(m)))];
    rows.push({
      email,
      password,
      passwordGenerated,
      company: rec.company || null,
      contactName: rec.contact || null,
      phone: rec.phone || null,
      vat: rec.vat || null,
      country: (rec.country || '').toUpperCase().slice(0, 8) || null,
      city: rec.city || null,
      office: rec.office || null,
      accountType,
      markets,
      allMarkets,
    });
  });
  return { rows, problems };
}
