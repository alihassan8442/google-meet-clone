import { redirect } from 'next/navigation';

export default function RootPage() {
  // This instantly sends the user to your /login route
  redirect('/login');
}
// trigger vercel build