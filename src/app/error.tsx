'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'error.tsx:15',message:'Error boundary triggered',data:{errorMessage:error?.message,errorStack:error?.stack,digest:error?.digest},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-red-600 mb-4">{error?.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[#3D693D] text-white rounded-lg hover:bg-[#2A4A2A]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}



