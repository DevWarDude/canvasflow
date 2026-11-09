"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCreateProject } from "../hooks/use-projects";

import {
  createProjectSchema,
  type CreateProjectInput,
} from "../schemas/create-project-schema";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  const createMutation = useCreateProject();

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CreateProjectInput) {
    try {
      await createMutation.mutateAsync(values.name);

      form.reset();
      setOpen(false);
    } catch {
      // The mutation error is displayed in the dialog.
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
      createMutation.reset();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={<Button type="button" />}
      >
        <Plus className="size-4" />
        New Project
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Create New Project
          </DialogTitle>

          <DialogDescription>
            Give your website a name to get started.
            Your project will be saved locally.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium"
            >
              Project Name
            </label>

            <Input
              id="project-name"
              placeholder="e.g. My Portfolio"
              autoComplete="off"
              maxLength={60}
              aria-invalid={
                Boolean(form.formState.errors.name)
              }
              aria-describedby={
                form.formState.errors.name
                  ? "project-name-error"
                  : undefined
              }
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p
                id="project-name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {createMutation.isError && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              Unable to save your project. Please check
              your browser storage settings and try again.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending
                ? "Creating..."
                : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}