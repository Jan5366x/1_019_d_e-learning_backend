import express from "express";

const router: express.Router = express.Router();

router.post("/signup", (req, res) => {
    res.status(200).json({ message: "OK!" });
});

router.post("/login", (req, res) => {
    res.status(200).json({ message: "OK!" });
});

router.post("/logout", (req, res) => {
    res.status(200).json({ message: "OK!" });
});

router.post("/grant", (req, res) => {
    res.status(200).json({ message: "OK!" });
});

router.post("/revoke", (req, res) => {
    res.status(200).json({ message: "OK!" });
})

router.get("/permission", (req, res) => {
    res.send("Permission Here");
})

export default router;