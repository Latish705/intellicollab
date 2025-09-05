export class AuthApi {
  static superBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  static baseUrl = "api/auth";

  static async login() {
    const response = await fetch(`${this.superBaseUrl}/${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  }

  static async register(fullName: string) {
    const response = await fetch(
      `${this.superBaseUrl}/${this.baseUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fullName }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  }
}
