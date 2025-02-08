"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, CheckSquare, Square, BookOpen, Play, GraduationCap } from "lucide-react"
//import  ButtonRoadmap  from "@/shared/components/buttons/ButtonRoadmap"
import { Badge } from "./Badge"
import { Button } from "./Button"



interface Resource {
  type: "Docs" | "Video" | "Test"
  title: string
  url: string
}

interface Topic {
  id: string
  title: string
  completed: boolean
  resources: Resource[]
  description?: string
}

interface Level {
  number: number
  title: string
  goal: string
  topics: Topic[]
}

const currentLevel: Level = {
  number: 1,
  title: "Beginner Level",
  goal: "Create your very first simple Laravel project.",
  topics: [
    {
      id: "1",
      title: "Routing and Controllers: Basics",
      completed: false,
      resources: [
        { type: "Test", title: "Let's Test Your Laravel Routing Skills: Complete 12 Tasks", url: "#" },
        { type: "Docs", title: "Basic Routing", url: "#" },
        { type: "Docs", title: "View Routes", url: "#" },
      ],
    },
    {
      id: "2",
      title: "Callback Functions and Route::view()",
      completed: false,
      resources: [
        { type: "Docs", title: "Basic Routing", url: "#" },
        { type: "Docs", title: "View Routes", url: "#" },
      ],
    },
    {
      id: "3",
      title: "Routing to a Single Controller Method",
      completed: false,
      resources: [{ type: "Docs", title: "Basic Controllers with Routes", url: "#" }],
    },
    {
      id: "4",
      title: "Route Parameters",
      completed: false,
      resources: [{ type: "Docs", title: "Route Parameters", url: "#" }],
    },
    {
      id: "5",
      title: "Route Naming",
      completed: false,
      resources: [
        { type: "Docs", title: "Named Routes", url: "#" },
        { type: "Video", title: "Laravel: Why You Need Route Names?", url: "#" },
      ],
    },
    {
      id: "6",
      title: "Route Groups",
      completed: false,
      resources: [
        { type: "Docs", title: "Route Groups", url: "#" },
        { type: "Video", title: "Laravel Route Grouping: Simple to Very Complex", url: "#" },
      ],
    },
  ],
}

export default function LearningPath() {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])
  const [completedTopics, setCompletedTopics] = useState<string[]>([])

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((current) =>
      current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId],
    )
  }
  // Logica de seleccion a comppletar ;v
  /*const toggleCompletion = (topicId: string) => {
    setCompletedTopics((current) =>
      current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId],
    )
  }*/

  //const progress = (completedTopics.length / currentLevel.topics.length) * 100*/

  const ResourceIcon = {
    Docs: BookOpen,
    Video: Play,
    Test: GraduationCap,
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Level {currentLevel.number}/5: {currentLevel.title}
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {completedTopics.length} of {currentLevel.topics.length} completed
            </span>
          </div>
          {/*<Progress value={progress} className="h-2" /> Barra de Progreso a futuro logica*/}
          <p className="mt-4 text-gray-600">Goal: {currentLevel.goal}</p>
        </div>

        <div className="space-y-4">
          {currentLevel.topics.map((topic) => {
            const isExpanded = expandedTopics.includes(topic.id)
            const isCompleted = completedTopics.includes(topic.id)

            return (
              <div
                key={topic.id}
                className={`border rounded-lg transition-colors ${
                  isCompleted ? "bg-green-50/50 border-green-100" : "bg-white"
                }`}
              >
                <div className="flex items-center p-4 cursor-pointer" onClick={() => toggleTopic(topic.id)}>
                  <Button
                    variant="primary"
                    size="icon"
                    className="h-6 w-6 mr-2"

                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium">{topic.title}</h3>
                  </div>
                  <Button variant="primary" size="icon" className="ml-2" onClick={() => toggleTopic(topic.id)}>
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </Button>
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-8 space-y-3">
                      {topic.resources.map((resource, index) => {
                        const Icon = ResourceIcon[resource.type]
                        return (
                          <a
                            key={index}
                            href={resource.url}
                            className="flex items-center space-x-3 text-sm hover:text-blue-600 transition-colors"
                          >
                            <Badge
                              variant={
                                resource.type === "Test"
                                  ? "destructive"
                                  : resource.type === "Video"
                                    ? "secondary"
                                    : "default"
                              }
                              className="w-16 justify-center"
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {resource.type}
                            </Badge>
                            <span>{resource.title}</span>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

