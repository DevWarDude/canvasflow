"use client";

import { useState, type FormEvent } from "react";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRenameProject, useDeleteProject } from "../hooks/use-projects";

import { createProjectSchema } from "../schemas/create-project-schema";

import type { ProjectSummary } from "../types/project";

interface ProjectActionsProps {
  project: ProjectSummary;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  // Dialog visibility
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form state
  const [name, setName] = useState(project.name);
  const [renameError, setRenameError] = useState<string | null>(null);

  // Mutations
  const renameMutation = useRenameProject();
  const deleteMutation = useDeleteProject();

  function openRenameDialog() {
    setName(project.name);
    setRenameError(null);
    renameMutation.reset();
    setRenameOpen(true);
  }

  function openDeleteDialog() {
    deleteMutation.reset();
    setDeleteOpen(true);
  }

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = createProjectSchema.safeParse({ name });

    if (!result.success) {
      setRenameError(
        result.error.issues[0]?.message ?? "Invalid project name.",
      );
      return;
    }

    setRenameError(null);

    try {
      await renameMutation.mutateAsync({
        id: project.id,
        name: result.data.name,
      });

      setRenameOpen(false);
    } catch {
      setRenameError("Unable to rename project. Please try again.");
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(project.id);

      setDeleteOpen(false);
    } catch {
      // Mutation error is displayed in the confirmation dialog.
    }
  }

  return (
    <>
      {/* Project Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Options for ${project.name}`}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={openRenameDialog}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={openDeleteDialog}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog
        open={renameOpen}
        onOpenChange={(open) => {
          if (!renameMutation.isPending) {
            setRenameOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>

            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRename} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor={`rename-${project.id}`}
                className="text-sm font-medium"
              >
                Project Name
              </label>

              <Input
                id={`rename-${project.id}`}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setRenameError(null);
                }}
                maxLength={60}
                aria-invalid={Boolean(renameError)}
                aria-describedby={
                  renameError ? `rename-error-${project.id}` : undefined
                }
              />

              {renameError && (
                <p
                  id={`rename-error-${project.id}`}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {renameError}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={renameMutation.isPending}
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={renameMutation.isPending}>
                {renameMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!deleteMutation.isPending) {
            setDeleteOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete <strong>{project.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              Unable to delete the project. Please try again.
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
