import { NextRequest, NextResponse } from "next/server";
import { IdempotencyManager } from "@/lib/idempotency";

export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get("X-Idempotency-Key");

  if (!idempotencyKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing X-Idempotency-Key header. Critical operations must be idempotent.",
      },
      { status: 400 }
    );
  }

  // Check if response is already cached for this idempotency key
  const cached = IdempotencyManager.getCached(idempotencyKey);
  if (cached) {
    return NextResponse.json(
      {
        success: true,
        isIdempotentReplay: true,
        order: cached.data,
      },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty. Cannot process order." },
        { status: 400 }
      );
    }

    const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const now = new Date();

    const createdOrder = {
      id: orderId,
      items: body.items,
      totalAmountINR: body.totalAmountINR,
      currency: body.currency || "INR",
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      createdAt: now.toISOString(),
      status: "Out for Delivery",
      trackingSteps: [
        { title: "Order Placed", time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { title: "Payment Verified", time: "Just now", completed: true },
        { title: "Dispatched from Amazon Hub", time: "In Transit", completed: true },
        { title: "Out for Delivery", time: "Expected today by 9:00 PM", completed: false, current: true },
      ],
    };

    // Store in idempotency cache
    IdempotencyManager.setCached(idempotencyKey, createdOrder);

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "private, no-store, must-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Order processing API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing order.",
      },
      { status: 500 }
    );
  }
}
