import { redirect } from "next/navigation";

import LoginForm from "./_components/LoginForm";
import { userAuth } from "@/lib/user-auth";

const Login = async () => {
  const user = await userAuth();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="border max-w-xl w-[95%] md:w-4/5 mx-auto px-8 py-10 rounded-lg shadow-sm">
      <LoginForm />
    </div>
  );
};

export default Login;
