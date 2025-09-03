"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Edit2, Check } from "lucide-react"
import { TaskForm } from "./task-form"
import type { Task } from "@/app/page"

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  taskColors: string[]
}

export function TaskCard({ task, onDelete, onUpdate, taskColors }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = (updatedTask: Omit<Task, "id" | "createdAt">) => {
    onUpdate(task.id, updatedTask)
    setIsEditing(false)
  }

  const toggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  if (isEditing) {
    return (
      <Card className={task.color}>
        <CardContent className="p-6">
          <TaskForm
            initialTask={task}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            taskColors={taskColors}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${task.color} transition-all duration-200 hover:shadow-md ${task.completed ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm mt-1 ${
                  task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant={task.completed ? "default" : "outline"} onClick={toggleComplete}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {task.reminder && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(task.reminder)}</span>
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
