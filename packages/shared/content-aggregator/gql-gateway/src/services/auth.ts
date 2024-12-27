/**
     * Authentication middleware for the Gateway server.
     * This file handles user authentication and attaches user context to each request.
     */
    import jwt from "jsonwebtoken";
    import { Request } from "express";

    /**
     * Builds the context for each request.
     * Decodes and validates the JWT token from the Authorization header, 
     * and attaches the user information to the context.
     *
     * @param req - Incoming HTTP request
     * @returns User context
     */
    export const buildContext = async (req: Request) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new Error("Unauthorized: Missing Authorization header");
      }

      const token = authHeader.replace("Bearer ", "").trim();

      try {
        // Validate the token
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_secret"
        );

        // Attach user to context
        return { user: decodedToken };
      } catch (err) {
        throw new Error("Unauthorized: Invalid token");
      }
    };
