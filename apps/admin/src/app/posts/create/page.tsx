import { redirect } from "next/navigation";
import AdminPostForm from "../../../components/admin/AdminPostForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  return <AdminPostForm mode="create" />;
}
