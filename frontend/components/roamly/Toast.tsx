'use client'

interface ToastProps {
  message: string
}

const Toast = ({ message }: ToastProps) => {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#222222] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
      {message}
    </div>
  )
}

export default Toast
