import styled from 'styled-components'


export const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;

`;

export const TitleContent = styled.div`
    text-align: center;
    padding: 50px 0px 0px 0px;

    h1{
        font-size: 2rem;
        font-weight: 300;
        color: #0078D4;
        font-family: 'Roboto', sans-serif;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        letter-spacing: 10px;
    }
`;

export const BoxForm = styled.form`
    width: 500px;
    gap: 15px;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
`

export const BoxSelect = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`