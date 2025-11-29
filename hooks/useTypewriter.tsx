"use client"
import { useEffect, useState } from "react";

const useTypewriter = (textToType: string | null, speed: number = 20): string => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [textToType]);

  useEffect(() => {
    if (!textToType || index >= textToType.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + textToType[index]);
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [textToType, index, speed]);

  return displayedText;
};

export default useTypewriter;
