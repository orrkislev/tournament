
const SectionDiv = styled.div`
margin: 1rem 0;
display: flex;
gap: 1rem;
`;
const SectionSide = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
gap: 1rem;
flex: 1;
font-size: 0.8rem;
`;

const SectionSideTitle = styled.div`
font-weight: bold;
color: #555;
`;

import styled from "styled-components";

const SectionContent = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
gap: 1rem;
flex: 6;
border-radius: 10px;
${props => props.action && `
    background-color: #f5f5f5;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`}
${props => props.info && `
    background-color: #f5f5f566;
`}
`;

export default function Section(props) {
    return (
        <SectionDiv>
            <SectionSide>
                <SectionSideTitle>{props.title}</SectionSideTitle>
                {props.sideContent}
            </SectionSide>
            <SectionContent action={props.action} info={props.info}>
                {props.children}
            </SectionContent>
            <SectionSide></SectionSide>
        </SectionDiv>
    )
}