import { site } from "@/data/site";
import { buildCvPdf } from "@/lib/cv-pdf";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const bytes = await buildCvPdf();
  const body = new Uint8Array(bytes.byteLength);
  body.set(bytes);
  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${site.cvFileName}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
