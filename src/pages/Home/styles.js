import styled from 'styled-components'


export const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;

`;

export const TitleContent = styled.div`
    text-align: center;
`;


export const GreetingText = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(90deg, #0078D4, #1E90FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Poppins', sans-serif;
`;

export const WelcomeText = styled.h1`
  font-size: 2rem;
  font-weight: 300;
  color: #0078D4;
  font-family: 'Roboto', sans-serif;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

export const MenuContent = styled.div`
    display: flex;
    gap: 20px;
    padding: 30px;
    overflow: visible; 
`;