import React from 'react';
import Moveable from "react-moveable";
import { flushSync } from "react-dom";

import './index.module.styl'

const Drag = ({
  target,
  container = document.body,
  draggable = true,
  dragTarget,
  onDragStart,
  onDrag,
  onDragEnd,
  resizable = true,
  onResizeStart,
  onResize,
  onResizeEnd
}) => {
  return (
    <Moveable
      target={target}
      container={container}
      draggable={draggable}
      // dragTarget={document.querySelector("#header")}
      throttleDrag={0}
      onDragStart={({ target, clientX, clientY }) => {
          console.log("onDragStart", target);
      }}
      onDrag={({
          target,
          beforeDelta, beforeDist,
          left, top,
          right, bottom,
          delta, dist,
          transform,
          clientX, clientY,
      }) => {
          console.log("onDrag left, top", left, top);
          // target!.style.left = `${left}px`;
          // target!.style.top = `${top}px`;
          console.log("onDrag translate", dist);
          target.style.transform = transform;
      }}
      onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
      }}
      resizable={resizable}
      throttleResize={0}
      onResizeStart={({ target , clientX, clientY}) => {
          console.log("onResizeStart", target);
      }}
      onResize={({
          target, width, height,
          dist, delta, direction,
          clientX, clientY,
      }) => {
          console.log("onResize", target);
          delta[0] && (target.style.width = `${width}px`);
          delta[1] && (target.style.height = `${height}px`);
      }}
      onResizeEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onResizeEnd", target, isDrag);
      }}
      // snappable={true}
      // isDisplaySnapDigit={true}
      // elementGuidelines={["#react", ".heart"]}
      checkInput={true}
      flushSync={flushSync} 
    />
  );
}

export default Drag