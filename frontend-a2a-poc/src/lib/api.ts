import axios from "axios"

const BASE_URL = "http://localhost:8080"

export async function createTask(input: string, proposalId: string) {
    const res = await axios.post(`${BASE_URL}/tasks`, {
        input: { type: "text", value: input },
        metadata: { proposalId, userId: "gerente-42" }
    })
    return res.data
}

export async function getTask(id: string) {
    const res = await axios.get(`${BASE_URL}/tasks/${id}`)
    return res.data
}
