"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Calendar } from "lucide-react"
import { TaskForm } from "@/components/task-form"
import { TaskCard } from "@/components/task-card"

export interface Task {
  id: string
  title: string
  description?: string
  reminder?: Date
  tags: string[]
  color: string
  completed: boolean
  createdAt: Date
}

const TASK_COLORS = [
  "bg-pink-100 border-pink-200",
  "bg-purple-100 border-purple-200",
  "bg-blue-100 border-blue-200",
  "bg-green-100 border-green-200",
  "bg-yellow-100 border-yellow-200",
  "bg-orange-100 border-orange-200",
]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setTasks((prev) => [newTask, ...prev])
    setShowTaskForm(false)
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Tasks</h1>
          <p className="text-muted-foreground">Stay organized and productive</p>
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <Button onClick={() => setShowTaskForm(true)} className="w-full sm:w-auto" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <TaskForm onSubmit={addTask} onCancel={() => setShowTaskForm(false)} taskColors={TASK_COLORS} />
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No tasks yet</p>
                  <p>Add your first task to get started!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onUpdate={updateTask}
                taskColors={TASK_COLORS}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
