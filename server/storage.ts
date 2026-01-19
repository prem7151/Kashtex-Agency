import { 
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Appointment, type InsertAppointment,
  type ChatLog, type InsertChatLog,
  users, contacts, appointments, chatLogs
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(username: string, password: string): Promise<User | null>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  markContactRead(id: string): Promise<Contact | undefined>;
  
  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  isTimeSlotAvailable(date: string, time: string): Promise<boolean>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  
  // Chat Logs
  createChatLog(chatLog: InsertChatLog): Promise<ChatLog>;
  updateChatLog(id: string, messages: string, visitorName?: string, visitorEmail?: string): Promise<ChatLog | undefined>;
  getChatLogBySession(sessionId: string): Promise<ChatLog | undefined>;
  getChatLogs(): Promise<ChatLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async validatePassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async markContactRead(id: string): Promise<Contact | undefined> {
    const result = await db.update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning();
    return result[0];
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.date, date));
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const existing = await db.select().from(appointments)
      .where(and(
        eq(appointments.date, date),
        eq(appointments.time, time),
        eq(appointments.status, "pending")
      ));
    return existing.length === 0;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const result = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return result[0];
  }

  // Chat Logs
  async createChatLog(chatLog: InsertChatLog): Promise<ChatLog> {
    const result = await db.insert(chatLogs).values(chatLog).returning();
    return result[0];
  }

  async updateChatLog(id: string, messages: string, visitorName?: string, visitorEmail?: string): Promise<ChatLog | undefined> {
    const updateData: Partial<ChatLog> = { 
      messages, 
      updatedAt: new Date() 
    };
    if (visitorName) updateData.visitorName = visitorName;
    if (visitorEmail) updateData.visitorEmail = visitorEmail;
    
    const result = await db.update(chatLogs)
      .set(updateData)
      .where(eq(chatLogs.id, id))
      .returning();
    return result[0];
  }

  async getChatLogBySession(sessionId: string): Promise<ChatLog | undefined> {
    const result = await db.select().from(chatLogs).where(eq(chatLogs.sessionId, sessionId));
    return result[0];
  }

  async getChatLogs(): Promise<ChatLog[]> {
    return db.select().from(chatLogs).orderBy(desc(chatLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();
