import { getGlucoseStatus } from '@/src/data/appleHealthGlucose';
import { colors } from '@/src/theme/colors';

export function getGlucoseStatusColor(value: number | undefined, unknownColor = colors.sage) {
  switch (getGlucoseStatus(value)) {
    case 'low':
      return colors.rose;
    case 'high':
      return colors.amber;
    case 'inRange':
      return colors.sage;
    case 'unknown':
      return unknownColor;
  }
}
