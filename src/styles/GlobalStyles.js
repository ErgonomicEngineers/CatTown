import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    font-family: 'Comic Neue', 'Segoe UI', sans-serif;
    background: ${(props) => props.theme.colors.background};
  }

  h1 {
    font-family: 'MedievalSharp', cursive;
    text-align: center;
    color: #4a3c28;
    margin-bottom: 2rem;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  h2 {
    font-family: 'MedievalSharp', cursive;
    color: #6b563f;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

export default GlobalStyles;
