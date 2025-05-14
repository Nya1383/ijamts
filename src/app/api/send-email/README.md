# Email Service Configuration

This API endpoint handles sending emails for reviewer applications submitted through the "Join as Reviewer" form.

## Setup Instructions

1. Create a `.env.local` file in the root of your project with the following variables:

```
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@ijamts.com
EMAIL_TO=editor@ijamts.com
```

2. Replace the values with your actual email service configuration:

- For Gmail:
  - `EMAIL_HOST`: smtp.gmail.com
  - `EMAIL_PORT`: 587
  - `EMAIL_SECURE`: false
  - `EMAIL_USER`: Your Gmail address
  - `EMAIL_PASS`: Your app password (not your regular Gmail password)
    - To create an app password, go to your Google Account > Security > 2-Step Verification > App passwords
  - `EMAIL_FROM`: The "from" email address (typically same as EMAIL_USER)
  - `EMAIL_TO`: The email address that should receive the reviewer applications

- For other email providers, update the host, port, and secure settings according to your provider's instructions.

## Testing the Email Service

For development and testing purposes, you can use:

1. [Mailtrap](https://mailtrap.io/) - A testing inbox service
2. [Ethereal Email](https://ethereal.email/) - A fake SMTP service for testing

## File Attachments

Currently, the API route does not handle file attachments (CV and photo). In a production environment, you should:

1. Upload the files to a storage service (like Firebase Storage)
2. Include the download URLs in the email
3. Or use a service that can handle file attachments directly

## Security Considerations

- Never commit your email credentials to version control
- Consider using environment variables in a secure hosting platform
- For production, use a transactional email service like SendGrid, Mailgun, or Amazon SES 