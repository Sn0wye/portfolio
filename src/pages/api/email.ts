import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function SendMail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const data = req.body;

      const mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      const mailDetails = {
        from: data.name,
        to: process.env.NODEMAILER_USER,
        subject: `${data.name} - via snowye.dev`,
        text: data.message,
      };

      await mailTransporter.sendMail(mailDetails, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
      });
      return res.status(200).json({ message: 'Email sent' });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: `Email not sent - Error: ${err.message}` });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
