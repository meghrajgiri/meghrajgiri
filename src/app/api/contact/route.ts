import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const { data: submissionData, error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          subject,
          message,
          created_at: new Date().toISOString(),
          status: 'unread'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Send email notification
    console.log('Attempting to send email with Resend...');
    try {
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['meghraj.giri2000@gmail.com'],
        subject: `Contact from ${name} (${email}): ${subject}`,
        text: `New Contact Form Submission

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

Submitted at: ${new Date().toLocaleString()}

---
This message was sent from your portfolio contact form.`,
      });
      
      console.log('Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Email error:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the request if email fails, submission is already saved
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: submissionData.id
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}