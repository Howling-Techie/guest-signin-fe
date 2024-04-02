export const Container = ({children}) => {
    return (
        <div className="container mx-auto sm:px-6 lg:px-8 text-gray-900 bg-white min-w-full min-h-screen h-full">
            {children}
        </div>
    )
}