import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertAppointmentSchema, insertChatLogSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectPg from "connect-pg-simple";
import { z } from "zod";
import { sendContactNotification, sendAppointmentNotification } from "./resend";

const PgStore = connectPg(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Require SESSION_SECRET in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  // Trust proxy for secure cookies behind Replit's proxy
  app.set("trust proxy", 1);

  // Session setup with PostgreSQL store
  app.use(
    session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: sessionSecret || "dev-only-secret-change-in-production",
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: "auto",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.validatePassword(username, password);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // ============ AUTH ROUTES ============
  
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        // Explicitly save session before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return next(saveErr);
          }
          return res.json({ 
            success: true, 
            user: { id: user.id, username: user.username } 
          });
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ user: { id: user.id, username: user.username } });
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // ============ CONTACT ROUTES ============
  
  app.post("/api/contacts", async (req, res) => {
    try {
      const validated = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validated);
      
      // Send email notification
      sendContactNotification({
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message
      }).catch(err => console.error("Email notification failed:", err));
      
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Contact creation error:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.patch("/api/admin/contacts/:id/read", requireAuth, async (req, res) => {
    try {
      const contact = await storage.markContactRead(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Mark read error:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  // ============ APPOINTMENT ROUTES ============
  
  app.post("/api/appointments", async (req, res) => {
    try {
      const validated = insertAppointmentSchema.parse(req.body);
      
      // Check for double booking
      const isAvailable = await storage.isTimeSlotAvailable(validated.date, validated.time);
      if (!isAvailable) {
        return res.status(409).json({ 
          message: "This time slot is already booked. Please choose another time." 
        });
      }
      
      const appointment = await storage.createAppointment(validated);
      
      // Send email notification
      sendAppointmentNotification({
        name: validated.name,
        email: validated.email,
        service: validated.service,
        date: validated.date,
        time: validated.time,
        details: validated.details
      }).catch(err => console.error("Email notification failed:", err));
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Appointment creation error:", error);
      res.status(500).json({ message: "Failed to book appointment" });
    }
  });

  app.get("/api/appointments/available", async (req, res) => {
    try {
      const date = req.query.date as string | undefined;
      if (!date) {
        return res.status(400).json({ message: "Date parameter required" });
      }
      
      const bookedAppointments = await storage.getAppointmentsByDate(date);
      const bookedTimes = bookedAppointments
        .filter(a => a.status !== "cancelled")
        .map(a => a.time);
      
      const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
      const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
      
      res.json({ date, availableSlots, bookedTimes });
    } catch (error) {
      console.error("Available slots error:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  app.get("/api/admin/appointments", requireAuth, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.patch("/api/admin/appointments/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Update appointment status error:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // ============ CHAT LOG ROUTES ============
  
  app.post("/api/chat-logs", async (req, res) => {
    try {
      const validated = insertChatLogSchema.parse(req.body);
      const chatLog = await storage.createChatLog(validated);
      res.status(201).json(chatLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Chat log creation error:", error);
      res.status(500).json({ message: "Failed to create chat log" });
    }
  });

  app.patch("/api/chat-logs/:sessionId", async (req, res) => {
    try {
      const { messages, visitorName, visitorEmail } = req.body;
      const sessionId = req.params.sessionId as string;
      
      const existing = await storage.getChatLogBySession(sessionId);
      if (!existing) {
        const chatLog = await storage.createChatLog({
          sessionId,
          messages: JSON.stringify(messages),
          visitorName,
          visitorEmail,
        });
        return res.json(chatLog);
      }
      
      const chatLog = await storage.updateChatLog(existing.id, JSON.stringify(messages), visitorName, visitorEmail);
      res.json(chatLog);
    } catch (error) {
      console.error("Chat log update error:", error);
      res.status(500).json({ message: "Failed to update chat log" });
    }
  });

  app.get("/api/admin/chat-logs", requireAuth, async (req, res) => {
    try {
      const chatLogs = await storage.getChatLogs();
      res.json(chatLogs);
    } catch (error) {
      console.error("Get chat logs error:", error);
      res.status(500).json({ message: "Failed to fetch chat logs" });
    }
  });

  // ============ ADMIN SETUP ROUTE (one-time) ============
  
  // Auto-create admin on startup if doesn't exist
  (async () => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (!existingAdmin) {
        await storage.createUser({
          username: "admin",
          password: "kashtex2026",
        });
        console.log("Default admin account created");
      }
    } catch (error) {
      console.error("Failed to auto-create admin:", error);
    }
  })();

  // GET endpoint for manual setup (browser accessible)
  app.get("/api/admin/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.json({ message: "Admin account already exists. You can login now." });
      }
      
      const admin = await storage.createUser({
        username: "admin",
        password: "kashtex2026",
      });
      
      res.json({ 
        message: "Admin account created successfully!",
        username: admin.username 
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });
  
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin account already exists" });
      }
      
      const admin = await storage.createUser({
        username: "admin",
        password: "kashtex2026",
      });
      
      res.status(201).json({ 
        message: "Admin account created",
        username: admin.username 
      });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Failed to create admin account" });
    }
  });

  return httpServer;
}
