import { useEffect, useState } from 'react';

export default function Delay({ children, wait = 300 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), wait);
    return () => clearTimeout(timer);
  }, [wait, setShow]);

  return show && children;
}
