import { redirect } from "next/navigation";

import { siteLinks } from "@/lib/siteLinks";

export default function LinksPage() {
  redirect(siteLinks.x);
}
