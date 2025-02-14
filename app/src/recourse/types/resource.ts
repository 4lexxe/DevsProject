export enum ResourceType {
  VIDEO = "video",
  DOCUMENT = "document",
  IMAGE = "image",
  LINK = "link",
}

export interface Resource {
  id?: number;
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  isVisible?: boolean;
  coverImage?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  createdAt?: string;
  updatedAt?: string;
}