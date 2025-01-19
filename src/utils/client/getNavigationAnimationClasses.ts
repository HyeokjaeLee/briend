import type { ANIMATION_TYPE, NAVIGATION_ANIMATION } from '@/stores/global';

interface GetNavigationAnimationClassesParams {
  animationType: ANIMATION_TYPE;
  navigationAnimation: NAVIGATION_ANIMATION;
}

export const getNavigationAnimationClasses = ({
  animationType,
  navigationAnimation,
}: GetNavigationAnimationClassesParams) => {
  const hasAnimation = navigationAnimation !== 'NONE';

  return animationType === 'ENTER'
    ? [
        'animate-duration-150',
        hasAnimation &&
          {
            FROM_LEFT: 'animate-fade-left',
            FROM_RIGHT: 'animate-fade-right',
            FROM_TOP: 'animate-fade-down',
            FROM_BOTTOM: 'animate-fade-up',
          }[navigationAnimation],
      ]
    : [
        'animate-reverse animate-duration-75',
        hasAnimation &&
          {
            FROM_LEFT: 'animate-fade-right',
            FROM_RIGHT: 'animate-fade-left',
            FROM_TOP: 'animate-fade-up',
            FROM_BOTTOM: 'animate-fade-down',
          }[navigationAnimation],
      ];
};
