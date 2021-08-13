import { createCharge } from "vanna/api"

export default async (req, res) => {
  const {serviceId, taxId, name, email} = req.body
  const [error, charge] = await createCharge({
    serviceId,
    taxId,
    name,
    email
  })
  console.log(charge)

  if(error) {
    res.json({error: error})
  } else {
    res.json({charge})
  }
}