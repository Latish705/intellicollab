import { getCurrentUserToken } from "./firebase";

export class AuthApi {
  static superBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  static baseUrl = "api/v1/user";

  static async login() {
    const token = await getCurrentUserToken();
    console.log("url is", `${this.superBaseUrl}/${this.baseUrl}/login`);

    const response = await fetch(`${this.superBaseUrl}/${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Login response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  }

  static async register(fullName: string) {
    const token = await getCurrentUserToken();
    console.log("url is", `${this.superBaseUrl}/${this.baseUrl}/register`);
    const response = await fetch(
      `${this.superBaseUrl}/${this.baseUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName }),
      }
    );

    console.log("Register response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  }
}
