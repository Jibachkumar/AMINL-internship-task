import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/user.models.js";

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
      console.log(profile, accessToken, refreshToken);
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

          return done(null, createUser);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
