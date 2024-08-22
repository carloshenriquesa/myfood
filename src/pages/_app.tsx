import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css'
import type { AppProps } from "next/app";
import { FormProvider } from "@/context/FormContext";
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <FormProvider>
            <div>
                <Component {...pageProps} />;
                <ToastContainer />
            </div>
        </FormProvider>
    )
}
