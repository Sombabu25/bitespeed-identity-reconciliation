import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function identifyContact(email?: string, phoneNumber?: string) {

  // 1️⃣ Find existing contacts with same email or phone
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  })

  // 2️⃣ If no contacts found → create primary
  if (contacts.length === 0) {

    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    })

    return {
      primaryContactId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: []
    }
  }

  // 3️⃣ Determine primary contact
  let primary = contacts.find(c => c.linkPrecedence === "primary") || contacts[0]

  // 4️⃣ Create secondary if new info appears
  const emailExists = contacts.some(c => c.email === email)
  const phoneExists = contacts.some(c => c.phoneNumber === phoneNumber)

  if ((!emailExists && email) || (!phoneExists && phoneNumber)) {

    const secondary = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    })

    contacts.push(secondary)
  }

  // 5️⃣ Collect all linked contacts
  const linkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    },
    orderBy: { createdAt: "asc" }
  })

  const emails = [...new Set(linkedContacts.map(c => c.email).filter(Boolean))]
  const phones = [...new Set(linkedContacts.map(c => c.phoneNumber).filter(Boolean))]

  const secondaryIds = linkedContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id)

  return {
    primaryContactId: primary.id,
    emails,
    phoneNumbers: phones,
    secondaryContactIds: secondaryIds
  }
}