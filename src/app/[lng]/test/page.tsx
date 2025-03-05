'use client';

import { Ri24HoursFill } from 'react-icons/ri';

import { Button, Input, InputDecorator } from '@/components';
import { toast } from '@/utils/client';

import { Checkbox } from './checkbox';

export default function TestPage() {
  return (
    <article className="p-4">
      <Button size="8" onlyIcon>
        <Ri24HoursFill />
      </Button>
      <Button
        onClick={() =>
          toast({
            message: Math.random().toString(),
          })
        }
      >
        Toast
      </Button>
      <InputDecorator label="Checkbox" type="checkbox">
        <Checkbox />
      </InputDecorator>
      <InputDecorator label="Input" type="input">
        <Input />
      </InputDecorator>
    </article>
  );
}

export const dynamic = 'force-static';
