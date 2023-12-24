import { compare, hash } from "bcryptjs";
import { prisma } from "./database.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "development",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, //30 days
    httpOnly: true, //to make client side javascript cant access the cookie
  },
});

const createUserSession = async (userId, redirectPath) => {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export const getUserFromSession = async (request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }
  return userId;
};

export const requireUserSession = async (request) => {
  const userId = await getUserFromSession(request);
  if (!userId) {
    throw redirect("/auth?mode=login"); // throwing redirect, stops all other ongoing calls..
  }
  return userId;
};

export const destroySession = async (request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

export async function signup({ email, password }) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    const error = new Error(
      "A user with provided email address exists already.."
    );
    error.status = 422;
    throw error;
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: { email: email, password: passwordHash },
  });
  return await createUserSession(user.id, "/expenses");
}

export async function login({ email, password }) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    const error = new Error(
      "A user with provided email address exists already.."
    );
    error.status = 422;
    throw error;
  }

  const passwordCompare = await compare(password, existingUser.password);
  if (!passwordCompare) {
    const error = new Error("Cannot log you in please check the credentials");
    error.status = 422;
    throw error;
  }

  return await createUserSession(existingUser.id, "/expenses");
}
