import { useParams } from "react-router-dom";

const TryStuff = () => {
    const params = useParams();
    console.log(params);
    return(
        <h1>S</h1>
    )
}
export default TryStuff;