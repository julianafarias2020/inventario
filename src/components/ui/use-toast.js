import { useCallback } from 'react'

export function useToast() {
  const toast = useCallback(({ title, description, variant }) => {
    alert(`${title}\n\n${description}`)
    // Você pode trocar esse alert por um sistema de notificação melhor
    // como Radix UI, React Toastify ou Shadcn UI
  }, [])

  return { toast }
}
