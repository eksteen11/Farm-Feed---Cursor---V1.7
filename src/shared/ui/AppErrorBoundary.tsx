'use client';
import { Component, ReactNode } from 'react';
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state = { error: undefined as Error | undefined };
  componentDidCatch(error: Error) { this.setState({ error }); }
  render() { return this.state.error ? <div>Something went wrong. Please reload.</div> : this.props.children; }
}
