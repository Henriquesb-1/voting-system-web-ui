import { useSearchParams } from "react-router-dom";
import Polls from "../components/Poll/Polls/Polls";
import Layout from "../components/layout/Layout";

export default function Home() {
    const [searchParams] = useSearchParams();

    return (
        <Layout>
            <Polls currentPage={searchParams.get("page") || "1"} />
        </Layout>
    )
}