"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const CONFIRM_WORD = "削除する";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = inputValue === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-[#0d1f1f] border border-[#1e3333] p-0 shadow-2xl overflow-hidden"
        aria-describedby="delete-account-desc"
      >
        <DialogTitle className="sr-only">アカウントを削除</DialogTitle>

        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3333]">
          <h2 className="text-base font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle size={16} />
            アカウントを削除
          </h2>
          <DialogClose asChild>
            <button
              className="p-1.5 rounded-full text-gray-500 hover:text-white transition-colors"
              aria-label="閉じる"
            >
              <X size={18} />
            </button>
          </DialogClose>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* 警告 */}
          <div className="rounded-xl bg-red-900/20 border border-red-800/40 px-4 py-3 flex flex-col gap-1.5">
            <p
              id="delete-account-desc"
              className="text-sm text-red-300 font-medium"
            >
              この操作は取り消せません
            </p>
            <ul className="text-xs text-red-400/80 flex flex-col gap-1 list-disc list-inside">
              <li>登録した全ての女優データが削除されます</li>
              <li>評価・タグ・メモが全て失われます</li>
              <li>アカウントは永久に削除されます</li>
            </ul>
          </div>

          {/* 確認入力 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">
              確認のため{" "}
              <span className="text-red-400 font-semibold">
                「{CONFIRM_WORD}」
              </span>{" "}
              と入力してください
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={CONFIRM_WORD}
              className="w-full rounded-xl bg-[#112222] border border-[#1e3333] text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-red-500/70 transition-colors"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-[#1a2e2e] hover:bg-[#1e3333] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-700/80 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? "削除中..." : "削除する"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
