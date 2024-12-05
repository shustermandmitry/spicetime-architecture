/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';

const Button = ({ children, ...props }) => {
  const theme = useTheme();
  const buttonStyle = css`
    background: ${theme.colors.primary};
    color: white;
    padding: ${theme.spacing(1)};
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  return (
    <button css={buttonStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;