import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      salutation, 
      name, 
      qualification, 
      designation, 
      department, 
      organization, 
      disciplineField, 
      researchAreas, 
      orcid, 
      email, 
      mobileNumber, 
      country,
      stateProvince,
      cityDistrict,
      postalCode,
      address
    } = body;

    // Configure nodemailer transporter
    // For production, use your actual email credentials
    // For development, use a testing service like Mailtrap or Ethereal
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create email content
    const htmlContent = `
      <h1>New Reviewer Application Received</h1>
      <p>A new application has been submitted to join the editorial board as a reviewer.</p>
      
      <h2>Personal Information</h2>
      <ul>
        <li><strong>Name:</strong> ${salutation} ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Mobile:</strong> ${mobileNumber}</li>
      </ul>
      
      <h2>Address Information</h2>
      <ul>
        <li><strong>Address:</strong> ${address}</li>
        <li><strong>City/District:</strong> ${cityDistrict}</li>
        <li><strong>State/Province:</strong> ${stateProvince || 'Not provided'}</li>
        <li><strong>Postal Code:</strong> ${postalCode}</li>
        <li><strong>Country:</strong> ${country}</li>
      </ul>
      
      <h2>Professional Information</h2>
      <ul>
        <li><strong>Qualification:</strong> ${qualification}</li>
        <li><strong>Designation:</strong> ${designation}</li>
        <li><strong>Department:</strong> ${department || 'Not provided'}</li>
        <li><strong>Organization:</strong> ${organization}</li>
        <li><strong>Discipline Field:</strong> ${disciplineField}</li>
        <li><strong>Research Areas:</strong> ${researchAreas || 'Not provided'}</li>
        <li><strong>ORCID:</strong> ${orcid || 'Not provided'}</li>
      </ul>
      
      <p>Please note that the applicant has uploaded their CV and photo. These files need to be manually downloaded from the database.</p>
    `;

    // Configure email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@ijamts.com',
      to: process.env.EMAIL_TO || 'editor@ijamts.com',
      subject: 'New Reviewer Application - IJAMTS',
      html: htmlContent,
      replyTo: email,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 