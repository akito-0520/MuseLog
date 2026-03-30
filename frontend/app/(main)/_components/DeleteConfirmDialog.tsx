"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-[#112222] border border-[#1e3333] p-6 shadow-xl"
      >
        <DialogTitle className="text-base font-semibold text-white mb-2">
          お気に入りから削除
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-400 mb-6">
          このお気に入りを削除しますか？この操作は元に戻せません。
        </DialogDescription>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-gray-300 bg-[#1a2e2e] hover:bg-[#1e3333] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-700/80 hover:bg-red-700 transition-colors"
          >
            削除する
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
