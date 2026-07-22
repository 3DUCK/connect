import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, txHash, amount } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // In a production app, you would verify the txHash via an RPC provider here.
    // For this MVP, we proceed to send the email.
    
    // Read the new PDF guide from the private directory (temporary hardcode for testing)
    const pdfPath = path.join(process.cwd(), 'private', 'guides', 'en', 'ConnectKR_Guides_EN_batch1.pdf');
    let pdfBuffer: Buffer;
    
    try {
      pdfBuffer = fs.readFileSync(pdfPath);
    } catch (err) {
      console.error("Failed to read PDF file:", err);
      return NextResponse.json({ error: 'Guide file not found on server' }, { status: 500 });
    }

    if (resend) {
      console.log(`[Email Attempt] Sending email to: ${email}`);
      // Send real email with PDF attachment
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // You must use this testing address until you verify your custom domain in Resend
        to: email,
        subject: 'Here is your Connect KR Guide!',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>Thank you for your purchase!</h2>
            <p>We received your payment of ${amount || '2'} USDC (TxHash: ${txHash || 'N/A'}).</p>
            <p>Attached to this email is your <strong>Connect KR: Step-by-Step Guide</strong> in PDF format.</p>
            <br/>
            <p>Safe travels and good luck setting up your phone in Korea!</p>
            <p>- The Connect KR Team</p>
          </div>
        `,
        attachments: [
          {
            filename: 'Connect-KR-Guide.pdf',
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error("❌ [Resend API Error]:", error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }

      console.log(`✅ [Email Success] Email successfully sent to ${email} (ID: ${data?.id})`);
      console.log(`[Resend Server Response]:`, data);
    } else {
      // Fallback/Simulation mode if no API key is provided
      console.log('----------------------------------------------------');
      console.log(`[SIMULATED EMAIL DELIVERY]`);
      console.log(`To: ${email}`);
      console.log(`Subject: Here is your Connect KR Guide!`);
      console.log(`Attachment: Connect-KR-Guide.pdf (${pdfBuffer.length} bytes)`);
      console.log(`Note: No RESEND_API_KEY found in .env, skipping actual delivery.`);
      console.log('----------------------------------------------------');
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error("Error in verify-tx route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
