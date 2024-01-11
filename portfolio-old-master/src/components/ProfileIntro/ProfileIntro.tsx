import React from 'react';
import { Link } from 'react-router-dom';
import ArrowDownIcon from '../icons/ArrowDownIcon/ArrowDownIcon';
import { styled } from 'styled-components';

const Container = styled.div`
    display: flex;
    width: 85%;
    flex-direction: column;

    color: #665C5F;
    text-transform: uppercase;

    h1 {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin: 0px;
    }
    
    p {
        font-size: 16px;
        font-weight: 500;
        line-height: 18px;
        margin: 0px;
    }

    @media (min-width: 1248px) {
        display: flex;
        margin-top: 64px;
        flex-direction: column;
        width: 525px;
    
        justify-content: center;
        color: #665C5F;
        text-transform: uppercase;
        gap: 16px;

        h1 {
            font-size: 32px;
            font-weight: 500;
            line-height: 38px;
            margin: 0px;
        }
        
        p {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            margin: 0px;
        }
    }
`

const Title = styled.div`
    display: flex;
    align-items: center;

    h2 {
        font-size: 36px;
        font-weight: 500;
        line-height: 42px;
        margin: 0px;
    }

    h3 {
        color: #EA4476;
        width: 100px;
        font-size: 20px;
        font-weight: 800;
        line-height: 28px;
        margin: 0px;
    }

    @media (min-width: 1248px) {
        display: flex;
        align-items: center;
        
        h3 {
            color: #EA4476;
            width: 240px;
            font-size: 48px;
            font-weight: 500;
            line-height: 28px;
            margin: 0px;
        }
        
        h2 {
            font-size: 64px;
            font-weight: 500;
            line-height: 75px;
            margin: 0px;
        }
    }
`

const Button = styled.div`
    text-align: center;
`

const ProfileIntro: React.FC = () => {
    return (
    <Container>
        <h1>Oi, eu sou a Jullie</h1>
        <Title>
            <h2>Fullstack Developer</h2>
            <h3>{'< />'}</h3>
        </Title>
        <p>Tenho 22 anos e sou desenvolvedora fullstack com 1 ano de experiência trabalhando no mercado.</p>
        <Button>
            <Link to="about"><ArrowDownIcon /></Link>
        </Button>
    </Container>
)}

export default ProfileIntro;