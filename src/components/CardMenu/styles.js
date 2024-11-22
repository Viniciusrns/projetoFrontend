import styled from 'styled-components'


export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 150px;
    border-radius: 15px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    background-color: ${({ backgroundColor }) => backgroundColor};
    h1 {
        color: ${({ color }) => color};
        font-size: 1.5rem;
    }
    transition: all 0.3s ease-in-out;
    &:hover {
        opacity: .9;
    }
`;