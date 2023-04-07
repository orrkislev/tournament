import styled from "styled-components";

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