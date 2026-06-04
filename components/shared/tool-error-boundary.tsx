"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface State {
  hasError: boolean;
  message: string;
}

export class ToolErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <div>
            <p className="font-semibold">Algo deu errado ao carregar esta ferramenta.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente recarregar a página ou volte mais tarde.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              this.setState({ hasError: false, message: "" });
              window.location.reload();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
