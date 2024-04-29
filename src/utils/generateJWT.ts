import jwt from "jsonwebtoken";

export default function generateJWT() {
  const payload = {
    data: "your data here",
    // more data fields as needed
  };

  const secret = "your-secret-key";

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return token;
}
