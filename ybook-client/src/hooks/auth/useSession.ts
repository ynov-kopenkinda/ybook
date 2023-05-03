import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { ApiGetSessionResponse } from "../../api/api.types";

type SessionResult =
  | {
      status: "success";
      data: ApiGetSessionResponse["session"];
    }
  | {
      status: "error";
      data: null;
    }
  | {
      status: "loading";
      data: undefined;
    };

export const USE_SESSION_KEY = "USE_SESSION";

export function useSession(): SessionResult {
  const { data, isInitialLoading } = useQuery([USE_SESSION_KEY], async () => {
    const [session, error] = await api.auth.getSession();
    if (error) {
      return { session: null };
    }
    return session;
  });

  if (data === undefined || isInitialLoading) {
    return { status: "loading", data: undefined };
  }
  if (data.session === null) {
    return { status: "error", data: null };
  }
  return { status: "success", data: data.session };
}
