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
  /** ダイアログタイトル（デフォルト: "お気に入りから削除"） */
  title?: string;
  /** 説明文（デフォルト: "このお気に入りを削除しますか？この操作は元に戻せません。"） */
  description?: string;
  /** 確認ボタンのラベル（デフォルト: "削除する"） */
  confirmLabel?: string;
  /** 確認ボタンの追加クラス */
  confirmClassName?: string;
}

export function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = "お気に入りから削除",
  description = "このお気に入りを削除しますか？この操作は元に戻せません。",
  confirmLabel = "削除する",
  confirmClassName = "text-white bg-red-700/80 hover:bg-red-700",
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-[#112222] border border-[#1e3333] p-6 shadow-xl"
      >
        <DialogTitle className="text-base font-semibold text-white mb-2">
          {title}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-400 mb-6">
          {description}
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
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
