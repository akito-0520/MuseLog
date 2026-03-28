import { z } from "zod";

// ── ログイン ──────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ── 新規登録 ──────────────────────────────────────────────────

export const signUpSchema = z
  .object({
    email: z.email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(/[a-zA-Z]/, "英字を1文字以上含めてください")
      .regex(/[0-9]/, "数字を1文字以上含めてください"),
    confirmPassword: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
