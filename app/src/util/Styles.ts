import { css, keyframes } from "@emotion/react";

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

export const outlineStyle = css`
  filter: drop-shadow(0 -0.2em 0 black) drop-shadow(0 0.2em 0 black) drop-shadow(-0.2em 0 0 black) drop-shadow(0.2em 0 0 black);
`
