import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/user.models.js";
import logger from "./logger.js";

dotenv.config({
  path: "./.env",
});

// passport: Passport's sole purpose is to authenticate requests, verifying credentials
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/api/v1/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // look up user in DB
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const createUser = await User.create({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails?.[0]?.value,
            coverImage: {
              url: profile.photos?.[0]?.value || "",
              public_id: null,
            },
            address: "",
            phoneNumber: "",
          });
          logger.info("New user created via Google");
          return done(null, createUser);
        }

        logger.info("Existing user logged in via Google OAuth");
        return done(null, user);
      } catch (error) {
        logger.error("Error in Google OAuth strategy", {
          error: error.message,
        });
        return done(error, null);
      }
    }
  )
);

export default passport;
