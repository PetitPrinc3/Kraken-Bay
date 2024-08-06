import axios from "axios";

const fetcher = (url: string, params?: any) => axios.get(url, {
    params: params
}).then((res) => res.data);

export default fetcher; 