// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";
// import { customFetch, refreshAccessToken } from "@/lib/server-actions";
// import { FetchResult, User } from "@/lib/types";
// import { loginUser, verifyUser } from "@/lib/server-actions/auth";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         username: {},
//         password: {},
//         code: {},
//       },
//       async authorize(credentials) {
//         const {
//           username,
//           password,
//           code,
//         }: { username?: string; password?: string; code?: string } = credentials as any;

//         if (!username) throw new Error('Username not included');

//         const res = password
//           ? await loginUser({ username, password })
//           : code
//           ? await verifyUser({ username, code })
//             : undefined;
        
//         if (res?.hasError) throw new Error(res.message);

//         if (!res?.data) return null;

//         // accessing the accessToken returned by server
//         const { accessToken, refreshToken } = res.data;

//         // You can make more request to get other information about the user eg. Profile details
//         const userRes = await customFetch(`/profile`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         const user = await userRes.json() as FetchResult<User | null>;

//         if (user?.hasError) throw new Error(user.message);

//         if (!user?.data) return null;

//         // return user credentials together with accessToken
//         return {
//           ...user.data,
//           accessToken,
//           refreshToken,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, account, user, trigger, session }) => {
//       // user is only available the first time a user signs in authorized
//       if (token.accessToken) {
//         const decodedToken = jwtDecode(token.accessToken);

//         token.accessTokenExpires = (decodedToken?.exp || 0) * 1000;
//       }

//       // Return new token if this is the first time logging in
//       if (account && user) return {
//           ...token,
//           accessToken: user.accessToken,
//           refreshToken: user.refreshToken,
//           user,
//         };

//       // Return previous token if the access token has not expired yet
//       if (Date.now() < token.accessTokenExpires) {
//         // Update the previous session if update action is triggered
//         if (trigger === 'update' && session?.user) {
//           return {
//             ...token,
//             user: session.user,
//           }
//         }

//         // Return the previous session
//         return token;
//       };

//       // Access token has expired, try to update it
//       const newToken = await refreshAccessToken(token);

//       if (newToken) {
//         // Update the previous session if update action is triggered
//         if (trigger === "update" && session?.user) {
//           return {
//             ...newToken,
//             user: session.user,
//           };
//         }

//         // Return the previous session with the new token
//         return newToken;
//       }

//       // Access token could not be refreshed
//       return null;
//     },
//     session: async ({ session, token }) => {
//       if (token) {
//         session.accessToken = token.accessToken;
//         session.user = token.user;
//       }

//       return session;
//     },
//     authorized: async ({ auth, request }) => {
//       if (
//         !request.nextUrl.pathname.startsWith("/account") &&
//         !request.nextUrl.pathname.startsWith("/checkout")
//       )
//         return true;

//       if (!auth?.accessToken) return false

//       const decodedToken = jwtDecode(auth.accessToken)

//       if (!decodedToken.exp) return false

//       const accessTokenExpires = decodedToken.exp * 1000;

//       return Date.now() < accessTokenExpires
//     }
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 1 day
//   },
//   pages: {
//     signIn: "/sign-in",
//   }
// });



import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { customFetch, refreshAccessToken } from "@/lib/server-actions";
import { FetchResult, User } from "@/lib/types";
import { loginUser, verifyUser } from "@/lib/server-actions/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
        code: {},
      },
      async authorize(credentials, request) {
        const {
          username,
          password,
          code,
        }: { username?: string; password?: string; code?: string } = credentials as any;

        if (!username) throw new Error('Username not included');

        const res = password
          ? await loginUser({ username, password })
          : code
          ? await verifyUser({ username, code })
            : undefined;
        
        if (res?.hasError) throw new Error(res.message);

        if (!res?.data) return null;

        // accessing the accessToken returned by server
        const { accessToken, refreshToken } = res.data;

        // You can make more requests to get other information about the user e.g., Profile details
        const userRes = await customFetch(`/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = await userRes.json() as FetchResult<User | null>;

        if (user?.hasError) throw new Error(user.message);

        if (!user?.data) return null;

        // Ensure userRoleType is included
        return {
          ...user.data,
          accessToken,
          refreshToken,
          userRoleType: user.data.userRoleType || "user", // Default role if missing
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, user, trigger, session }) => {
      // user is only available the first time a user signs in authorized
      if (token.accessToken) {
        const decodedToken = jwtDecode(token.accessToken);

        token.accessTokenExpires = (decodedToken?.exp || 0) * 1000;
      }

      // Return new token if this is the first time logging in
      if (account && user) return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user,
        };

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        // Update the previous session if update action is triggered
        if (trigger === 'update' && session?.user) { 
          return {
            ...token,
            user: session.user,
          }
        }

        // Return the previous session
        return token;
      };

      // Access token has expired, try to update it
      const newToken = await refreshAccessToken(token);

      if (newToken) {
        // Update the previous session if update action is triggered
        if (trigger === "update" && session?.user) {
          return {
            ...newToken,
            user: session.user,
          };
        }

        // Return the previous session with the new token
        return newToken;
      }

      // Access token could not be refreshed
      return null;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = token.user;
      }

      return session;
    },
    authorized: async ({ auth, request }) => {
      if (
        !request.nextUrl.pathname.startsWith("/account") &&
        !request.nextUrl.pathname.startsWith("/checkout")
      )
        return true;

      if (!auth?.accessToken) return false

      const decodedToken = jwtDecode(auth.accessToken)

      if (!decodedToken.exp) return false

      const accessTokenExpires = decodedToken.exp * 1000;

      return Date.now() < accessTokenExpires
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/sign-in",
  }
});
