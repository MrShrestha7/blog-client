import { isLoggedIn } from "../utils/auth";
import LoginForm from "../components/admin/LoginForm";
import AdminHome from "../components/admin/AdminHome";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return <AdminHome />;
}
