import { css, keyframes } from "@emotion/react";

export const translate = (startPosition: number[], endPosition: number[]) => keyframes`
	0%	{ transform: translate(0, 0); }
	100%	{ transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em); }
`

export const getTranslationAnimationStyle = (startPosition: number[], endPosition: number[], animation_duration: number) => css`
	animation: ${translate(startPosition, endPosition)} ${animation_duration}s ease-in-out;
`
