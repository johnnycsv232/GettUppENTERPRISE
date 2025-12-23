import https from "node:https";

const apiKey = "AIzaSyCKWNo6YPp1Iw4RUaSSEvCbqvwd0x-vP2Y";

console.log("Fetching available models via REST API...");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https
	.get(url, (res) => {
		let data = "";

		res.on("data", (chunk) => {
			data += chunk;
		});

		res.on("end", () => {
			if (res.statusCode !== 200) {
				console.error(
					`API Request Failed: ${res.statusCode} ${res.statusMessage}`,
				);
				console.error("Body:", data);
				process.exit(1);
			}

			try {
				const json = JSON.parse(data);
				if (!json.models) {
					console.error("No models found in response:", data);
					process.exit(1);
				}

				console.log("Available Models:");
				const modelNames = json.models.map((m) => m.name);
				modelNames.forEach((name) => console.log(` - ${name}`));

				// Check for flash
				const flash = modelNames.find(
					(n) => n.includes("flash") && n.includes("1.5"),
				);
				if (flash) {
					console.log(
						`\nRECOMMENDATION: Use '${flash.replace("models/", "")}'`,
					);
				} else {
					console.log("\nWARNING: No Gemini 1.5 Flash model found.");
				}

				process.exit(0);
			} catch (e) {
				console.error("Failed to parse JSON:", e.message);
				console.log("Raw Data:", data);
				process.exit(1);
			}
		});
	})
	.on("error", (err) => {
		console.error("Network Error:", err.message);
		process.exit(1);
	});
