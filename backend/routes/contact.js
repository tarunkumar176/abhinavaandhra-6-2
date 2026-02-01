import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Nodemailer Transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

// Submit Contact Form
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        console.log(`📩 Received contact form submission from ${email}`);

        // Email to Admin (You)
        const mailOptions = {
            from: `"${name}" <${email}>`, // Shows as sender name, but actually sent via your auth
            to: process.env.ADMIN_EMAIL || 'abhinava.andhra.news@gmail.com', // Where you receive it
            subject: `New Contact Message from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Message:
        ${message}
      `,
            html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('✅ Email notification sent successfully');

        res.json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('❌ Error sending contact email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message via email server'
        });
    }
});

export default router;
