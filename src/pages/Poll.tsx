import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RenderPoll from "../components/Poll/Poll/RenderPoll";

export default function Poll() {
    const { title } = useParams();

    return (
        <Layout>
            <RenderPoll title={title || ""} />
        </Layout>
    )
}