// services/auth.service.ts

import { userModel } from "../model/userModel.js";
import { refreshTokenModel } from "../model/refreshTokenModel.js";
import { parseExpirationToMs } from "../helpers/parseExpirationToMs.js";
import {
  JWT_SECRET,
  JWT_SECRET_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_SECRET_EXPIRATION,
} from "../config/env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";
import { UnauthorizedError } from "../utils/errors.js";

export const authService = {
  /**
   * @description Validates user credentials and generates a token pair upon success.
   * @param email The user's email.
   * @param password The user's plain-text password.
   * @returns An object containing the accessToken and refreshToken.
   */
  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Find the user by email.
    const user = await userModel.findByEmail(email);
    if (!user) {
      // Don't specify what is wrong to prevent email enumeration attacks.
      throw new UnauthorizedError("Invalid credentials");
    }

    // 2. Compare the provided password with the hash in the DB.
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 3. Create the payload for the JWT.
    const payload: JwtPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.client_id,
    };

    // 4. Generate the tokens using settings from the environment config.
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_SECRET_EXPIRATION } as jwt.SignOptions
    );
    const refreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET as jwt.Secret,
      { expiresIn: JWT_REFRESH_SECRET_EXPIRATION } as jwt.SignOptions
    );

    // 5. Save the refresh token to the database for security.
    await refreshTokenModel.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(
        Date.now() + parseExpirationToMs(JWT_REFRESH_SECRET_EXPIRATION)
      ),
    });

    return { accessToken, refreshToken };
  },

  /**
   * @description Refreshes the access token using a valid refresh token.
   * @param refreshToken The refresh token to validate and use for generating a new access token.
   * @returns An object containing the new accessToken and a new refreshToken.
   */
  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    // 1. Find the refresh token in the database.
    const tokenRecord = await refreshTokenModel.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
    // 2. Verify the refresh token.
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET as jwt.Secret
      ) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
    // 3. Create a new payload for the new tokens.
    const payload: JwtPayload = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId,
    };
    // 4. Generate new tokens.
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_SECRET_EXPIRATION } as jwt.SignOptions
    );
    const newRefreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET as jwt.Secret,
      { expiresIn: JWT_REFRESH_SECRET_EXPIRATION } as jwt.SignOptions
    );
    // 5. Update the refresh token in the database.
    await refreshTokenModel.update(tokenRecord.id, { token: newRefreshToken });
    return { accessToken, newRefreshToken };
  },

  /**
   * @description Logs a user out by deleting their refresh token.
   * @param refreshToken The token to invalidate.
   */
  async logoutUser(refreshToken: string): Promise<void> {
    await refreshTokenModel.removeByToken(refreshToken);
  },
};
