import { css, keyframes } from "@emotion/react";

export const getPosition = (position: number[]) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
`

export const getSize = (width: number, height: number) => css`
  width: ${width}em;
  height: ${height}em;
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


export const translate = (startPosition: number[], endPosition: number[]) => keyframes`
	0%	{ transform: translate(0, 0); }
	100%	{ transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em); }
`

export const getTranslationAnimationStyle = (startPosition: number[], endPosition: number[], animation_duration: number) => css`
	animation: ${translate(startPosition, endPosition)} ${animation_duration}s ease-in-out;
`

export const dialogStyle = css`
  border-color: lightgreen;
  background: black;
  color: white;
  text-align: center;
`

export const selecterStyle = css`
  cursor: pointer;
  border: 0.4em solid #29db06FF;
  border-radius: 1em;
  &:hover { background-color: #29db0680; }
`

