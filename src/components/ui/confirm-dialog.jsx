"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

export function ConfirmDialog({ open, onConfirm, onCancel, title, description, confirmLabel = "Eliminar", loading = false }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm bg-zinc-900 border border-white/10 text-white p-0 gap-0">
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">{title}</p>
              {description && (
                <p className="text-white/50 text-sm mt-1 leading-snug">{description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="-mx-0 px-6 py-4 border-t border-white/10 flex justify-end gap-2 rounded-b-xl bg-zinc-900/50">
          <DialogClose render={<Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/8" />}>
            Cancelar
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500/80 hover:bg-red-500 text-white font-semibold px-5 disabled:opacity-40"
          >
            {loading ? <><Spinner className="size-4 mr-1.5" />{confirmLabel}...</> : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
