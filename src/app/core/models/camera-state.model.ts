import { BodyId } from './body-kind.model';

export interface CameraState {
  /** Сдвиг камеры в screen pixels */
  panX: number;
  panY: number;
  /** Множитель зума; 1 = default fit Neptune */
  zoom: number;
  followEnabled: boolean;
  focusBodyId: BodyId | null;
}
