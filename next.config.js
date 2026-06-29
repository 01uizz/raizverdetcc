/** @type {import('next').NextConfig} */

// Deriva o host do Supabase a partir da variável de ambiente, para que as
// imagens do Storage funcionem mesmo se a URL do projeto mudar (evita o erro
// "hostname not configured under images" ao trocar de projeto Supabase).
let supabaseHost
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url) supabaseHost = new URL(url).hostname
} catch {
  supabaseHost = undefined
}

const nextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
        : []),
      { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/v1/create-qr-code/**' },
    ],
  },
}

module.exports = nextConfig
