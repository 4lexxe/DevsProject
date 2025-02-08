import HeroSection from "../components/Hero"
import RoadmapDescription from "../components/RoadmapDescription"
import LearningPath from "../components/LearningPath"

export default function LearnRoute() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <RoadmapDescription />
      <LearningPath />
    </div>
  )
}