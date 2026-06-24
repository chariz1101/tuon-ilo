'use client'

import { useState } from 'react'
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

  function handleClose() {
    setSuccess(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

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
          <>
            <h2 className="mb-4 text-xl font-semibold">Submit a Spot</h2>
            <AddLocationForm
              isPublicSubmission
              onPublicSubmitSuccess={() => setSuccess(true)}
            />
          </>
        )}
      </div>
    </div>
  )
}