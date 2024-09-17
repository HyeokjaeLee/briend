'use client';

import { motion } from 'framer-motion';

import { useHistoryStore } from '@/stores/history';

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction * 100 + '%',
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: direction * -100 + '%',
    };
  },
};

const Template = ({ children }: { children: React.ReactNode }) => {
  const lastRouteType = useHistoryStore(({ lastRouteType }) => lastRouteType);
  const className = 'flex-1 overflow-auto';

  const isFirstRender = !lastRouteType || lastRouteType === 'reload';

  return isFirstRender ? (
    <main className={className}>{children}</main>
  ) : (
    <motion.main
      animate="animate"
      className={className}
      custom={lastRouteType === 'back' ? -1 : 1}
      exit="exit"
      initial="initial"
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      variants={variants}
    >
      {children}
    </motion.main>
  );
};

export default Template;

/**
 *  <motion.main
      animate="animate"
      className="flex-1 overflow-auto"
      custom={lastRouteType === 'back' ? -1 : 1}
      exit="exit"
      initial="initial"
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      variants={variants}
    >
      {children}
    </motion.main>
 */
