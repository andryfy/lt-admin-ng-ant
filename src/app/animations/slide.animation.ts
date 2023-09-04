import { animate, animateChild, AnimationQueryOptions, group, query, style, transition, trigger } from '@angular/animations';

const options: AnimationQueryOptions = {
  optional: true
};

/** Horizontal sliding route animation */
export const horizontalSlideInRouteAnimation = trigger('horizontalSlideInRouteAnimation', [
  transition(':increment', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        }),
        animateChild()
      ],
      options
    ),

    query(':enter', [style({ transform: 'translate3d(100%,0,0)' })], options),

    group([query(':leave', [animate('.3s ease-out', style({ transform: 'translate3d(-100%,0,0)' }))], options), query(':enter', [animate('.3s ease-out', style({ transform: 'none' }))], options)])
  ]),

  transition(':decrement', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        }),
        animateChild()
      ],
      options
    ),

    query(':enter', [style({ transform: 'translate3d(-100%,0,0)' })], options),

    group([query(':leave', [animate('.3s ease-out', style({ transform: 'translate3d(100%,0,0)' }))], options), query(':enter', [animate('.3s ease-out', style({ transform: 'none' }))], options)])
  ])
]);

/** Swipe down to expand when entering */
export const slideDownOnEnterAnimation = trigger('slideDownOnEnterAnimation', [
  transition(':enter', [
    style({
      overflow: 'hidden',
      height: 0,
      opacity: 0
    }),
    animate(
      '.125s ease-out',
      style({
        height: '*',
        opacity: 1
      })
    )
  ])
]);

/** Swipe up to collapse when leaving */
export const slideUpOnLeaveAnimation = trigger('slideUpOnLeaveAnimation', [
  transition(':leave', [
    style({ overflow: 'hidden' }),
    animate(
      '.125s ease-out',
      style({
        height: 0,
        opacity: 0
      })
    )
  ])
]);
