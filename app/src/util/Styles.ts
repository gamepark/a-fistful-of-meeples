import { css, keyframes } from "@emotion/react";
import { dialogHeight, dialogLeft, dialogTop, dialogWidth } from "./Metrics";

export const getPosition = (position: number[]) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
`

export const getSize = (width: number, height: number) => css`
  width: ${width}em;
  height: ${height}em;
`

export const getZIndex = (index: number) => css`
  z-index: ${index};
`

const translateAnimation = (startPosition: number[], endPosition: number[]) => keyframes`
	0%	{ transform: translate(0, 0); }
	100%	{ transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em); }
`

export const getTranslateAnimationStyle = (startPosition: number[], endPosition: number[], animation_duration: number) =>
  css`
  position: absolute;
  left: ${startPosition[0]}em;
  top: ${startPosition[1]}em;
  animation: ${translateAnimation(startPosition, endPosition)} ${animation_duration}s ease-in-out;
`


export const fullSizeStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

export const hideWhenHoverStyle = css`
  opacity: 1;
  &:hover {
    opacity: 0;
  }
`

export const showWhenHoverStyle = css`
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`


export const dialogArea = css`
  position: absolute;
  left: ${dialogLeft}em;
  top: ${dialogTop}em;
  width: ${dialogWidth}em;
  height: ${dialogHeight}em;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`

export const dialogStyle = css`
  border-color: lightgreen;
  border: 0.4em solid #29db06FF;
  border-radius: 2em;
  background: black;
  color: white;
  padding: 3em;
`

export const dialogTitleStyle = css`
  font-size: 4em;
  text-shadow: 0 0 0.3em black;
`


export const selecterStyle = css`
  cursor: pointer;
  border: 0.4em solid #29db06FF;
  border-radius: 1em;
  &:hover { background-color: #29db0680; }
`

export const darkOutlineStyle = css`
  filter: drop-shadow(0 0 0.02em black) drop-shadow(0 0 0.02em black);
`

export const lightOutlineStyle = css`
  filter: drop-shadow(0 0 0.02em white) drop-shadow(0 0 0.02em white);
`

