'use client';
import { Component, ReactNode } from 'react';
// #region agent log
// Instrumented ErrorBoundary to capture runtime errors (Hypothesis H6)
// #endregion
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  override state = { error: undefined as Error | undefined };
  override componentDidCatch(error: Error) {
    // Send log to debug endpoint
    fetch('http://127.0.0.1:7245/ingest/7a17893d-1aa4-4a1d-8bb0-e75e94da057c',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'post-fix',
        hypothesisId:'H6',
        location:'AppErrorBoundary',
        message:'React error boundary caught',
        data:{error:error?.message, stack:error?.stack},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    this.setState({ error });
  }
  override render() { return this.state.error ? <div>Something went wrong. Please reload.</div> : this.props.children; }
}
