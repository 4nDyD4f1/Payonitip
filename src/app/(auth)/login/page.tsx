"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Silakan periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] border-none rounded-[16px] bg-white dark:bg-[#0F172A]">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto mb-2 flex justify-center">
          <Image
            src="/logo.png"
            alt="Payonitip"
            width={120}
            height={40}
            style={{ width: "auto" }} className="h-12 object-contain"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">Masuk ke Payonitip</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Selamat datang kembali! Silakan masukkan kredensial Anda.
          {isRegistered && <p className="text-[#ef85f8] mt-2">Pendaftaran berhasil! Silakan masuk.</p>}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-[#ef85f8] dark:text-[#f5b0fb] hover:underline">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-2">
          <Button 
            type="submit" 
            className="w-full rounded-full bg-[#ef85f8] hover:bg-[#004a8c] dark:bg-[#f5b0fb] dark:hover:bg-[#5293eb] text-white dark:text-slate-900"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-[#ef85f8] dark:text-[#f5b0fb] hover:underline">
              Daftar
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fde8ff] to-[#e8f1ff] dark:from-[#2e1933] dark:to-[#172338]">
      <Suspense fallback={<div>Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
