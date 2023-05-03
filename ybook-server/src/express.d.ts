export type SessionData = {
  name: string;
  surname: string;
  email: string;
};

export interface Locals {
  session?: SessionData;
}

export as namespace Express;

declare namespace Express {
  export interface Response {
    typedLocals: Locals;
  }
}
