import { createContext, useContext, useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  tags: Set<string>;
};

type Projects = Map<string, Project>;

type ProjectContextProps = {
  projects: Projects;
};

const initialState: ProjectContextProps = {
  projects: new Map(),
};

const ProjectContext = createContext<ProjectContextProps>(initialState);

export const useProjectContext = () => useContext(ProjectContext);

type ProjectProviderProps = {
  children: React.ReactNode;
};

async function fetchProjects(): Promise<Projects> {
  const res = await fetch("/projects.json");
  const json = await res.json();
  console.log(json);
  return json.reduce((projects: any, project: any) => {
    if (project.id) {
      projects.set(project.id, {
        ...project,
        tags: new Set(project.tags || []),
      });
    }
    return projects;
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
