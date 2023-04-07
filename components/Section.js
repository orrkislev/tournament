
import styled from "styled-components";

const SectionDiv = styled.div`
display: flex;
gap: 1rem;
@media (max-width: 768px) {
    flex-direction: column;
    gap:0;
}
`;
const SectionSide = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    font-size: 0.8rem;
    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

const SectionSideTitle = styled.div`
    font-weight: bold;
    color: #555;
`;


const SectionContent = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
gap: 1rem;
flex: 6;
border-radius: 10px;
${props => props.isAction && `
    background-color: #f5f5f5;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`}
${props => props.info && `
    background-color: #f5f5f566;
`}
@media (max-width: 768px) {
    padding: 0.5rem;
}
`;

export default function Section(props) {
    return (
        <SectionDiv>
            <SectionSide>
                <SectionSideTitle>{props.title}</SectionSideTitle>
                {props.sideContent}
            </SectionSide>
            <SectionContent isAction={props.action} info={props.info}>
                {props.children}
            </SectionContent>
            <SectionSide></SectionSide>
        </SectionDiv>
    )
}