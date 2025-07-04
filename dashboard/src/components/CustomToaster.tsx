import { ToastContainer } from "react-toastify"

const CustomToaster = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 99999 }}
            className="!fixed"
        /> 
    )
}

export default CustomToaster
