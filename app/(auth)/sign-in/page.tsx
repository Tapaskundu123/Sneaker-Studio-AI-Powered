// app/auth/sign-in/page.tsx
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/lib/auth/actions";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-4">
      <AuthForm mode="sign-in" onSubmit={signIn} />
    </div>
  );
}