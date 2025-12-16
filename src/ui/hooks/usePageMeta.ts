import { useEffect } from 'react'

// Simple hook to set page title & description without pulling in heavy deps.
// This is enough for basic SEO in a SPA context.
export const usePageMeta = (options: { title?: string; description?: string }) => {
  useEffect(() => {
    if (options.title) {
      document.title = options.title
    }
    if (options.description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = options.description
    }
  }, [options.title, options.description])
}


