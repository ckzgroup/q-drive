interface VehiclesLayoutProps {
    children: React.ReactNode
}

export default function VehiclesLayout({ children }: VehiclesLayoutProps) {
    return <div className="">
            {children}
    </div>
}