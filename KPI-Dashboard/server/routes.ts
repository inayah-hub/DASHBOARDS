import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.projects.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(id, input);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // Initialize seed data
  await seedDatabase();

  return httpServer;
}

// Seed function to populate data if empty
async function seedDatabase() {
  const existing = await storage.getProjects();
  if (existing.length === 0) {
    await storage.createProject({ clientName: "Acme Corp", projectNo: "P-101", media: "Video", status: "In Progress" });
    await storage.createProject({ clientName: "Globex", projectNo: "P-102", media: "Web", status: "Completed" });
    await storage.createProject({ clientName: "Soylent", projectNo: "P-103", media: "Social", status: "In Progress" });
    await storage.createProject({ clientName: "Initech", projectNo: "P-104", media: "Video", status: "In Progress" });
  }
}
