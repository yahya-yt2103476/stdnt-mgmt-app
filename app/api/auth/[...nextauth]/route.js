import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import UserRepo from "../../../repos/user-repo.js"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials:{
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
            usertype: {label: "user type", type: "text"}
          },

          async authorize(credentials, req) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                usertype: credentials.usertype
              }),
            });
          
            const user = await res.json();
          
            if (res.ok && user) {
              return user;
            }
            return null;
          }
    })

  ],
  callbacks: {
    /*
      The jwt callback is called whenever a JSON Web Token is created 
      (i.e. at sign in) or whenever a session is accessed 
      in the client. 
      The returned value will be encrypted, and it is stored in a cookie.
      It allows you to add additional properties to the token.

      Requests to /api/auth/signin, /api/auth/session 
      and calls to getSession(), getServerSession(), useSession() 
      will invoke this function.
    */
    async jwt({ token, user }) {
      // Add access_token and the user object to the JWT
      return { ...token, ...user }
    },

    //send the entire session details (according to the Dr. docs). called when any of these get called  getSession(), useSession(), /api/auth/session)
    async session({ session, token }) {
      session.user = token
      return session
    },
  },
});

export { handler as GET, handler as POST };