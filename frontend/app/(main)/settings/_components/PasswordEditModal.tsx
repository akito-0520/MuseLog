"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const schema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
    newPassword: z
      .string()
      .min(8, "8文字以上で入力してください")
      .regex(/[a-zA-Z]/, "英字を1文字以上含めてください")
      .regex(/[0-9]/, "数字を1文字以上含めてください"),
    confirmPassword: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface PasswordEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

function PasswordField({
  label,
  id,
  error,
  registration,
}: {
  label: string;
  id: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-gray-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className={`w-full rounded-xl bg-[#112222] border text-white placeholder-gray-600 pl-4 pr-10 py-3 text-sm focus:outline-none transition-colors ${
            error
              ? "border-red-500/70"
              : "border-[#1e3333] focus:border-[#00d4d4]"
          }`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label={show ? "隠す" : "表示"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function PasswordEditModal({
  open,
  onClose,
  onSave,
}: PasswordEditModalProps) {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await onSave(values.currentPassword, values.newPassword);
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
        <DialogTitle className="sr-only">パスワードを変更</DialogTitle>

        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3333]">
          <h2 className="text-base font-semibold text-white">
            パスワードを変更
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
          <PasswordField
            label="現在のパスワード"
            id="currentPassword"
            error={errors.currentPassword?.message}
            registration={register("currentPassword")}
          />
          <PasswordField
            label="新しいパスワード"
            id="newPassword"
            error={errors.newPassword?.message}
            registration={register("newPassword")}
          />
          <PasswordField
            label="新しいパスワード（確認）"
            id="confirmPassword"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-[#00d4d4] hover:bg-[#00bfbf] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a1a1a] transition-colors mt-1"
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
