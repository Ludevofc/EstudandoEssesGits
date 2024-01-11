import { styled } from 'styled-components'
import { Link } from 'react-router-dom'
import ArrowDownIcon from '../icons/ArrowDownIcon/ArrowDownIcon'

const Container = styled.div`
    display: flex;
    width: 85%;
    flex-direction: column;

    color: #665C5F;
    text-transform: uppercase;
    text-align: left;

    p {
      font-size: 22px;
      font-weight: 500;
      line-height: 18px;
      margin: 0px;
    }

    @media (min-width: 1248px) {
        display: flex;
        margin-top: 64px;
        width: 525px;
        flex-direction: column;
    
        color: #665C5F;
        text-transform: uppercase;
        gap: 16px;
    
        p {
            font-size: 24px;
            font-weight: 500;
            line-height: 24px;
            margin: 0px;
        }
    }
`

const Button = styled.div`
    text-align: center;
`

const About = () => {
  return (
    <Container>
        <p>Sou uma entusiasta da engenharia de software com uma paixão especial por qualidade. Com uma sólida formação em desenvolvimento de software, adquiri experiência trabalhando com diversas tecnologias, incluindo Java, Spring Framework, Typescript, Angular e, mais recentemente, React. Essa experiência me permitiu ter uma visão abrangente e integrada dos projetos em que estou envolvida, desde o design até a entrega final.</p>
        <Button>
            <Link to="/"><ArrowDownIcon /></Link>
        </Button>
    </Container>
  )
}

export default About