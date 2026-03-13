/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [],
  },

  /**
   * Security headers.
   * X-Frame-Options is NOT applied to /virtual-tour (iframe must be embeddable there).
   * CSP is intentionally permissive for 'unsafe-inline' on styles (Tailwind JIT requirement)
   * and whitelists only the known third-party origins from the spec.
   */
  async headers() {
    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          // Scripts: self + Vercel Analytics + Google Maps + reCAPTCHA
          "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://www.google.com https://www.gstatic.com https://va.vercel-scripts.com",
          // Styles: self + Google Fonts + unsafe-inline (Tailwind)
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          // Fonts: self + Google Fonts CDN
          "font-src 'self' https://fonts.gstatic.com",
          // Images: self + data URIs + Google Maps tiles
          "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com",
          // Connect: self + Resend + MailerLite + Vercel Analytics
          "connect-src 'self' https://api.resend.com https://connect.mailerlite.com https://vitals.vercel-insights.com",
          // Frames: self only — virtual-tour page overrides this
          "frame-src 'self' https://www.google.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    ];

    return [
      // All pages except virtual-tour get X-Frame-Options: SAMEORIGIN
      {
        source: '/((?!virtual-tour).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          ...baseHeaders,
        ],
      },
      // Virtual-tour: no X-Frame-Options, but allow trusted tour iframe src
      {
        source: '/virtual-tour',
        headers: [
          ...baseHeaders,
          // Override frame-src to allow the tour host (env var determined at runtime)
          // This is a build-time header so we whitelist broadly for the tour provider
          {
            key: 'Content-Security-Policy',
            value: (baseHeaders.find((h) => h.key === 'Content-Security-Policy') || { value: '' })
              .value.replace("frame-src 'self' https://www.google.com", "frame-src *"),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
