/**
 * ISO 3166-1 alpha-2 codes, with names derived at runtime.
 *
 * Only the codes are stored. `Intl.DisplayNames` supplies the names, which
 * means they are always spelled the way the platform spells them and a
 * hand-maintained list cannot drift or go stale. The codes themselves change
 * roughly once a decade.
 */

const CODES = [
  "AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ",
  "BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR",
  "IO","BN","BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC",
  "CO","KM","CG","CD","CK","CR","CI","HR","CU","CW","CY","CZ","DK","DJ","DM","DO",
  "EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF",
  "GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY",
  "HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM",
  "JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY",
  "LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX",
  "FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI",
  "NE","NG","NU","NF","MK","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH",
  "PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC",
  "WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","GS",
  "SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK",
  "TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU",
  "VE","VN","VG","VI","WF","EH","YE","ZM","ZW",
] as const;

export interface Country {
  code: string;
  name: string;
}

let cached: Country[] | null = null;

export function allCountries(): Country[] {
  if (cached) return cached;

  const display = new Intl.DisplayNames(["en"], { type: "region" });
  cached = CODES.map((code) => ({
    code,
    // `of()` returns the code itself for anything it does not recognise, which
    // is a usable fallback rather than a blank row.
    name: display.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name));

  return cached;
}

/** Finds a country by name, case-insensitively. Used to seed the picker from
 *  the free-text values the projects were originally written with. */
export function findCountryByName(name: string | null | undefined): Country | undefined {
  if (!name) return undefined;
  const needle = name.trim().toLowerCase();
  return allCountries().find((c) => c.name.toLowerCase() === needle);
}
