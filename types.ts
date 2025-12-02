export enum ViewState {
  LOADING = 'LOADING',
  HOME = 'HOME',
  VIRTEX = 'VIRTEX',
  GAMES = 'GAMES',
  MIKU = 'MIKU'
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}