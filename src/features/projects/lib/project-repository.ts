import { openDB, type DBSchema } from "idb";

import type { ProjectSummary } from "../types/project";
import { createProjectSchema } from "../schemas/create-project-schema";

interface CanvasFlowDatabase extends DBSchema {
  projects: {
    key: string;
    value: ProjectSummary;
  };
}

const DATABASE_NAME = "canvasflow-db";
const DATABASE_VERSION = 1;

function getDatabase() {
  return openDB<CanvasFlowDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects", {
          keyPath: "id",
        });
      }
    },
  });
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const db = await getDatabase();

  const projects = await db.getAll("projects");

  return projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function createProject(name: string): Promise<ProjectSummary> {
  const db = await getDatabase();

  const timestamp = new Date().toISOString();

  const project: ProjectSummary = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.add("projects", project);

  return project;
}

// Rename an existing project
export async function renameProject({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<ProjectSummary> {
  const db = await getDatabase();

  const validated = createProjectSchema.parse({ name });

  const project = await db.get("projects", id);

  if (!project) {
    throw new Error("Project not found");
  }

  const updatedProject: ProjectSummary = {
    ...project,
    name: validated.name,
    updatedAt: new Date().toISOString(),
  };

  await db.put("projects", updatedProject);

  return updatedProject;
}

// Delete an existing project
export async function deleteProject(id: string): Promise<void> {
  const db = await getDatabase();

  const project = await db.get("projects", id);

  if (!project) {
    throw new Error("Project not found");
  }

  await db.delete("projects", id);
}
