export enum ResourceType {
  VIDEO = "video",
  DOCUMENT = "document",
  IMAGE = "image",
  LINK = "link",
}

export interface Resource {
  id: number;
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  userId: number;
  userName: string;
  userAvatar?: string | null;
  isVisible: boolean;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateResourceDTO {
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  coverImage?: string;
}

export interface UpdateResourceDTO extends Partial<CreateResourceDTO> {
  isVisible?: boolean;
}