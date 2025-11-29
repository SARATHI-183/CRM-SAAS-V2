// // import React, { useState } from "react";
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Separator } from "@/components/ui/separator";
// // import { Mail, KeyRound, Lock } from "lucide-react";

// // export default function ForgotPassword() {
// //   const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = reset password

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 px-4">
// //       <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">

// //         {/* STEP TITLES */}
// //         <CardHeader className="text-center space-y-2">
// //           <CardTitle className="text-2xl font-semibold text-gray-900">
// //             {step === 1 && "Forgot Password 🔒"}
// //             {step === 2 && "Enter OTP 📩"}
// //             {step === 3 && "Reset Password 🔁"}
// //           </CardTitle>

// //           <CardDescription className="text-gray-500">
// //             {step === 1 && "Enter your email to receive the OTP"}
// //             {step === 2 && "Enter the OTP sent to your email"}
// //             {step === 3 && "Create a new secure password"}
// //           </CardDescription>
// //         </CardHeader>

// //         <CardContent className="space-y-4">

// //           {/* STEP 1 — ENTER EMAIL */}
// //           {step === 1 && (
// //             <div className="space-y-4">
// //               <div className="space-y-1">
// //                 <Label>Email Address</Label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
// //                   <Input
// //                     type="email"
// //                     placeholder="you@example.com"
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>

// //               <Button
// //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
// //                 onClick={() => setStep(2)}
// //               >
// //                 Send OTP
// //               </Button>
// //             </div>
// //           )}

// //           {/* STEP 2 — OTP INPUT */}
// //           {step === 2 && (
// //             <div className="space-y-4">
// //               <div className="space-y-1">
// //                 <Label>Enter OTP</Label>
// //                 <div className="relative">
// //                   <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
// //                   <Input
// //                     type="text"
// //                     placeholder="Enter 6-digit OTP"
// //                     maxLength={6}
// //                     className="pl-10 tracking-widest"
// //                   />
// //                 </div>
// //               </div>

// //               <Button
// //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
// //                 onClick={() => setStep(3)}
// //               >
// //                 Verify OTP
// //               </Button>

// //               <p className="text-sm text-center text-gray-500">
// //                 Didn’t receive the OTP?{" "}
// //                 <button className="text-blue-600 hover:underline">
// //                   Resend
// //                 </button>
// //               </p>
// //             </div>
// //           )}

// //           {/* STEP 3 — RESET PASSWORD */}
// //           {step === 3 && (
// //             <div className="space-y-4">
// //               {/* New Password */}
// //               <div className="space-y-1">
// //                 <Label>New Password</Label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
// //                   <Input
// //                     type="password"
// //                     placeholder="Enter new password"
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Confirm Password */}
// //               <div className="space-y-1">
// //                 <Label>Confirm Password</Label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
// //                   <Input
// //                     type="password"
// //                     placeholder="Confirm new password"
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>

// //               <Button
// //                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
// //                 onClick={() => (window.location.href = "/")}
// //               >
// //                 Reset Password
// //               </Button>
// //             </div>
// //           )}

// //           <Separator />

// //           <p className="text-center text-sm text-gray-500">
// //             Remember your password?{" "}
// //             <a href="/" className="text-blue-600 hover:underline">
// //               Go to Login
// //             </a>
// //           </p>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

// export default function ForgotPassword() {
//   const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = reset password
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Dummy data
//   const DUMMY_EMAIL = "demo@demo.com";
//   const DUMMY_OTP = "123456";

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 px-4">
//       <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
//         {/* STEP TITLES */}
//         <CardHeader className="text-center space-y-2">
//           <CardTitle className="text-2xl font-semibold text-gray-900">
//             {step === 1 && "Forgot Password 🔒"}
//             {step === 2 && "Enter OTP 📩"}
//             {step === 3 && "Reset Password 🔁"}
//           </CardTitle>

