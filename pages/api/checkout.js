import { initMongoose } from "../../lib/mongoose"

export default async function handler (req, res) {
    await initMongoose();

    if(req.method !== 'POST') {
        res.body('should be a post').send();
        return;
    }

    res.json('ok');
}