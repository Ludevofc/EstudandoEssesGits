import CVIcon from '../../components/icons/CVIcon/CVIcon';
import GitHubIcon from '../../components/icons/GitHubIcon/GitHubIcon';
import LinkedInIcon from '../../components/icons/LinkedInIcon/LinkedInIcon';
import MailIcon from '../../components/icons/MailIcon/MailIcon';
import { styled } from 'styled-components';
import { Outlet } from 'react-router-dom';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 1248px) {
    display: flex;
    flex-direction: column;
    height: 100vh;

    justify-content: center;
    align-items: center;
  }
`

const ProfileContainer = styled.section`
  display: flex;
  padding: 16px;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  img {
    width: 80%;
    border-radius: 50%;
    border: solid 3px #EA4476;
  }

  @media (min-width: 768px) {
    display: flex;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 128px;

    img {
      width: 50%;
      border-radius: 50%;
      border: solid 3px #EA4476;
    }
  }

  @media (min-width: 1248px) {
    display: flex;
    height: 320px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 64px;

    img {
      width: 330px;
      height: 330px;
      border-radius: 50%;
      border: solid 3px #EA4476;
    }
  }
`

const Icons = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;

  justify-content: space-around;

  @media (min-width: 768px) {
    display: flex;
    width: 100%;
    flex-direction: row;

    justify-content: space-around;
  }

  @media (min-width: 1248px) {
    display: flex;
    width: auto;
    flex-direction: column;

    justify-content: center;
    gap: 16px;
  }
`

function Home() {
  return (
    <HomeContainer>
      <ProfileContainer>
        <Icons>
          <a href="https://www.linkedin.com/in/jlpaixaof/" target='blank'>
            <LinkedInIcon />
          </a>
          <a href="https://github.com/julliepx" target='blank'>
            <GitHubIcon />
          </a>
          <a href="mailto:jlpaixaof@gmail.com" target='blank'>
            <MailIcon />
          </a>
          <a href="CurriculoJulliePaixao.pdf" target='blank'>
            <CVIcon />
          </a>
        </Icons>
          <Outlet />
        <img src="https://github.com/julliepx.png" alt="Foto de Jullie Paixão, com a língua de fora e usando um headphone preto." />
      </ProfileContainer>
    </HomeContainer>
  );
}

export default Home;