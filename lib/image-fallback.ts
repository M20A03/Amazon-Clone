export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
      <rect width="400" height="400" rx="16" fill="#F8FAFC"/>
      <rect x="1" y="1" width="398" height="398" rx="15" stroke="#E2E8F0" stroke-width="2"/>
      <circle cx="200" cy="180" r="64" fill="#FEF3C7" fill-opacity="0.8"/>
      <path d="M175 160L200 145L225 160V195L200 210L175 195V160Z" stroke="#D97706" stroke-width="3" stroke-linejoin="round"/>
      <path d="M200 145V210" stroke="#D97706" stroke-width="2"/>
      <path d="M175 160L225 195" stroke="#D97706" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="200" y="270" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#475569">
        Prime Verified Product
      </text>
      <text x="200" y="292" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#94A3B8">
        Secure Fulfillment
      </text>
    </svg>
  `);
