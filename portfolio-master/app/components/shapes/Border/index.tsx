type Props = {
    corner: string
}

const Border = ({corner} : Props) => {
    return (
        <svg 
        style={corner == 'bottom-right' ? {transform: 'rotate(180deg)'} : {transform: 'rotate(0deg)'}}
        width="182" height="174" viewBox="0 0 182 174" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M181.5 11.5L0 0L10.5 174V11.5H181.5Z" fill="var(--primary-pink)" />
        </svg>
    )
}

export default Border