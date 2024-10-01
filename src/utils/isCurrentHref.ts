export const isCurrentHref = (href: string | URL) =>
  location.href ===
  (typeof href === 'string' ? new URL(href, location.origin) : href).href;
