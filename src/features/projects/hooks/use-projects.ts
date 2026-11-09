"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  getProjects,
} from "../lib/project-repository";

const PROJECTS_QUERY_KEY = ["projects"] as const;

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROJECTS_QUERY_KEY,
      });
    },
  });
}