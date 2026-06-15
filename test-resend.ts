import { Resend } from 'resend';

const resend = new Resend('re_31vrLGmd_HNuYUaDqhj5hRSuvMYrppKHw');

async function testEmail() {
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'usmansethi016@gmail.com',
    subject: 'test email',
    html: '<p>test</p>'
  });
  console.log(result);
}

testEmail();
