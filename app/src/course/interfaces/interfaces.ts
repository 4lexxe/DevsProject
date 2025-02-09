export interface ICourseInput {
  title: string;
  image: string;
  summary: string;
  category: string;
  about: string;
  relatedCareerType: string;
  learningOutcomes: string[] | "";
  isActive: boolean;
  isInDevelopment: boolean;
  Sections: ISection[];
}

export interface ICourse {
  id: string;
  title: string;
  image: string;
  category: string;
  relatedCareerType?: string;
  summary: string;
  about: string;
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
}


export interface ICourseState {
  sections: ISection[];
  editingSection: ISection | null;
  isAddingSection: boolean;
  editingContent: IContent | null;
  isAddingContent: boolean;
  currentSectionId: string | null;
}

export interface ISection {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  contents: IContent[];
}

export interface ISectionInput {
  title: string
  description: string
  moduleType: string
  coverImage: string
}

export interface ISectionState {
  sections: ISection[];
  editingSection: ISection | null;
  isAddingSection: boolean;
}

export interface IContent {
  id: string;
  sectionId: string;
  type: string;
  contentText?: string;
  contentTextTitle?: string;
  contentVideo?: string;
  contentVideoTitle?: string;
  contentImage?: string;
  contentImageTitle?: string;
  contentFile?: string;
  contentFileTitle?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  quizTitle?: string;
  quizContent?: string;
  questions?: string[] | string;
  duration?: number;
  position: number;
}

export interface IContentInput {
  type: string;
  contentText?: string;
  contentTextTitle?: string;
  contentVideo?: string;
  contentVideoTitle?: string;
  contentImage?: string;
  contentImageTitle?: string;
  contentFile?: string;
  contentFileTitle?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  quizTitle?: string;
  quizContent?: string;
  questions?: string[] | string;
  duration?: number;
  position: number | 0;
}

export interface IContentState {
  contents: IContent[];
  editingContent: IContent | null;
  isAddingContent: boolean;
  currentSectionId: string | null;
}



export interface SectionListProps {
  sections: ISectionInput[];
  contents: IContentInput[];
  onAddSection: () => void;
  onEditSection: (section: ISectionInput) => void;
  onDeleteSection: (id: string) => void;
  onAddContent: (sectionId: string) => void;
  onEditContent: (content: IContentInput) => void;
  onDeleteContent: (id: string) => void;
} 