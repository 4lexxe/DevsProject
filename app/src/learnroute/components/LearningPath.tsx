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
  const [completedTopics] = useState<string[]>([])

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

        <div className="space-y-6">
          {courseProgress.sections.map((section) => {
            const isExpanded = expandedTopics.includes(section.id.toString())
            const sectionCompleted = section.progress === 100

            return (
              <div
                key={section.id}
                className={`border rounded-lg transition-colors ${
                  sectionCompleted ? "bg-green-50/50 border-green-100" : "bg-white"
                }`}
              >
                <div className="flex items-center p-4 cursor-pointer" onClick={() => toggleTopic(section.id.toString())}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{section.title}</h3>
                      <span className="text-sm text-gray-500">
                        {section.completedContent}/{section.totalContent} completados
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-xs">
                        {section.moduleType}
                      </Badge>
                      <Progress progress={section.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-gray-700">{section.progress}%</span>
                    </div>
                  </div>
                  <Button variant="primary" size="icon" className="ml-4">
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </Button>
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-4 space-y-3">
                      {section.contents.map((content) => {
                        return (
                          <div
                            key={content.id}
                            className={`flex items-center p-3 rounded-lg border transition-colors ${
                              content.isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <Button
                              variant="primary"
                              size="icon"
                              className="h-6 w-6 mr-3"
                              onClick={() => toggleCompletion(content.id, content.isCompleted)}
                            >
                              {content.isCompleted ? (
                                <CheckSquare className="h-4 w-4 text-green-600" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <div 
                              className="flex-1 cursor-pointer" 
                              onClick={() => handleContentClick(content.id)}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{content.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{content.duration} min</span>
                                  {content.timeSpent > 0 && (
                                    <span>• {content.timeSpent} min gastados</span>
                                  )}
                                </div>
                              </div>
                              {content.completedAt && (
                                <p className="text-xs text-green-600 mt-1">
                                  Completado el {new Date(content.completedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
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

