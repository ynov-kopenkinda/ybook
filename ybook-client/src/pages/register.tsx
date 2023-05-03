import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../aws/cognito";
import PwdCheck from "../components/auth/PwdCheck";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
      const registeredEmail = await register({
        name,
        surname,
        email,
        password,
      });
      navigate(`/verify-code?email=${encodeURIComponent(registeredEmail)}`);
    } catch (e) {
      if (e instanceof Error) {
        window.alert(e.message);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="mb-2 text-2xl font-bold">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex w-full max-w-xs flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            className="rounded-xs border p-2"
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="surname">Surname</label>
          <input
            className="rounded-xs border p-2"
            type="text"
            name="surname"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            className="rounded-xs border p-2"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
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
        <button
          type="submit"
          className="rounded-xs bg-blue-400 p-2 text-white disabled:bg-blue-300"
          disabled={!passwordCheckPasses}
        >
          Register
        </button>
        <div className="flex justify-between">
          <Link
            to={`/verify-code`}
            className="ml-auto text-xs text-blue-400 underline"
          >
            Verify code
          </Link>
          <Link
            to={`/login`}
            className="ml-auto text-xs text-blue-400 underline"
          >
            Already have an account? Log in instead
          </Link>
        </div>
      </form>
    </div>
  );
}
