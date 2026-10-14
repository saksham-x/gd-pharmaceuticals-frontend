import { Fragment } from "react";

// ========================================
// LINES
//
// Staff type a line break where a title
// should wrap ("Medicines made in\nNepal.");
// this turns each one into a <br>.
// ========================================

export default function Lines({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
