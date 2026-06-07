import { NextResponse } from "next/server";
import { validateDisplayName, validateEmail } from "@/lib/validation";

function validateSubject(subject: unknown) {
  if (!subject || typeof subject !== "string") {
    return { isValid: false as const, message: "Subject is required." };
  }

  const cleanSubject = subject.trim();
  if (!cleanSubject) {
    return { isValid: false as const, message: "Subject is required." };
  }
  if (cleanSubject.length > 120) {
    return { isValid: false as const, message: "Subject cannot exceed 120 characters." };
  }

  return { isValid: true as const, cleanValue: cleanSubject };
}

function validateMessageBody(message: unknown) {
  if (!message || typeof message !== "string") {
    return { isValid: false as const, message: "Message is required." };
  }

  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return { isValid: false as const, message: "Message is required." };
  }
  if (cleanMessage.length > 2000) {
    return { isValid: false as const, message: "Message cannot exceed 2000 characters." };
  }

  return { isValid: true as const, cleanValue: cleanMessage };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const nameVal = validateDisplayName(body.name ?? "");
    if (!nameVal.isValid) {
      return NextResponse.json(
        { success: false, message: nameVal.message },
        { status: 400 }
      );
    }

    const emailVal = validateEmail(body.email ?? "");
    if (!emailVal.isValid) {
      return NextResponse.json(
        { success: false, message: emailVal.message },
        { status: 400 }
      );
    }

    const subjectVal = validateSubject(body.subject);
    if (!subjectVal.isValid) {
      return NextResponse.json(
        { success: false, message: subjectVal.message },
        { status: 400 }
      );
    }

    const messageVal = validateMessageBody(body.message);
    if (!messageVal.isValid) {
      return NextResponse.json(
        { success: false, message: messageVal.message },
        { status: 400 }
      );
    }

    // Log inquiry for support follow-up. Integrate email/CRM provider as needed.
    console.info("[Blinko Support Inquiry]", {
      name: nameVal.cleanValue,
      email: emailVal.cleanValue,
      subject: subjectVal.cleanValue,
      message: messageVal.cleanValue,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will respond within 24–48 hours.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
