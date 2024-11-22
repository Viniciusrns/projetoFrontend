import styled from 'styled-components'


export const Container = styled.div`
    height: 100vh;

    display: flex;
    //flex-direction: column;

    justify-content: center;
    align-items: center;
`;


export const BoxLogin = styled.div`
    width: 500px;
    height: 664px;
    
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 15px;

    display: flex;
    flex-direction: column;

    overflow: hidden; 
`


export const BoxTop = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
`;

export const BoxMiddle = styled.form`
    display: flex;
    flex: 1;
    
    flex-direction: column;

    gap: 20px;
    padding-inline: 10%;

`;

export const BoxBottom = styled.div`
    background-color: purple;
`;

export const LogoImage = styled.img`
    width: 150px;
    height: 120px;
`;


export const TitlePage = styled.h1`
    font-size: 42px;
    color: #1A72AC;
`;
