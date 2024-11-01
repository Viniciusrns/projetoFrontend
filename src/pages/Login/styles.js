import styled from 'styled-components'


export const Container = styled.div`
    height: 100vh;

    display: flex;
    //flex-direction: column;

    justify-content: center;
    align-items: center;
`;


export const BoxLogin = styled.div`
    width: 650px;
    height: 700px;
    
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
    text-align: center;
    padding: 20px;
`;

export const BoxMiddle = styled.div`
    display: flex;
    flex: 1;
    
    flex-direction: column;
    background-color: #FFD7D775;

    gap: 20px;
`;

export const BoxBottom = styled.div`
    background-color: purple;
`;

export const TitleEnterprise = styled.h1`
    font-size: 32px;
    //color: #8AFD9DFF;
    color: #818181FF;
`;

export const TitlePage = styled.h1`
    font-size: 68px;
    color: #22D640FF;
`;
