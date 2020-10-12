interface Authenticate {
  secret: string;
  expirationTime: string;
}

export default {
  secret: process.env.JWT_SECRET,
  expirationTime: process.env.JWT_EXPIRATION_TIME,
} as Authenticate;
