'use client'
import { useState, useEffect } from 'react'

/**
 * Exibe a capa de um projeto a partir de QUALQUER URL (upload do Supabase
 * Storage ou link externo colado à mão), sem depender do allowlist de hosts
 * do next/image — que era o motivo de a imagem não aparecer.
 *
 * A imagem é enquadrada com object-cover (preenche o espaço sem deixar bordas;
 * o recorte é centralizado). Se a URL falhar ou estiver vazia, cai para
 * `fallbackSrc` e, na ausência dele, renderiza `children` (placeholder).
 */
export function CoverImage({
  src,
  fallbackSrc,
  alt,
  imgClassName = '',
  children,
}: {
  src?: string | null
  fallbackSrc?: string
  alt: string
  imgClassName?: string
  children?: React.ReactNode
}) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  const effective = !src || failed ? fallbackSrc : src

  if (!effective) return <>{children ?? null}</>

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={effective}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover object-center ${imgClassName}`}
    />
  )
}
