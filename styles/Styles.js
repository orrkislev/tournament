import styled from "styled-components";

export const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    `;

export const Main = styled.div`
    margin-top: 50px;
    width: 45rem;
    display: flex;
    flex-direction: column;
    `;

export const SimpleTitle = styled.div`
    padding: 10px 20px;
    text-transform: uppercase;
    text-decoration: underline;
    background-color: #f5f5f5;
    color: black;
    `;

export const Button = styled.div`
    cursor: pointer;
    padding: 10px 20px;
    text-align: center;
    text-decoration: underline;
    ${props => !props.disabled && `
        &:hover {
            background-color: #f5f5f5;
            color: black;
        }
    `}
    ${props => props.disabled && `
        cursor: not-allowed;
        text-decoration: line-through;
        }
    `}
    `;
    