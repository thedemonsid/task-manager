import jwt from "jsonwebtoken";
export function verifyJwtToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
