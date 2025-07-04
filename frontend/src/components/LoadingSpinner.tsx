

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center px-2 py-2">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tertiary"></div>
            </div>
        </div>
    )
}

export default LoadingSpinner
