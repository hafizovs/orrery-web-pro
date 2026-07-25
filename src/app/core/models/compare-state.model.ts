import { BodyId } from './body-kind.model';

export interface CompareState {
  open: boolean;
  bodyIds: BodyId[]; // 0..3
}
