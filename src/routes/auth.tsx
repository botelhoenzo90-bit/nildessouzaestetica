import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-nildes-souza.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito | Nildes Souza Estética" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const id = user.trim().toLowerCase();
    const email = id.includes("@") ? id : `${id}@app.local`;
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Usuário ou senha incorretos. Tente novamente.");
      return;
    }
    await navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src={logoAsset.url} alt="Nildes Souza Estética" />
        <span className="ns-eyebrow">Área da clínica</span>
        <h1>Painel de horários</h1>
        <p>Entre com o usuário e a senha da clínica para gerenciar os horários de atendimento.</p>
        <label className="auth-field">
          <span>Usuário</span>
          <div className="auth-input-wrap">
            <User size={16} />
            <input name="user" required autoComplete="username" placeholder="Usuário" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
        </label>
        <label className="auth-field">
          <span>Senha</span>
          <div className="auth-input-wrap">
            <Lock size={16} />
            <input name="password" required type="password" autoComplete="current-password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="ns-btn auth-submit" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"} <ArrowRight size={16} />
        </button>
        <a className="auth-back" href="/">Voltar ao site</a>
      </form>
    </div>
  );
}
