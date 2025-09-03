"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag, Palette, X } from "lucide-react"
import type { Task } from "@/app/page"

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  onCancel: () => void
  taskColors: string[]
  initialTask?: Task
}

export function TaskForm({ onSubmit, onCancel, taskColors, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "")
  const [description, setDescription] = useState(initialTask?.description || "")
  const [reminder, setReminder] = useState(initialTask?.reminder ? initialTask.reminder.toISOString().slice(0, 16) : "")
  const [tags, setTags] = useState<string[]>(initialTask?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [selectedColor, setSelectedColor] = useState(initialTask?.color || taskColors[0])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      reminder: reminder ? new Date(reminder) : undefined,
      tags,
      color: selectedColor,
      completed: initialTask?.completed || false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="reminder" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Reminder (Optional)
        </Label>
        <Input
          id="reminder"
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4" />
          Tags
        </Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4" />
          Task Color
        </Label>
        <div className="flex gap-2 flex-wrap">
          {taskColors.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-lg border-2 ${color} ${
                selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {initialTask ? "Update Task" : "Add Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
