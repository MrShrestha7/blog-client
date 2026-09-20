import crypto from "node:crypto";
import { env } from "@repo/env/admin";
import { isLoggedIn } from "../../../utils/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return Response.json({ error: "Image uploads are not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return Response.json({ error: "Please select an image file" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return Response.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "blog-posts";
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
  const cloudinaryData = new FormData();
  cloudinaryData.set("file", file);
  cloudinaryData.set("api_key", CLOUDINARY_API_KEY);
  cloudinaryData.set("timestamp", String(timestamp));
  cloudinaryData.set("folder", folder);
  cloudinaryData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: cloudinaryData },
  );
  if (!response.ok) {
    return Response.json({ error: "Image upload failed" }, { status: 502 });
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    return Response.json({ error: "Image upload returned no URL" }, { status: 502 });
  }

  return Response.json({ url: result.secure_url });
}