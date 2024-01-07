// check the terminal for the console log in the api.
export default async function handler(req, res) {

    try {
        const new_row = await notion.pages.create({
            parent: {
                database_id: DATABASE_ID
            },
            properties: {},
        });

        const formData = JSON.parse(req.body);
        console.log(formData)
        console.log(formData["rData"])

        for (const [key, value] of Object.entries(formData["rData"])) {
            let propertyValue = {};

            console.log(`value: ${value}`);
            if (key === "brand") {
                propertyValue.title = [
                    {
                        text: {
                            content: value,
                        },
                    },
                ];
            } else {
                propertyValue.rich_text = [
                    {
                        text: {
                            content: value,
                        },
                    },
                ];
            }

            await notion.pages.update({
                page_id: new_row.id,
                properties: {
                    [key]: propertyValue,
                },
            });
        }

        const row = await notion.pages.retrieve({ page_id: new_row.id });
        const row_link = row.url

        const data = {
            link: row_link,
        };

        console.log(row_link)

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
