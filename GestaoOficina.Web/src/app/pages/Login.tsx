import { useState } from "react";
import { useNavigate } from "react-router";
import { Wrench } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4">
            <Wrench size={40} className="text-accent-foreground" />
          </div>
          <h1 className="text-2xl text-primary">Auto Oficina Pro</h1>
          <p className="text-muted-foreground text-sm">
            Sistema de Gestão para Oficinas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-card-foreground">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-card-foreground">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Entrar
          </button>

          <div className="text-center">
            <a
              href="#"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Esqueci minha senha
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
