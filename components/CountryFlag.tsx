/** Renders an emoji flag from an ISO 3166-1 alpha-2 country code. */
export function CountryFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const flag = code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  return (
    <span className={className} role="img" aria-label={`${code} flag`}>
      {flag}
    </span>
  );
}
