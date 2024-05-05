import axios from "axios";
import { url } from "inspector";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher; 