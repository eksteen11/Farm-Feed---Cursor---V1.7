'use client';
import { Component, ReactNode } from 'react';
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  override state = { error: undefined as Error | undefined };
  override componentDidCatch(error: Error) { this.setState({ error }); }
  override render() { return this.state.error ? <div>Something went wrong. Please reload.</div> : this.props.children; }
}
