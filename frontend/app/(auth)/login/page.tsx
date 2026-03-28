"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // メール/パスワード ログイン
  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null);
    try {
      // TODO Phase 3: Supabase Auth の signInWithPassword を使用
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: values.email,
      //   password: values.password,
      // });
      // if (error) throw error;
      // router.push("/actresses");
      console.log("Email login:", values.email);
    } catch {
      setGlobalError("メールアドレスまたはパスワードが正しくありません");
    }
  };

  // Google OAuth ログイン (Phase 1 MVP)
  const handleGoogleLogin = async () => {
    setGlobalError(null);
    try {
      // TODO Phase 1: Supabase Auth の signInWithOAuth を使用
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider: "google",
      //   options: { redirectTo: `${window.location.origin}/auth/callback` },
      // });
      // if (error) throw error;
      console.log("Google login");
    } catch {
      setGlobalError("Googleログインに失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1a1a] px-6 py-10">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* ロゴ・タイトル */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Muse Log{" "}
            <span role="img" aria-label="muse">
              💋
            </span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            あなただけのミューズを記録しよう。
            <br />
            シンプルで美しい管理アプリ。
          </p>
        </div>

        {/* グローバルエラー */}
        {globalError && (
          <div className="rounded-xl bg-red-900/40 border border-red-700/50 px-4 py-3 text-sm text-red-300 text-center">
            {globalError}
          </div>
        )}

        {/* ログインフォーム */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* メールアドレス */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm text-gray-300 font-medium"
            >
              メールアドレス
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@muselog.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full rounded-xl bg-[#112222] border text-white placeholder-gray-500 px-4 py-3 pr-12 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500/70 focus:border-red-400"
                    : "border-[#1e3333] focus:border-[#00d4d4]"
                }`}
                {...register("email")}
              />
              <Mail
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-red-400 mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* パスワード */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm text-gray-300 font-medium"
            >
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="パスワードを入力"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full rounded-xl bg-[#112222] border text-white placeholder-gray-500 px-4 py-3 pr-12 text-sm focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500/70 focus:border-red-400"
                    : "border-[#1e3333] focus:border-[#00d4d4]"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={
                  showPassword ? "パスワードを隠す" : "パスワードを表示"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-400 mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* パスワードを忘れた */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/auth/reset-password"
              className="text-xs text-[#00d4d4] hover:text-[#00ffff] transition-colors"
            >
              パスワードをお忘れですか？
            </Link>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#00d4d4] hover:bg-[#00bfbf] active:bg-[#00aaaa] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a1a1a] font-bold py-4 text-base transition-colors mt-1"
          >
            {isSubmitting ? "ログイン中..." : "ログインする"}
          </button>
        </form>

        {/* 区切り線 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1e3333]" />
          <span className="text-sm text-gray-500">または</span>
          <div className="flex-1 h-px bg-[#1e3333]" />
        </div>

        {/* Google ログイン (Phase 1 MVP) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#112222] hover:bg-[#1a2e2e] active:bg-[#0d2020] border border-[#1e3333] disabled:opacity-60 disabled:cursor-not-allowed py-3.5 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-white text-sm font-medium">
            Googleでログイン
          </span>
        </button>

        {/* 新規登録リンク */}
        <p className="text-center text-sm text-gray-400">
          アカウントをお持ちでない方？{" "}
          <Link
            href="/signup"
            className="text-[#00d4d4] hover:text-[#00ffff] font-medium transition-colors"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
