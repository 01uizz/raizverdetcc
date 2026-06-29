'use client'
// global-error substitui o html/body quando o erro acontece no root layout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f7fbf8',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              maxWidth: 420,
              textAlign: 'center',
              background: '#fff',
              border: '1px solid #b6cfbd',
              borderRadius: 16,
              padding: '2.5rem',
            }}
          >
            <h1 style={{ color: '#06301f', fontSize: 20, marginBottom: 8 }}>
              Erro inesperado
            </h1>
            <p style={{ color: '#3c503f', fontSize: 14, marginBottom: 24 }}>
              Recarregue a página para continuar.
            </p>
            <button
              onClick={reset}
              style={{
                background: '#06301f',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
