
import React, { useState, useEffect } from "react"; // added useEffect
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; // Eye icons

// ✅ Yup Validation Schema
const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // Dummy credentials
  const VALID_EMAIL = "demo@demo.com";
  const VALID_PASSWORD = "password123";

  // State for password visibility and inline login error
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // watch the fields so we can react to changes
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  // Clear loginError when either field becomes empty
  useEffect(() => {
    if (!watchedEmail || !watchedPassword) {
      // if either email or password is empty, hide login error
      setLoginError("");
    }
  }, [watchedEmail, watchedPassword]);
 const navigate = useNavigate();
  const onSubmit = (data) => {
  if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
    setLoginError("");
    navigate("/dashboard");   // <-- FIXED
  } else {
    setLoginError("Invalid email or password");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Welcome Back 👋
          </CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to continue to your workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // toggle visibility
                  placeholder="••••••••"
                  className="pl-10 pr-5" // extra padding for eye icon
                  {...register("password")}
                />

               
              </div>

              {/* Inline login error (shows only after a failed submit and hides when fields empty) */}
              {loginError && (
                <div className="p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                  {loginError}
                </div>
              )}

              {/* Yup field-level error */}
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </Button>

            <Separator className="my-1" />

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2 hover:bg-gray-100"
              onClick={() => {
                window.location.href = "/GoogleSignin";
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
