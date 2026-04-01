"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const schema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
});
type FormValues = z.infer<typeof schema>;

interface EmailEditModalProps {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  onSave: (email: string) => Promise<void>;
}

export function EmailEditModal({
  open,
  currentEmail,
  onClose,
  onSave,
}: EmailEditModalProps) {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: currentEmail },
  });

  const onSubmit = async (values: FormValues) => {
    await onSave(values.email);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      reset();
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-[#0d1f1f] border border-[#1e3333] p-0 shadow-2xl overflow-hidden"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">メールアドレスを変更</DialogTitle>

        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3333]">
          <h2 className="text-base font-semibold text-white">
            メールアドレスを変更
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-5 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">
              新しいメールアドレス
            </label>
            <div className="relative">
              <input
                type="email"
                autoComplete="email"
                placeholder="example@muselog.com"
                className={`w-full rounded-xl bg-[#112222] border text-white placeholder-gray-600 pl-4 pr-10 py-3 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500/70"
                    : "border-[#1e3333] focus:border-[#00d4d4]"
                }`}
                {...register("email")}
              />
              <Mail
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-[#00d4d4] hover:bg-[#00bfbf] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a1a1a] transition-colors"
          >
            {success
              ? "変更しました ✓"
              : isSubmitting
                ? "保存中..."
                : "変更する"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
