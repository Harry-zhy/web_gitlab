import { IFeedbacks } from 'app/entities/feedbacks/feedbacks.model';

export interface IOneFeedback {
  id: number;
  content?: string | null;
  withMultiMedia?: boolean | null;
  imagePath?: string | null;
  videoPath?: string | null;
  feedbacks?: Pick<IFeedbacks, 'id'> | null;
}

export type NewOneFeedback = Omit<IOneFeedback, 'id'> & { id: null };
