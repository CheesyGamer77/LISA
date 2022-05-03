import express from "express";
import "./ImageIndex";
import SearchIndex from "./ImageIndex";

// setup image index
const index = new SearchIndex();
index.sync();

// setup express server
const port = 3000;
const app = express();
app.use(express.json());

app.get("/search/:phash", (req, res) => {
    const hashQuery = req.params["phash"];

    if(index.contains(hashQuery)) {
        res.status(200).json({
            "hash": hashQuery
        });
    }
    else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});