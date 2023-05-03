import { IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PwdCheck from "../components/auth/PwdCheck";
import { login, requestVerificationCode, updatePassword } from "../aws/cognito";
import { useAuthActions } from "../store/auth.store";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<
    "getting-code" | "getting-email" | "getting-password" | "success"
  >("getting-email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useAuthActions();

  const passwordChecks = {
    length: password.length >= 8 && password.length <= 20,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  const passwordCheckPasses =
    Object.values(passwordChecks).filter((v) => v).length ===
    Object.values(passwordChecks).length;
  const handleSubmit = async () => {
    try {
      if (step === "getting-email") {
        await requestVerificationCode({ email });
        setStep("getting-code");
      }
      if (step === "getting-code") {
        if (code.length !== 6) {
          return;
        }
        setStep("getting-password");
      }
      if (step === "getting-password") {
        await updatePassword({ email, code, newPassword: password });
        setStep("success");
      }
      if (step === "success") {
        const token = await login({ email, password });
        authenticate({ email, token });
        navigate("/");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "User is not verified") {
          navigate(`/verify-code?email=${email}`);
        }
        window.alert(e.message);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {step !== "success" ? (
        <h1 className="mb-2 text-2xl font-bold">Forgot password</h1>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex w-full max-w-xs flex-col gap-4 rounded-md border p-4"
      >
        {step !== "success" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              className="rounded-xs border border-gray-400 p-2 disabled:text-gray-400"
              type="email"
              name="email"
              id="email"
              value={email}
              disabled={step !== "getting-email"}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <small>Please enter the code that we&apos;ve sent to you</small>
          </div>
        ) : null}
        {step === "getting-code" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Code</label>
            <input
              className="rounded-xs border p-2"
              type="number"
              maxLength={6}
              name="password"
              id="password"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
            />
            <small>Please enter the code that we&apos;ve sent to you</small>
          </div>
        ) : null}
        {step === "getting-password" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              className="rounded-xs border p-2"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {password.length > 0 && (
              <ul>
                <PwdCheck
                  condition={passwordChecks.length}
                  text="Between 8 and 20 characters"
                />
                <PwdCheck
                  condition={passwordChecks.uppercase}
                  text="At least 1 uppercase letter"
                />
                <PwdCheck
                  condition={passwordChecks.lowercase}
                  text="At least 1 lowercase letter"
                />
                <PwdCheck
                  condition={passwordChecks.number}
                  text="At least 1 number"
                />
                <PwdCheck
                  condition={passwordChecks.special}
                  text="At least 1 special character"
                />
              </ul>
            )}
          </div>
        ) : null}
        {step === "success" ? (
          <div className="flex flex-col items-center justify-center">
            <IconCheck className="h-9 w-9 text-lime-600" />
            <b>Password changed successfully</b>
          </div>
        ) : null}
        <button
          type="submit"
          className="rounded-xs bg-blue-400 p-2 text-white"
          disabled={step === "getting-password" && !passwordCheckPasses}
        >
          {step === "getting-email" ? "Send me a confirmation email" : null}
          {step === "getting-code" ? "Validate the code" : null}
          {step === "getting-password" ? "Submit" : null}
          {step === "success" ? "Log in" : null}
        </button>
        {step === "getting-email" ? (
          <div className="flex justify-between">
            <Link
              to="/login"
              className="ml-auto text-xs text-blue-400 underline"
            >
              Log in instead
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}
