"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

type RevealElement = "div" | "section" | "article" | "aside";

type RevealProps = {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  stagger?: boolean;
} & Omit<ComponentPropsWithoutRef<"div">, "as" | "children" | "className">;

export function Reveal({
  as,
  children,
  className,
  stagger = false,
  ...props
}: RevealProps) {
  const Component = as || "div";
  const ref = useRef<HTMLElement | null>(null);
  const setElementRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const revealClassName = cn("reveal", stagger && "reveal-stagger", className);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      element.classList.add("reveal-ready");
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  if (Component === "section") {
    return (
      <section ref={setElementRef} className={revealClassName} {...props}>
        {children}
      </section>
    );
  }

  if (Component === "article") {
    return (
      <article ref={setElementRef} className={revealClassName} {...props}>
        {children}
      </article>
    );
  }

  if (Component === "aside") {
    return (
      <aside ref={setElementRef} className={revealClassName} {...props}>
        {children}
      </aside>
    );
  }

  return (
    <div ref={setElementRef} className={revealClassName} {...props}>
      {children}
    </div>
  );
}
