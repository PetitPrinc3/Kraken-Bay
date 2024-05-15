import { batch } from "@/components/batch";
import { getCache } from "@/components/cache";
import { hash } from "@/components/hash";
import { fetchWithTimeout } from "@/components/fetchWithTimeout";
import { okstatus } from "@/components/okstatus";
//import { existsSync, mkdtemp, mkdtempSync, writeFileSync } from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

//const dir = (process.env.TMP || process.env.TMP_DIR || "/tmp") + "/" + mkdtempSync("mad");

const fetchArticle = (url: string) => {
    return fetchWithTimeout(
        "https://ddg-webapp-valosan.vercel.app/url_to_text?" +
        new URLSearchParams({
            url,
        }),
        {
            method: "GET",
            headers: {
                Referrer: "https://mad.firstmark.com/card",
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            },
        }
    )
        .then(okstatus)
        .then((res) => res.json());
};

function extract_str_between(str: string, start: string, end: string) {
    const pos1 = str.indexOf(start) + start.length;
    const pos2 = str.indexOf(end, pos1);
    return str.substring(pos1, pos2);
}

const fetchBinary = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            Referrer: "https://mad.firstmark.com/card",
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        },
    })
        .then(okstatus)
        .then((res) => res.arrayBuffer());

async function parse({
    log,
    json: data,
    error,
    close,
}: {
    log: (msg: string) => void;
    json: (obj: any) => void;
    error: (msg: Error | any) => void;
    close: () => void;
}) {
    const url = "https://mad.firstmark.com/card";
    const cache = await getCache();
    const html = await cache.getset(
        "mad",
        () => {
            log("Fetching " + url);
            return fetch(url, {
                method: "GET",
                headers: {
                    Referrer: "https://mad.firstmark.com/card",
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
                },
            })
                .then(okstatus)
                .then((res) => res.text());
        },
        60 * 60 * 24
    );

    if (html) {
        const all = extract_str_between(html, '<script id="__NEXT_DATA__" type="application/json">', "</script>");
        const json = JSON.parse(all);
        const {
            props: {
                pageProps: { companies, categories, subCategories },
            },
        } = json;

        /*
        // Fetches logos
        await batch(
          companies,
          async (company: any, index) => {
            const name = company["Company Name"] as string;
            const url = company["Processed Logo URL"] as string;
            const ext = url.split(".").pop();
            const file = dir + "/" + hash(name) + "." + ext;
            if (url && name && !existsSync(file)) {
              const b = await fetchBinary(url);
              console.info("Writing", file, b.byteLength, "bytes");
              writeFileSync(file, Buffer.from(b));
            }
            if (index > 0 && index % 100 === 0) {
              console.info("Images done", index, "/", companies.length);
            }
          },
          10
        );
    
        // Fetches homepages
        await batch(
          companies,
          async (company: any, index) => {
            const name = company["Company Name"] as string;
            const url = company["URL"] as string;
            const file = dir + "/" + hash(name) + ".json";
            if (url && name && !existsSync(file)) {
              try {
                console.info("Fetching", url);
                const b = await fetchArticle(url);
                writeFileSync(file, JSON.stringify(b, null, 2));
              } catch (e) {
                console.error("Failed to fetch", url, e);
              }
            }
            if (index > 0 && index % 100 === 0) {
              console.info("Homepages done", index, "/", companies.length);
            }
          },
          10
        );
    
        // writeFileSync("companies.json", JSON.stringify(companies, null, 2))
        */

        log("Parsed " + companies.length + " companies");
        data({
            companies,
            categories,
            subCategories,
        });
        return close();
    } else {
        return error(new Error("Failed to fetch"));
    }
}

/**
 * Implements long running response. Only works with edge runtime.
 * @link https://github.com/vercel/next.js/issues/9965
 */
export default async function longRunningResponse(req: NextApiRequest, res: NextApiResponse) {
    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();
    let closed = false;

    parse({
        log: (msg: string) => {
            console.log(msg);
            writer.write(encoder.encode("data: " + msg + "\n\n"));
        },
        json: (obj: any) => writer.write(encoder.encode("data: " + JSON.stringify(obj) + "\n\n")),
        error: (err: Error | any) => {
            writer.write(encoder.encode("data: " + err?.message + "\n\n"));
            if (!closed) {
                writer.close();
                closed = true;
            }
        },
        close: () => {
            if (!closed) {
                writer.close();
                closed = true;
            }
        },
    }).then(() => {
        console.info("Done");
        if (!closed) {
            writer.close();
        }
    }).catch((e) => {
        console.error("Failed", e);
        if (!closed) {
            writer.close();
        }
    });

    return new Response(responseStream.readable, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/event-stream; charset=utf-8",
            Connection: "keep-alive",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Content-Encoding": "none",
        },
    });
}

export const config = {
    runtime: "edge",
};