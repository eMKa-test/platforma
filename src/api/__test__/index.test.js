import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchData, getData, postData } from "../index";

describe("fetch-api", () => {
    const mock = new MockAdapter(axios);
    const reply = { response: true };
    const api = {
        url: {
            url: "localhost",
        },
        get: {
            get: "get",
        },
        post: {
            post: "post",
        },
        body: {
            page: "smth",
        },
    };
    describe("fetchData", () => {
        it("should pass get request", async () => {
            mock.onGet(api.url.url).reply(200, reply);
            const response = await fetchData(api.url, api.get);
            expect(response).toEqual(reply);
        });
        it("should pass post request", async () => {
            mock.onPost(api.url.url, api.body).reply(200, reply);
            const response = await fetchData(api.url, api.post, api.body);
            expect(response).toEqual(reply);
        });
        it("should throw an error", async () => {
            const t = () => fetchData(undefined, api.get.get);
            expect(t).toThrow(TypeError);
        });
    });

    describe("Api", () => {
        const param = { mainUrl: "localhost" };

        test("get", async () => {
            mock.onGet(api.url).reply(200, reply);
            const response = await getData(param);
            expect(response).toEqual(reply);
        });

        test("post", async () => {
            mock.onPost(api.url.url).reply(200, reply);
            const response = await postData(param);
            expect(response).toEqual(reply);
        });
    });
});
