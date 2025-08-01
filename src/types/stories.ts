export interface Story {
  id: number;
  image: string | null;
  text: string;
  color: string;
}

export interface Highlight {
  id: number;
  name: string;
  stories: number[];
  thumbnail?: string;
}
