"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "./auth-context";

export function LoginForm() {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    const success = isLogin
      ? await login(formData.name, formData.password)
      : await register(formData.name, formData.password);

    if (!success) {
      setError(
        isLogin ? "Nome ou senha incorretos" : "Este nome já está em uso"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">economize :)</h1>
          </div>
          <p className="text-white/60 text-sm">
            Seu sistema de gestão e análise financeira.
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-black border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <p className="text-center text-white/60">
              {isLogin
                ? "Entre com suas credenciais"
                : "Crie sua conta para começar"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Seu nome"
                  className="bg-black border-white/10 text-white placeholder:text-white/40"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Sua senha"
                    className="bg-black border-white/10 text-white placeholder:text-white/40 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </>
                ) : isLogin ? (
                  "Entrar"
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", password: "" });
                }}
                className="text-white/60 hover:text-white text-sm transition-colors"
                disabled={isLoading}
              >
                {isLogin
                  ? "Não tem uma conta? Criar conta"
                  : "Já tem uma conta? Entrar"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/40 text-xs">
          <p>Seus dados são armazenados localmente no seu navegador.</p>
        </div>
      </div>
    </div>
  );
}
