import axios from "axios";
import {enc, HmacSHA256, SHA256} from "crypto-js";
import moment from "moment";
import _ from "lodash";
import {v4} from "uuid";

export const ApiConfig = {
    signingKey: ""
}

export const request = axios.create({
    baseURL: "/"
})

const signHeaders = (headers: {
    [key: string]: string
}, key: string): string => {
    const headerString = Object.keys(headers).map(key => {
        return key.toLowerCase();
    })
    // compute sig here
    var signingBase = '';

    for (const [key, value] of Object.entries(headers)) {
        if (signingBase !== '') {
            signingBase += '\n';
        }

        signingBase += key.toLowerCase() + ": " + value;
    }

    const signature = HmacSHA256(signingBase, key).toString();

    return `headers="${headerString}",signature="${enc.Base64.stringify(enc.Utf8.parse(signature))}"`;
}

request.interceptors.request.use(async (request) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        if (!request.headers) {
            request.headers = {};
        }

        request.headers["Authorization"] = `Bearer ${token}`

        if (ApiConfig.signingKey) {
            if(request.data) {
                request.headers["Digest"] = `SHA256=${SHA256(JSON.stringify(request.data)).toString()}`;
            }

            request.headers["X-Request-Time"] = moment().toISOString();
            request.headers["Trace-Id"] = v4();

            const headers = _.pick(request.headers, ["Authorization", "Trace-Id", "X-Request-Time", "Digest"]) as { [key: string]: string }
            request.headers["Signature"] = signHeaders(headers, ApiConfig.signingKey);
        }
    }

    return request;
})