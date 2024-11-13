'use client';

import { toast } from '@/utils/toast';

const HomePage = () => {
  return (
    <article>
      <button
        onClick={() => {
          toast({
            type: 'fail',
            message: 'ssss',
          });
        }}
      >
        ssss
      </button>
      asfas fas
      <br />f async function asfas f(params:type) {} <br />f async function
      asfas f(params:type) {} <br />f async function asfas f(params:type) {}{' '}
      <br />f async function asfas f(params:type) {} <br />f async function
      asfas f(params:type) {}
    </article>
  );
};

export default HomePage;
