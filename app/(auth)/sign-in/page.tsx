import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-4">
      <AuthForm mode="sign-in" />
    </div>
  );
}
