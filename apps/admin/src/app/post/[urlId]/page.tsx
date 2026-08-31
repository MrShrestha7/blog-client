import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import AdminPostForm from "../../../components/admin/AdminPostForm";
import { getPostByUrlId } from "../../../utils/admin-data";

export default async function EditPostPage({ params }: { params: Promise<{ urlId: string }> }) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  const { urlId } = await params;
  const post = getPostByUrlId(urlId);

  if (!post) {
    notFound();
  }

  return <AdminPostForm mode="edit" initialPost={post} />;
}
