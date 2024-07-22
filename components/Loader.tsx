
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { LoaderStep } from "@/types/types";

const PhraseLoadingWrapper = styled.div`
  z-index: 9;
  width: 100%;
  height: 100vh;
`;

const PhraseSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
height:100%;
justify-content:center;
position:relative;
`;

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  to {
    transform: translateY(0);
  }
`;

const disable = keyframes`
  to {
    opacity: .3;
  }
`;

const slideOut = keyframes`
  to {
    transform: translateY(-140%);
  }
`;

interface StyleProps {
    index: number
}

const PhraseAnimation = styled.div<StyleProps>`
  position: absolute;
  opacity: 0;
padding:0px 0px 0px 100px;
  animation:
    ${slideIn} 850ms ease-out forwards,
    ${fadeIn} 850ms ease-out forwards,
    ${slideOut} 850ms ease-out forwards,
    ${disable} 850ms ease-out forwards,
    ${fadeOut} 850ms ease-out 1.5s forwards;

  @media (min-width: 1024px) {
    left: 40px;
  }

  &:first-child {
    opacity: 1;
    transform: translateY(0);
    animation:
      ${slideOut} 850ms ease-out forwards,
      ${disable} 850ms ease-out forwards,
      ${fadeOut} 850ms ease-out 1.5s forwards;
  }

  &.${props => `PhraseAnimation-${props.index}`} {
    animation:
      ${slideIn} 850ms ease-out forwards,
      ${fadeIn} 850ms ease-out forwards,
      ${slideOut} 850ms ease-out forwards,
      ${fadeOut} 850ms ease-out forwards;
  }

  &:last-child {
    animation:
      ${slideIn} 850ms ease-out forwards,
      ${fadeIn} 850ms ease-out forwards;
  }
`;

const PhraseTypography = styled.h1`
  color: #000000;
  font-size: 24px;

  @media (min-width: 1024px) {
    font-size: 46px;
  }
`;

interface LoaderProps {
    steps: LoaderStep[]
}
export const Loader: React.FC<LoaderProps> = ({ steps }) => {
    const [stepCount, setStepCount] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepCount((prevCount) => prevCount + 1);
        }, 1500);

        if (stepCount === steps.length) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [stepCount, steps.length]);

    return (
        <PhraseLoadingWrapper>
            <PhraseSectionWrapper>
                {steps.slice(0, stepCount).map((step, index) => (
                    <PhraseAnimation key={index} index={index}>
                        <PhraseTypography>{step.title}</PhraseTypography>
                    </PhraseAnimation>
                ))}
            </PhraseSectionWrapper>
        </PhraseLoadingWrapper>
    );
};

