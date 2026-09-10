import { api } from "@/services/api";
import type { Project, ProjectPayload, ProjectQueryParams } from "@/types/project";

interface ProjectListResponse {
  data: Project[];
}

interface ProjectResponse {
  data: Project;
}

export const projectService = {
  async getAll(params: ProjectQueryParams = {}): Promise<Project[]> {
    const response = await api.get<ProjectListResponse>("/projects", { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Project> {
    const response = await api.get<ProjectResponse>(`/projects/${id}`);
    return response.data.data;
  },

  async create(payload: ProjectPayload): Promise<Project> {
    const response = await api.post<ProjectResponse>("/projects", payload);
    return response.data.data;
  },

  async update(id: number, payload: ProjectPayload): Promise<Project> {
    const response = await api.put<ProjectResponse>(`/projects/${id}`, payload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
