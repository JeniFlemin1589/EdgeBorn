import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, subject, message } = await request.json();

        if (!firstName || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "EdgeBorn Contact <onboarding@resend.dev>",
            to: "edgeborn2026@gmail.com",
            subject: `[EdgeBorn Contact] ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr />
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br />")}</p>
            `,
            replyTo: email,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact email error:", error);
        return NextResponse.json(
            { error: "Failed to send email." },
            { status: 500 }
        );
    }
}
