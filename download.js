export default async function handler(req, res) {
    try {
        const { url } = req.query

        if (!url) {
            return res.status(400).json({ error: "URL is required" })
        }

        // Mirip code kamu
        const params = new URLSearchParams({
            q: "spotify",
            url: url
        })

        const apiUrl = "https://api.covenant.sbs/api/spotify/download?" + params

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-api-key": process.env.API_KEY // aman (env)
            }
        })

        const data = await response.json()

        return res.status(200).json(data)

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}