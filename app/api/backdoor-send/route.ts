import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Read the PDF file
    const pdfPath = path.join(process.cwd(), "private", "guides", "en", "ConnectKR_Guides_EN_batch1.pdf");
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Send email via Resend
    const data = await resend.emails.send({
      from: "Connect KR <onboarding@resend.dev>", // Using testing domain
      to: [email],
      subject: "Your Connect KR Guide [DEV BACKDOOR]",
      html: `
        <h1>Here is your guide!</h1>
        <p>This was sent via the developer backdoor.</p>
        <p>Make sure to save the PDF to your phone.</p>
        <p>Enjoy your trip to Korea!</p>
      `,
      attachments: [
        {
          filename: "ConnectKR_Guide.pdf",
          content: pdfBuffer,
        },
      ],
    });

    if (data.error) {
      console.error("Resend API error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Backdoor send error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
