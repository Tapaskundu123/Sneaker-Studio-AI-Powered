// app/auth/sign-up/page.tsx
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/auth/actions";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-4">
      <AuthForm mode="sign-up" onSubmit={signUp} />
    </div>
  );
}