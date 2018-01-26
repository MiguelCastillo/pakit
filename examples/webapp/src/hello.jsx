/**
 * hello world module
 */

import React from "react";
import Span from "./span.jsx";
import helloJSON from "./hello.json";
import "./hello.css";

export default function Hello() {
  return <Span className="hello">Hello - {helloJSON.hello} -</Span>;
}
