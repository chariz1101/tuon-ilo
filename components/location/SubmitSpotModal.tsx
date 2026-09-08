'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import AddLocationForm from '@/components/admin/AddLocationForm'

export default function SubmitSpotModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleClose() {
    setSuccess(false)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Submit a spot"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-200 sm:max-h-[90dvh] sm:max-w-xl sm:rounded-xl sm:animate-none"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold">Submit a Spot</h2>
          <button
            onClick={handleClose}
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {success ? (
            <div className="py-8 text-center">
              <p className="text-lg font-medium text-green-700">
                Thanks! Your submission is under review.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                An admin will review your spot before it appears on the map.
              </p>
            </div>
          ) : (
            <AddLocationForm
              isPublicSubmission
              onPublicSubmitSuccess={() => setSuccess(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
