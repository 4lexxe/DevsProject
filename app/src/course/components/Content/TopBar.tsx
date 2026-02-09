import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getContentUrl } from "@/shared/utils/courseUrl";

interface TopBarProps {
  reloadContent?: () => void;
  title?: string;
  courseSlug?: string;
  courseId?: string;
  prev: string | null;
  next: string | null;
}

export default function TopBar({
  courseSlug,
  courseId,
  prev,
  next,
  title,
  reloadContent,
}: TopBarProps) {
  const courseIdentifier = courseSlug || courseId || '';
  
  return (
    <div
      className="flex items-center justify-between h-12 px-2 rounded-lg"
      style={{ backgroundColor: "#f2f6f9" }}
    >
      {prev ? (
        <Link
          to={getContentUrl(courseIdentifier, prev)}
          className="p-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          <MoveLeft />
        </Link>
      ) : (
        <div className="p-2" />
      )}

      <h1 className="text-center font-medium text-sm sm:text-base truncate max-w-[70%]">
        {title ? title : "Título del contenido"}
      </h1>

      {next ? (
        <Link
          to={getContentUrl(courseIdentifier, next)}
          className="p-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          <MoveRight />
        </Link>
      ) : (
        <div className="p-2" />
      )}
    </div>
  );
}
