import { createContext, useContext, useEffect, useState } from "react";

export type Project = {
  id: string;
  url: string;
  name: string;
  description: string;
  tags: Set<string>;
  images: Set<string>;
};

type ProjectContextProps = {
  projects: Map<string, Project>;
};

const initialState: ProjectContextProps = {
  projects: new Map(),
};

export const ProjectContext = createContext<ProjectContextProps>(initialState);

export const useProjectContext = () => useContext(ProjectContext);

type ProjectProviderProps = {
  children: React.ReactNode;
};

async function fetchProjects(): Promise<Map<string, Project>> {
  const res = await fetch("/projects.json");
  const json = await res.json();
  return json.reduce((projects: any, project: any) => {
    return projects.set(project.id, {
      ...project,
      // Convert arrays to sets
      tags: new Set(project.tags || []),
      images: new Set(project.images || []),
    });
  }, new Map());
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetchProjects().then((projects) => {
      setState((state) => ({ ...state, projects }));
      console.info("Fetched projects:", projects);
    });
  }, []);

  return (
    <ProjectContext.Provider value={state}>{children}</ProjectContext.Provider>
  );
}
