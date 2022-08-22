import { Input, InputProps } from '@chakra-ui/react';
import { useState } from 'react';

export const RequiredInput = (props: InputProps) => {
  const [touched, setTouched] = useState(false);

  return <Input onFocus={() => setTouched(true)} isInvalid={touched && !props.value} {...props} />;
};
