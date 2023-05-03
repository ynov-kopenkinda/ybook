import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyEmail } from "../aws/cognito";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get("email");
  const queryEmailCheck =
    typeof queryEmail === "string" && queryEmail.trim() !== "";
  const [email, setEmail] = useState(queryEmailCheck ? queryEmail : "");
  useEffect(() => {
    if (queryEmailCheck) {
      setEmail(queryEmail.trim());
    }
  }, [queryEmail, queryEmailCheck]);
  const [code, setCode] = useState("");

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="mb-2 text-2xl font-bold">Verify your auth code</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await verifyEmail({ email, code });
            navigate("/login");
          } catch (e) {
            if (e instanceof Error) {
              window.alert(e.message);
            } else {
              console.error(e);
            }
          }
        }}
        className="flex w-full max-w-xs flex-col gap-4 rounded-md border p-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Email</label>
          <input
            className="rounded-xs border p-2 disabled:bg-gray-300"
            type="email"
            disabled={queryEmail != null && queryEmail !== ""}
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="surname">Verification code</label>
          <input
            className="rounded-xs border p-2"
            type="number"
            maxLength={6}
            name="surname"
            id="surname"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
          />
        </div>

        <button
          type="submit"
          className="rounded-xs bg-blue-400 p-2 text-white disabled:bg-blue-200"
          disabled={code.length !== 6}
        >
          Finish registration
        </button>
      </form>
    </div>
  );
}
