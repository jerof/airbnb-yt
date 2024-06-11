/* Creating a route handler */

import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  /* 1. Fetch user */
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  /* 2. If no user found, then throw error */
  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong. I am sorry...");
  }

  /* 3. If user is found, then fetch the user from the database */
  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  /* 4. If no db user is NotFoundBoundary, then create a db user */

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        id: user.id,
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  /* 5. Then redirect the user to the homepage */
  return NextResponse.redirect("http://localhost:3000");
}
