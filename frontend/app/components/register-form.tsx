"use client";

import { useState } from "react";

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-foreground"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-muted"
          aria-label="戻る"
        >
          <ChevronLeftIcon />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold text-foreground pr-8">
          新規登録
        </h1>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-6 pb-8">
        {/* Logo section */}
        <div className="flex flex-col items-center gap-3 pt-6 pb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            {'Muse Log '}
            <span role="img" aria-label="lipstick">💋</span>
          </h2>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            あなただけのミューズを記録しよう。
            <br />
            シンプルで美しい管理アプリ。
          </p>
        </div>

        {/* Form */}
        <form className="flex w-full max-w-sm flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              メールアドレス
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="example@muselog.com"
                autoComplete="email"
                className="h-12 w-full rounded-[var(--radius)] border border-border bg-input px-4 pr-12 text-sm text-foreground placeholder:text-input-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="8文字以上の英数字"
                autoComplete="new-password"
                className="h-12 w-full rounded-[var(--radius)] border border-border bg-input px-4 pr-12 text-sm text-foreground placeholder:text-input-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          {/* Password confirmation field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password-confirm" className="text-sm font-medium text-foreground">
              {'パスワード（確認）'}
            </label>
            <div className="relative">
              <input
                id="password-confirm"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="パスワードを再入力"
                autoComplete="new-password"
                className="h-12 w-full rounded-[var(--radius)] border border-border bg-input px-4 pr-12 text-sm text-foreground placeholder:text-input-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-4 h-12 w-full rounded-[var(--radius)] bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            登録する
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">または</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* OAuth buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-input text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <AppleIcon />
              Apple
            </button>
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-input text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <GoogleIcon />
              Google
            </button>
          </div>

          {/* Login link */}
          <p className="pt-2 text-center text-sm text-muted-foreground">
            {'すでにアカウントをお持ちですか？ '}
            <a href="#" className="font-semibold text-primary hover:underline">
              ログイン
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
