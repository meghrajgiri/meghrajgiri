# Contact Form Setup Guide

This guide will help you set up the contact form functionality to receive and store contact submissions.

## Services Required

### 1. Supabase (Database)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 2. Resend (Email Service)
1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your domain (or use their sandbox for testing)
3. Generate an API key from the dashboard

## Setup Steps

### Step 1: Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

### Step 2: Database Setup
1. In your Supabase dashboard, go to SQL Editor
2. Run the SQL from `supabase-schema.sql` to create the contact_submissions table
3. The table will store all contact form submissions

### Step 3: Email Domain Setup (Optional but Recommended)
1. In Resend dashboard, add your domain (e.g., meghrajgiri.dev)
2. Add the required DNS records to verify your domain
3. Update the `from` email in `/src/app/api/contact/route.ts` to use your domain

### Step 4: Test the Setup
1. Run your development server: `npm run dev`
2. Navigate to the contact section
3. Submit a test message
4. Check your email and Supabase database for the submission

## Features Included

✅ **Form Validation** - Client and server-side validation  
✅ **Database Storage** - All submissions stored in Supabase  
✅ **Email Notifications** - Instant email alerts for new submissions  
✅ **Success/Error Messages** - User feedback on form submission  
✅ **Responsive Design** - Works on all devices  
✅ **Rate Limiting Ready** - Easy to add rate limiting if needed  

## Database Schema

The `contact_submissions` table includes:
- `id` - Unique identifier
- `name` - Sender's name
- `email` - Sender's email
- `subject` - Message subject
- `message` - Full message content
- `status` - Submission status (unread/read/replied)
- `created_at` - Timestamp

## Customization

### Change Email Template
Edit the email HTML in `/src/app/api/contact/route.ts` around line 45.

### Add More Fields
1. Update the database schema
2. Modify the API route validation
3. Update the contact form component

### Add Spam Protection
Consider adding:
- Google reCAPTCHA
- Rate limiting with Upstash Redis
- Email validation services

## Troubleshooting

### Common Issues:
1. **500 Error**: Check environment variables are set correctly
2. **Email not sending**: Verify Resend API key and domain setup
3. **Database errors**: Ensure Supabase URL and keys are correct
4. **CORS issues**: Make sure API route is in the correct `/app/api/` directory

## Production Deployment

1. Add environment variables to your hosting platform (Vercel/Netlify)
2. Ensure your domain is verified in Resend
3. Set up proper email monitoring and alerts
4. Consider adding analytics to track form submissions

## Security Notes

- Service role key should only be used server-side
- Never expose service role key in client-side code
- Consider adding rate limiting for production
- Validate and sanitize all inputs
- Enable RLS (Row Level Security) policies in Supabase