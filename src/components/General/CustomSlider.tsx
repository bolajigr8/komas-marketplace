"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";

type PropsType = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  rows?: number | ResponsiveRows;
  customArrows?: { prev: React.ReactElement; next: React.ReactElement };
  autoplay?: boolean;
  autoplayDelay?: number;
  classNames?: {
    outerWrapper?: string;
    innerWrapper?: string;
    innerWrapperItem?: string;
    customArrowWrapper?: string;
  };
};

type ResponsiveRows = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
};

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

// Add the hook definition
const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect).off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

const DEFAULT_BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const CustomSlider = ({
  options,
  children,
  classNames,
  rows = 1,
  customArrows,
  autoplay = false,
  autoplayDelay = 5000,
}: PropsType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const isSm = useMediaQuery(`(min-width: ${DEFAULT_BREAKPOINTS.sm})`);
  const isMd = useMediaQuery(`(min-width: ${DEFAULT_BREAKPOINTS.md})`);
  const isLg = useMediaQuery(`(min-width: ${DEFAULT_BREAKPOINTS.lg})`);
  const isXl = useMediaQuery(`(min-width: ${DEFAULT_BREAKPOINTS.xl})`);
  const is2Xl = useMediaQuery(`(min-width: ${DEFAULT_BREAKPOINTS["2xl"]})`);

  const currentRows = useMemo(() => {
    if (typeof rows === "number") return rows;

    if (is2Xl && rows["2xl"]) return rows["2xl"];
    if (isXl && rows.xl) return rows.xl;
    if (isLg && rows.lg) return rows.lg;
    if (isMd && rows.md) return rows.md;
    if (isSm && rows.sm) return rows.sm;
    return rows.base || 1;
  }, [rows, isSm, isMd, isLg, isXl, is2Xl]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const columnsDivided = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const totalChildren = childrenArray.length;

    const remainder = totalChildren % currentRows;
    const needsExtra = remainder !== 0;
    const extraItems = needsExtra ? currentRows - remainder : 0;

    const adjustedChildren = needsExtra
      ? [
          ...childrenArray,
          ...Array.from({ length: extraItems }, (_, i) =>
            React.cloneElement(
              childrenArray[i % childrenArray.length] as React.ReactElement,
              {
                key: `extra-${i}`,
              }
            )
          ),
        ]
      : childrenArray;

    return chunk(adjustedChildren, currentRows);
  }, [children, currentRows]);

  useEffect(() => {
    if (!autoplay) return;

    const startAutoplay = () => {
      stopAutoplay();
      autoplayRef.current = setInterval(() => {
        if (!emblaApi) return;
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, autoplayDelay);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };

    startAutoplay();

    if (emblaApi) {
      emblaApi.on("pointerDown", stopAutoplay).on("pointerUp", startAutoplay);
    }

    return () => {
      stopAutoplay();
      if (emblaApi) {
        emblaApi
          .off("pointerDown", stopAutoplay)
          .off("pointerUp", startAutoplay);
      }
    };
  }, [emblaApi, autoplay, autoplayDelay]);

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className={`overflow-hidden ${classNames?.outerWrapper}`}
      >
        <div className={`flex ${classNames?.innerWrapper}`}>
          {columnsDivided.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`flex flex-col gap-4 shrink-0 ${classNames?.innerWrapperItem}`}
            >
              {column.map((child, itemIndex) => (
                <div
                  key={`${colIndex}-${itemIndex}`}
                  className="flex-1 min-h-0"
                  style={{
                    height: `${100 / currentRows}%`,
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={classNames?.customArrowWrapper}>
        {customArrows?.prev &&
          React.cloneElement(customArrows.prev, {
            onClick: onPrevButtonClick,
            disabled: prevBtnDisabled,
            style: { display: prevBtnDisabled ? "none" : undefined },
          })}
        {customArrows?.next &&
          React.cloneElement(customArrows.next, {
            onClick: onNextButtonClick,
            disabled: nextBtnDisabled,
            style: { display: nextBtnDisabled ? "none" : undefined },
          })}
      </div>
    </div>
  );
};

const chunk = <T,>(array: T[], size: number): T[][] => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size));
    return acc;
  }, [] as T[][]);
};

export default CustomSlider;
