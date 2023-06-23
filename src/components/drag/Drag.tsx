import React from 'react';
import Moveable from "react-moveable";
// import { flushSync } from "react-dom";

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
      onDragStart={(e, c, d) => {
        // console.log("onDragStart", e, c, c);
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
        // console.log("onDrag left, top", left, top);
        // 任意一种方式更新位置
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        // target.style.transform = transform;
      }}
      onDragEnd={({ target, isDrag, clientX, clientY }) => {
        // console.log("onDragEnd", target, isDrag);
        const { left, top} = target.style
        onDragEnd && onDragEnd({ x: parseFloat(left), y: parseFloat(top) })
      }}
      resizable={resizable}
      throttleResize={0}
      onResizeStart={({ target , clientX, clientY}) => {
        // console.log("onResizeStart", target);
      }}
      onResize={({
          target, width, height,
          dist, delta, direction,
          clientX, clientY,
      }) => {
        // console.log("onResize", target);
        delta[0] && (target.style.width = `${width}px`);
        delta[1] && (target.style.height = `${height}px`);
      }}
      onResizeEnd={({ target, isDrag, clientX, clientY }) => {
        const { width, height} = target.style
        onResizeEnd && onResizeEnd({ w: parseFloat(width), h: parseFloat(height) })
      }}
      // snappable={true}
      // isDisplaySnapDigit={true}
      // elementGuidelines={["#react", ".heart"]}
      checkInput={true}
      // flushSync={flushSync} 
    />
  );
}

export default Drag