import styled from "styled-components";

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
    border-radius: 4px;
    text-decoration: underline;
    transition: all 0.1s ease-in-out;
    ${props => !props.disabled && `
        &:hover {
            background-color: #f5f5f566;
            color: black;
        }
    `}
    ${props => props.disabled && `
        cursor: not-allowed;
        text-decoration: line-through;
        }
    `}
    `;

export const TinyTitle = styled.div`
    font-size: 0.8rem;
    text-decoration: underline;
    color: #555;
    font-size: 0.8rem;
    `;