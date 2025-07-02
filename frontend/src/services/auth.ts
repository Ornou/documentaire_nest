import { client, LOGIN_MUTATION, REGISTER_MUTATION } from "./graphql";
import Cookies from "js-cookie";

export const authService = {
  async login(email: string, password: string) {
    const result = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });

    const { access_token, user } = result.data.login;

    // Store token in cookie
    Cookies.set("token", access_token, { expires: 7 }); // 7 days

    return { access_token, user };
  },

  async register(name: string, email: string, password: string) {
    const result = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        registerInput: {
          name,
          email,
          password,
        },
      },
    });

    const { access_token, user } = result.data.register;

    // Store token in cookie
    Cookies.set("token", access_token, { expires: 7 }); // 7 days

    return { access_token, user };
  },

  logout() {
    Cookies.remove("token");
    // Clear Apollo cache on logout
    client.clearStore();
  },

  isAuthenticated() {
    return !!Cookies.get("token");
  },

  getToken() {
    return Cookies.get("token");
  },
};
