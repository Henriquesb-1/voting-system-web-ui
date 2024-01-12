import { toast, Theme } from "react-toastify";

export default abstract class FeedBack {

    public static success(message: string, theme: Theme = "light") {
        toast.success(message, { autoClose: 3000, hideProgressBar: true, theme: theme })
    }

    public static error(message: string, theme: Theme = "dark") {
        toast.error(message, { autoClose: 3000, hideProgressBar: true, theme: theme })
    }

    public static warning(message: string, theme: Theme = "dark") {
        toast.warning(message, { autoClose: 3000, hideProgressBar: true, theme: theme })
    }
}