import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const userAuth = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  return user;
};
