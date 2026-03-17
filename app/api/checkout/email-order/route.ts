import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const orderData = await req.json();
        console.log("Processing email notification for order:", orderData.order_number);

        const { data, error } = await resend.emails.send({
            from: "EdgeBorn Sales <onboarding@resend.dev>",
            to: ["jeniflemin1589@gmail.com"],
            subject: `New Order: ${orderData.order_number}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                    <h1 style="color: #1a1a1a; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px;">New Order Received</h1>
                    <p>A new order has been placed via the <strong>Email</strong> option.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <h2 style="font-size: 18px; margin-top: 0;">Order Details</h2>
                        <p><strong>Order Number:</strong> ${orderData.order_number}</p>
                        <p><strong>Customer:</strong> ${orderData.customer_name} (${orderData.customer_email})</p>
                        <p><strong>Phone:</strong> ${orderData.customer_phone || 'N/A'}</p>
                        <p><strong>WhatsApp:</strong> ${orderData.customer_whatsapp || 'N/A'}</p>
                        <p><strong>Total Amount:</strong> Rs. ${Number(orderData.total).toFixed(2)}</p>
                    </div>

                    <h3>Shipping Address</h3>
                    <p>
                        ${orderData.shipping_address?.street}<br>
                        ${orderData.shipping_address?.city}, ${orderData.shipping_address?.zip}<br>
                        ${orderData.shipping_address?.country}
                    </p>

                    <h3>Items</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #eee;">
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map((item: any) => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                        ${item.name} ${item.size ? `(${item.size})` : ''} ${item.color ? ` - Color: ${item.color}` : ''}
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                                        ${item.quantity}
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                                        Rs. ${Number(item.price).toFixed(2)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
                        This is an automated notification from EdgeBorn E-Commerce.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend error for order:", orderData.order_number, error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        console.log("Email notification sent successfully for order:", orderData.order_number);
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Email order API error:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to send email notification" }, { status: 500 });
    }
}
