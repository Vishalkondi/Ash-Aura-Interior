import { ViewTransition } from "react";

/**
 * Wraps a page's content so it glides out and the next page rises in when
 * moving between pages (styles: .page-in / .page-out in globals.css). It goes
 * in each page, not the layout, because layouts stay mounted across navigations.
 * Browsers without the View Transitions API simply switch pages.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
