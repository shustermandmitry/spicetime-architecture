// Stage 0: Traditional React + TypeScript
import React from 'react';
import { StyleProps, ButtonProps } from './types';
import { addStyles, addBehavior } from './utils';

export const Button: React.FC<ButtonProps> = (props) => {
  const styledProps = addStyles(props, defaultTheme);
  const withBehavior = addBehavior(styledProps);
  return <button {...withBehavior}>{props.children}</button>;
};

// Stage 1: Initial Composition (Still valid TS)
const { compose, style, behave } = spicetime;

export const Button = compose(
  style(defaultTheme),
  behave,
  render
)(buttonProps);

// Stage 2: Destructure Everything Needed
const {
  compose, style, behave, render,
  theme, props
} = perspective;  // Gets from spicetime tree at this perspective

export const Button = compose(
  style(theme),
  behave,
  render
) props;

// Stage 3: Linguistic Flow (Still valid TS via transform)
const {
  style, behave, render,
  theme, button
} = perspective;

export const Button = 
  style button with theme
  then behave
  then render;

// Stage 4: Pure Description 
// Note: Processed by spicetime-react-app automation
const {
  style, behave, render,
  theme, button
} = perspective;

export const Button = cookUpComponent(`
  style primary button using theme
  make it clickable and accessible
  show label centered with icon
`);

// Stage 5: Just Description
// Note: Custom editor injects perspective and handles transformation
export const Button = `
  primary button that fits theme
  clicks and shows feedback
  centers text with left icon
`;

// The magic that makes it work (simplified)
const cookUpComponent = (description: string) => {
  // AI/interpreter processes description
  const structure = parseToExecutableForm(description);
  
  // Returns valid React component
  return compose(
    ...structure.transformations
  )(structure.props);
};

// What it actually generates (but you never see this)
const CompiledButton = {
  type: 'button',
  variant: 'primary',
  style: theme.buttons.primary,
  behavior: {
    onClick: withFeedback(handler),
    accessibility: true
  },
  layout: {
    content: {
      icon: { position: 'left' },
      text: { align: 'center' }
    }
  }
};