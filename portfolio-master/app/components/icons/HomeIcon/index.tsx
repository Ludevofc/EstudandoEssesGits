import { useDeviceContext } from "@/app/context/DeviceContext";

const HomeIcon = () => {
    const { isMobile } = useDeviceContext();

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_70_35)">
                <path d="M8 14.4C4.48 14.4 1.6 11.52 1.6 8C1.6 4.48 4.48 1.6 8 1.6C11.52 1.6 14.4 4.48 14.4 8C14.4 11.52 11.52 14.4 8 14.4ZM8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7.2 9.6H8.8V12H11.2V8H12.8L8 4L3.2 8H4.8V12H7.2V9.6Z" fill={isMobile ? 'var(--secondary-color)' : 'var(--background-primary)'} />
            </g>
            <defs>
                <clipPath id="clip0_70_35">
                    <rect width="16" height="16" fill={isMobile ? 'var(--secondary-color)' : 'var(--background-primary)'} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default HomeIcon