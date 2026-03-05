import { Router } from "express"
import { identifyContact } from "../services/contactService"

const router = Router()

router.post("/", async (req, res) => {

  const { email, phoneNumber } = req.body

  if (!email && !phoneNumber) {
    return res.status(400).json({
      error: "Either email or phoneNumber must be provided"
    })
  }

  try {
    const result = await identifyContact(email, phoneNumber)

    res.status(200).json({ contact: result })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router