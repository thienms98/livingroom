import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import Github from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    // EmailProvider({
    //   // server: process.env.MAIL_SERVER,
    //   from: 'thienms98@gmail.com',
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    // // Sign in with passwordless email link
    Github({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
};