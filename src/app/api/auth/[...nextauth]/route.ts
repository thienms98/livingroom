import { authOptions } from '@/app/utils';
import NextAuth from 'next-auth';

const auth = NextAuth(authOptions)
export {auth as GET, auth as POST};
