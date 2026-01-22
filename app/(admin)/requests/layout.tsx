interface AppointmentsLayoutProps {
    children: React.ReactNode
}

export default function AppointmentsLayout({ children }: AppointmentsLayoutProps) {
    return <div className="">
            {children}
    </div>
}