//           <CardDescription className="text-gray-500">
//             {step === 1 && "Enter your email to receive the OTP"}
//             {step === 2 && "Enter the OTP sent to your email"}
//             {step === 3 && "Create a new secure password"}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* STEP 1 — ENTER EMAIL */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <Label>Email Address</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <Input
//                     type="email"
//                     placeholder="you@example.com"
//                     className="pl-10"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <Button
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 onClick={() => {
//                   if (email.trim() === "") {
//                     alert("Please enter your email");
//                   } else if (email !== DUMMY_EMAIL) {
//                     alert("Email not recognized");
//                   } else {
//                     setStep(2);
//                   }
//                 }}
//               >
//                 Send OTP
//               </Button>
//             </div>
//           )}

//           {/* STEP 2 — OTP INPUT */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <Label>Enter OTP</Label>
//                 <div className="relative">
//                   <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     maxLength={6}
//                     className="pl-10 tracking-widest"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <Button
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 onClick={() => {
//                   if (otp.trim() === "") {
//                     alert("Please enter the OTP");
//                   } else if (otp !== DUMMY_OTP) {
//                     alert("Invalid OTP");
//                   } else {
//                     setStep(3);
//                   }
//                 }}
//               >
//                 Verify OTP
//               </Button>

//               <p className="text-sm text-center text-gray-500">
//                 Didn’t receive the OTP?{" "}
//                 <button className="text-blue-600 hover:underline" onClick={() => alert("OTP resent")}>
//                   Resend
//                 </button>
//               </p>
//             </div>
//           )}

//           {/* STEP 3 — RESET PASSWORD */}
//           {step === 3 && (
//             <div className="space-y-4">
//               {/* New Password */}
//               <div className="space-y-1">
//                 <Label>New Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter new password"
//                     className="pl-10 pr-10"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                   />
//                   {showPassword ? (
//                     <EyeOff
//                       className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
//                       onClick={() => setShowPassword(false)}
//                     />
//                   ) : (
//                     <Eye
//                       className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
//                       onClick={() => setShowPassword(true)}
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-1">
//                 <Label>Confirm Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <Input
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm new password"
//                     className="pl-10 pr-10"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                   {showConfirmPassword ? (
//                     <EyeOff
//                       className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
//                       onClick={() => setShowConfirmPassword(false)}
//                     />
//                   ) : (
//                     <Eye
//                       className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
//                       onClick={() => setShowConfirmPassword(true)}
//                     />
//                   )}
//                 </div>
//               </div>

//               <Button
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 onClick={() => {
//                   if (newPassword.trim() === "" || confirmPassword.trim() === "") {
//                     alert("Please enter both password fields");
//                   } else if (newPassword !== confirmPassword) {
//                     alert("Passwords do not match");
//                   } else {
//                     alert("Password reset successful!");
//                     window.location.href = "/"; // redirect to login
//                   }
//                 }}
//               >
//                 Reset Password
//               </Button>
//             </div>
//           )}

//           <Separator />

//           <p className="text-center text-sm text-gray-500">
//             Remember your password?{" "}
//             <a href="/" className="text-blue-600 hover:underline">
//               Go to Login
//             </a>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useState } from "react";
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
import { Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Dummy data
  const DUMMY_EMAIL = "demo@demo.com";
  const DUMMY_OTP = "123456";

  const handleSendOTP = () => {
    if (email.trim() === "") {
      setErrorMessage("Please enter your email");
    } else if (email !== DUMMY_EMAIL) {
      setErrorMessage("Email not recognized");
    } else {
      setErrorMessage("");
      setStep(2);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.trim() === "") {
      setErrorMessage("Please enter the OTP");
    } else if (otp !== DUMMY_OTP) {
      setErrorMessage("Invalid OTP");
    } else {
      setErrorMessage("");
      setStep(3);
    }
  };

  const handleResetPassword = () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      setErrorMessage("Please enter both password fields");
    } else if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        {/* STEP TITLES */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {step === 1 && "Forgot Password 🔒"}
            {step === 2 && "Enter OTP 📩"}
            {step === 3 && "Reset Password 🔁"}
            {step === 4 && "Success ✅"}
          </CardTitle>

          <CardDescription className="text-gray-500">
            {step === 1 && "Enter your email to receive the OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new secure password"}
            {step === 4 && "Password reset successful! You can now login."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && step !== 4 && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* STEP 1 — ENTER EMAIL */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSendOTP}
              >
                Send OTP
              </Button>
            </div>
          )}

          {/* STEP 2 — OTP INPUT */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Enter OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="pl-10 tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleVerifyOTP}
              >
                Verify OTP
              </Button>

              <p className="text-sm text-center text-gray-500">
                Didn’t receive the OTP?{" "}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setErrorMessage("OTP resent (dummy)")}>
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* STEP 3 — RESET PASSWORD */}
          {step === 3 && (
            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 pr-5"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10 pr-5"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                 
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step === 4 && (
            <div className="text-center space-y-2">
              <p className="text-green-700 font-medium">
                Your password has been reset successfully!
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => (window.location.href = "/")}
              >
                Go to Login
              </Button>
            </div>
          )}

          <Separator />

          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Go to Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
