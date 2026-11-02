"use client";

import { useEffect, useId, useState } from "react";
import { leadSourceValue } from "@/lib/leadSource";

/**
 * Hidden fields every lead form needs: the honeypot, the time the form was
 * shown (instant submissions are bots) and where the visitor came from.
 * Values live in state because a hidden input changed by hand resets on re-render.
 */
export function LeadFields() {
  const id = useId();
  const [startedAt, setStartedAt] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    setStartedAt(String(Date.now()));
    setSource(leadSourceValue());
  }, []);

  return (
    <>
      {/* Spam trap: hidden from people, often filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="source" value={source} />
    </>
  );
}
